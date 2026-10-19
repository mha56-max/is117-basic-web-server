// Node.js runs this JavaScript outside the browser.
// Express is a package that helps us build a web server.
const express = require('express');
const path = require('node:path');

// The app holds the rules for responding to requests.
const app = express();

// JSON is a text format for sending structured data, such as { "text": "Hi!" }.
// This middleware reads a JSON request body and puts its data in req.body.
// Clients must send the header Content-Type: application/json.
app.use(express.json());

// Our tiny "storage": one message, initially missing (null).
// All clients share this variable. Restarting the server clears it.
// A real application would usually store its data in a database.
let message = null;

// A GET request for / now sends an HTML page instead of a plain text greeting.
// __dirname keeps these paths correct even if Node starts from another folder.
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// The browser makes additional GET requests for CSS, JavaScript, and images.
// Express serves these files from public; our API routes below still work.
app.use(express.static(path.join(__dirname, 'public'), { index: false }));

// The About route shares the storefront’s branding and explains its purpose.
app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

// The same URL can do different things depending on the HTTP METHOD.
// req is what the client sends; res is what our server sends back.
// The status describes the outcome; the body contains the returned data.

// EXAMPLE 1 — GET reads data without changing it.
// GET /api/message has no request body.
app.get('/api/message', (req, res) => {
  if (message === null) {
    // 404 Not Found: this URL is valid, but no message exists yet.
    return res.status(404).json({ error: 'No message exists. Create one with POST.' });
  }

  // 200 OK: the read succeeded. json() sends JSON instead of page text.
  res.status(200).json(message);
});

// EXAMPLE 2 — POST creates data.
// Send POST /api/message with a JSON body: { "text": "Hello, class!" }
app.post('/api/message', (req, res) => {
  if (typeof req.body?.text !== 'string' || req.body.text.trim() === '') {
    // 400 Bad Request: the client must correct its input.
    // return ends this function so we do not create data or send a second response.
    return res.status(400).json({ error: 'Send a nonempty text string.' });
  }

  if (message !== null) {
    // 409 Conflict: our one-message storage is already occupied.
    return res.status(409).json({ error: 'A message already exists. Use PUT to replace it.' });
  }

  message = { text: req.body.text.trim() };
  // 201 Created: new data now exists. Location tells the client where to read it.
  res.location('/api/message').status(201).json(message);
});

// EXAMPLE 3 — PUT replaces data at a known URL.
// Send PUT /api/message with the complete replacement: { "text": "Updated!" }
// This example requires an existing message; POST creates it first.
app.put('/api/message', (req, res) => {
  if (message === null) {
    return res.status(404).json({ error: 'No message exists to replace.' });
  }

  if (typeof req.body?.text !== 'string' || req.body.text.trim() === '') {
    return res.status(400).json({ error: 'Send a nonempty text string.' });
  }

  message = { text: req.body.text.trim() };
  // 200 OK: replacement succeeded, and we return the updated data.
  // Sending this same PUT again leaves the message in the same state.
  res.status(200).json(message);
});

// EXAMPLE 4 — DELETE removes data.
// DELETE /api/message does not need a request body.
app.delete('/api/message', (req, res) => {
  if (message === null) {
    return res.status(404).json({ error: 'No message exists to delete.' });
  }

  message = null;
  // 204 No Content: deletion succeeded and there is NO response body.
  // Use end(), rather than sending a success message with a 204 status.
  res.status(204).end();
});

// Invalid JSON cannot reach a route because express.json() cannot read it.
// Express recognizes error middleware by its FOUR parameters, including next.
app.use((error, req, res, next) => {
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'The request body must be valid JSON.' });
  }
  next(error);
});

// Express checks routes in order. If none matched, this runs.
// 404 is an HTTP status code meaning the page was not found.
// Successful responses use status code 200 by default.
app.use((req, res) => {
  res.status(404);
  res.send('Page not found.');
});

// Start listening only when we run this file directly with Node.
// When the tests import this file, they start their own test server.
if (require.main === module) {
  // A port identifies which program should receive a connection.
  // localhost means this computer. Keep this program running
  // while visiting http://localhost:3000 in your browser.
  // The development proxy chooses another port; npm start defaults to 3000.
  const port = Number(process.env.PORT || 3000);
  app.listen(port, process.env.HOST, (error) => {
    // If the port is already in use, show the error instead of a success message.
    if (error) {
      console.error(error.message);
      process.exitCode = 1;
      return;
    }
    console.log(`Server running at http://localhost:${port}`);
    console.log('Press Ctrl+C in this terminal to stop the server.');
  });
}

// Exporting lets the test file use the same app.
module.exports = app;
