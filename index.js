// Use the student app so npm start from either project folder serves
// the same ROAM homepage, assets, and classroom HTTP examples.
const app = require('./is117-web-server');

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
