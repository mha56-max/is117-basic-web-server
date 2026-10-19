#!/bin/sh
# In one terminal: npm start
# In another terminal, from this folder: sh demo.sh
# Start with a fresh server. This demo creates, changes, then deletes its message.
# curl sends HTTP requests. -i displays the response status and headers too.
# -X selects the method; -H adds a header; -d sends the request body.
# A browser address bar makes GET requests; use curl for these other methods.
set -eu

# Optionally choose another running server: BASE_URL=http://localhost:3100 sh demo.sh
BASE_URL=${BASE_URL:-http://localhost:3000}

printf '\nGET before creation: expect 404 Not Found.\n'
curl -sS -i "$BASE_URL/api/message"

printf '\n\nPOST invalid data: expect 400 Bad Request.\n'
curl -sS -i -X POST "$BASE_URL/api/message" \
  -H 'Content-Type: application/json' -d '{"text":""}'

printf '\n\nPOST creates a message: expect 201 Created and a Location header.\n'
curl -sS -i -X POST "$BASE_URL/api/message" \
  -H 'Content-Type: application/json' -d '{"text":"Hello, class!"}'

printf '\n\nGET reads the message: expect 200 OK and the original text.\n'
curl -sS -i "$BASE_URL/api/message"

printf '\n\nPOST again: expect 409 Conflict because a message already exists.\n'
curl -sS -i -X POST "$BASE_URL/api/message" \
  -H 'Content-Type: application/json' -d '{"text":"Another message"}'

printf '\n\nPUT replaces the message: expect 200 OK and the new text.\n'
curl -sS -i -X PUT "$BASE_URL/api/message" \
  -H 'Content-Type: application/json' -d '{"text":"We just updated our message!"}'

printf '\n\nGET confirms the replacement: expect 200 OK and the updated text.\n'
curl -sS -i "$BASE_URL/api/message"

printf '\n\nDELETE removes the message: expect 204 No Content with an empty body.\n'
curl -sS -i -X DELETE "$BASE_URL/api/message"

printf '\nGET after deletion: expect 404 Not Found again.\n'
curl -sS -i "$BASE_URL/api/message"
printf '\n'
