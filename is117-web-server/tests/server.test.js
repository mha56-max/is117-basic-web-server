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

test('the home page serves the ROAM storefront as HTML', async () => {
  // fetch sends a request, like visiting a page in a browser.
  const response = await fetch(`${baseUrl}/`);

  // The home page now promises an HTML storefront instead of a text greeting.
  expect(response.status).toBe(200);
  expect(response.headers.get('content-type')).toContain('text/html');
  const html = await response.text();
  expect(html).toContain('SHOW UP.');
  expect(html).toMatch(/<nav aria-label="Main navigation">[\s\S]*href="\/about"[\s\S]*<\/nav>/);
  expect(html).toContain('id="the-tee"');
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

describe('the four HTTP methods for a classroom message', () => {
  // Each example starts with empty storage so tests do not depend on order.
  beforeEach(async () => {
    await fetch(`${baseUrl}/api/message`, { method: 'DELETE' });
  });

  // This helper sends the same JSON headers and body format as our curl demo.
  function sendJson(method, body) {
    return fetch(`${baseUrl}/api/message`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  }

  test('POST creates, GET reads, PUT replaces, and DELETE removes the message', async () => {
    const created = await sendJson('POST', { text: 'Hello, class!' });
    expect(created.status).toBe(201);
    expect(created.headers.get('location')).toBe('/api/message');
    expect(await created.json()).toEqual({ text: 'Hello, class!' });

    const read = await fetch(`${baseUrl}/api/message`);
    expect(read.status).toBe(200);
    expect(await read.json()).toEqual({ text: 'Hello, class!' });

    const duplicate = await sendJson('POST', { text: 'Another message' });
    expect(duplicate.status).toBe(409);

    const updated = await sendJson('PUT', { text: 'Updated!' });
    expect(updated.status).toBe(200);
    expect(await updated.json()).toEqual({ text: 'Updated!' });

    const readAgain = await fetch(`${baseUrl}/api/message`);
    expect(await readAgain.json()).toEqual({ text: 'Updated!' });

    const deleted = await fetch(`${baseUrl}/api/message`, { method: 'DELETE' });
    expect(deleted.status).toBe(204);
    expect(await deleted.text()).toBe('');

    const missing = await fetch(`${baseUrl}/api/message`);
    expect(missing.status).toBe(404);
  });

  test.each(['GET', 'PUT', 'DELETE'])('%s reports 404 when the message is missing', async (method) => {
    const response = await fetch(`${baseUrl}/api/message`, { method });
    expect(response.status).toBe(404);
    expect(await response.json()).toHaveProperty('error');
  });

  test.each([{}, { text: '' }, { text: '   ' }, { text: 42 }, null])(
    'invalid input %j returns 400 without creating or replacing data',
    async (body) => {
      const rejectedPost = await sendJson('POST', body);
      expect(rejectedPost.status).toBe(400);
      const missing = await fetch(`${baseUrl}/api/message`);
      expect(missing.status).toBe(404);

      await sendJson('POST', { text: 'Keep this message.' });
      const rejectedPut = await sendJson('PUT', body);
      expect(rejectedPut.status).toBe(400);
      const unchanged = await fetch(`${baseUrl}/api/message`);
      expect(await unchanged.json()).toEqual({ text: 'Keep this message.' });
    },
  );

  test('malformed JSON returns 400 with a readable error', async () => {
    const response = await fetch(`${baseUrl}/api/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{broken json',
    });
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'The request body must be valid JSON.' });
  });
});
