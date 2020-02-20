const { app } = require('../app.js')
const request = require('supertest');

describe('/get /location', () => {
    test('it should return the location object', async(done) => {
        const response = await request(app)
            .get('/location');
        expect(response.body).toEqual({
            formatted_query: expect.any(String),
            latitude: expect.any(String),
            longitude: expect.any(String),
        })
        expect(response.statusCode).toBe(200);
        done();
        });
});

describe('/get /trails', () => {
    test('it should return the events in the specified location', async(done) => {
        const response1 = await request(app)
            .get('/location')
            .get('/events')
    })
})