require ('dotenv').config();
const express = require('express');
const data = require('./geo.js');
const app = express();
const request = require('superagent');
const cors = require('cors');

// why do we need this again??
app.use(cors());

app.get('/', (req, res) => res.send('Hello World!'));

// initialize global state of lat and long
let lat;
let long;

app.get('/location', async(req, res, next) => {
    try {
    const location = req.query.search;
    
    const URL = `https://us1.locationiq.com/v1/search.php?key=${process.env.MY_API_KEY}&q=${location}&format=json`;
    const cityData = await request.get(URL);
    const firstResult = cityData.body[0];

// update global state of lat and long so that they are accessible in other routes
    lat = firstResult.lat;
    long = firstResult.lon;


    res.json({
        formatted_query: firstResult.display_name,
        latitude: lat,
        longitude: long,
    });
    }catch (err) {
    next(err);
    }
});
const getWeatherData = async(lat, long) => {
    const weather = await request.get(`https://api.darksky.net/forecast/${process.env.WEATHER_KEY}/${lat},${long}`);

    return weather.body.daily.data.map(forecast => {
        return {
            forecast: forecast.summary,
            time: new Date(forecast.time * 1000),
        };
    })
};


app.get('/weather', async(req, res, next) => {
    // use lat and long from earlier to get weather data for the selected area
    try {
    const portlandWeather = await getWeatherData(lat, long);
    // res.json that weather data in the appropriate form
    res.json(portlandWeather);
    } catch (err) {
        next(err);
    }
})



const getYelpInfo = async(lat, long) => {
    const url=(`https://api.yelp.com/v3/businesses/search?${lat}&${long}`)
    console.log(url)

    const yelpEvents = await request.get(`https://api.yelp.com/v3/businesses/search?latitude=${lat}&longitude=${long}`)
    .set('Authorization', `Bearer ${process.env.YELP_KEY}`);
    return yelpEvents.body.businesses.map(business => {
        return {
            name: business.name,
            location: business.location.address1
        }
    })
}

app.get('/yelp', async (req, res, next) => {
    try {
        
        const portlandYelp = await getYelpInfo(lat, long)
        res.json(portlandYelp);
        
    } catch (err) {
        
        next(err);
    }
})

const getTrailData = async(lat, long) => {
    const trailData = await request.get(`https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${long}&maxDistance=10&key=${process.env.TRAIL_KEY}`)
    return trailData.body.trails.map(trail => {
        return {
            name: trail.name,
            summary: trail.summary,
            stars: trail.stars,
        }
    })
}

app.get('/trails', async (req, res, next) => {
    try {
        const trailData = await getTrailData(lat, long)
        res.json(trailData)
    } catch (err) {
        next(err);
    }
})

app.get('/events', async(req, response, next) => {
    try {
        const eventfulData = await request.get(`http://api.eventful.com/json/events/search?app_key=${process.env.EVENTFUL_API_KEY}&where=${lat},${long}&within=25&page_size=20&page_number=1`);
        const eventData = JSON.parse(eventfulData.text); 

        const events = eventData.events.event.map(event => {
            return {
                'link': event.url,
                'name': event.title,
                'event_date': event.start_time,
                'summary': event.description
            };
        });
        response.json(events);
    }
    catch (err){
        next(err);
    }
});



app.get('*', (req, res) => res.send('404!!!!! sorry :('));




    module.exports = { app };