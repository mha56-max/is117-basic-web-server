const app = require('../index');

let server;
let baseUrl;

beforeAll(async () => {
  // Port 0 lets the computer choose a free port for these tests.
  await new Promise((resolve, reject) => {
    server = app.listen(0, '127.0.0.1');
    server.once('listening', resolve);
    server.once('error', reject);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

afterAll(async () => {
  // Close the server and its connections when the tests finish.
  if (server && server.listening) {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
      server.closeAllConnections();
    });
  }
});

test('the root entry point serves the ROAM homepage', async () => {
  // fetch sends a request, like visiting a page in a browser.
  const response = await fetch(`${baseUrl}/`);

  // Check both the status number and the text sent back by the server.
  expect(response.status).toBe(200);
  expect(response.headers.get('content-type')).toContain('text/html');
  const html = await response.text();
  expect(html).toContain('SHOW UP.');
  expect(html).toMatch(/<nav aria-label="Main navigation">[\s\S]*href="\/about"[\s\S]*<\/nav>/);
  expect(html).toContain('/assets/roam-rise.png');
});

test('the about page serves the ROAM brand story as HTML', async () => {
  const response = await fetch(`${baseUrl}/about`);

  expect(response.status).toBe(200);
  expect(response.headers.get('content-type')).toContain('text/html');
  const html = await response.text();
  expect(html).toContain('id="about-title"');
  expect(html).toContain('EVERYDAY COURAGE.');
  expect(html).toContain('href="/#the-tee"');
});

test('a missing page sends a 404 response', async () => {
  const response = await fetch(`${baseUrl}/missing-page`);

  expect(response.status).toBe(404);
  expect(await response.text()).toBe('Page not found.');
});
