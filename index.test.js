const request = require('supertest');
const app = require('./index');

describe('Web Server', () => {
  test('home page works', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toContain('Hello, IS117!');
  });

  test('about page works', async () => {
    const response = await request(app).get('/about');
    expect(response.status).toBe(200);
    expect(response.text).toBe('This is the About page.');
  });

  test('wrong page returns 404', async () => {
    const response = await request(app).get('/anything');
    expect(response.status).toBe(404);
    expect(response.text).toBe('Page not found.');
  });
});