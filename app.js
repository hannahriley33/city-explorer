const express = require('express');
const data = require('./geo.js');
const app = express();
const request = require('superagent');
const cors = require('cors');
//change

app.get('/', (request, respond) => respond.send('Hello World!'));
const port = process.env.PORT || 3000;

app.get('/location/', (request, respond) => {
    const cityData = data.results[0];
    respond.json({
        formatted_query: cityData.formatted_address,
        latitude: cityData.geometry.location.lat,
        longitude: cityData.geometry.location. lng
        
    });
})

app.get('/weather', (request, respond) => {
    // use lat and long from earlier to get weather data for the selected area
    
    // res.json that weather data in the appropriate form
})

app.get('*', (request, respond) => respond.send('404!!'));

// when testing this needs to move to index.js
app.listen(port, () => {
    console.log('running . . . ', port)});

    module.exports = { app };