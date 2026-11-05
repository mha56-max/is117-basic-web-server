const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('Hello, IS117! Your web server is working.');
});

app.get('/about', (req, res) => {
  res.send('This is the About page.');
});

app.use((req, res) => {
  res.status(404).send('Page not found.');
});

module.exports = app;