# IS117: Your First Node.js Web Server

A six-part textbook for students who have never built a program or used a web server. You will begin with one line of JavaScript, create a Node project, serve two pages with Express, and check the responses with Jest.

The application stays small: **one `index.js`, one test file, Express, and Jest**. The explanations live in the lessons so the code remains easy to read.

## Local development with live reload

Run `npm run dev` from this folder or from `is117-web-server`. Open
`http://localhost:3000` once, then save your changes:

- HTML and browser JavaScript changes automatically refresh the page.
- CSS and image changes update through BrowserSync without restarting Express.
- Server JavaScript changes restart Express, then refresh the browser when it is ready.

Press **Ctrl+C** to stop both the development proxy and Express. Do not run
`npm start` and `npm run dev` at the same time: both use browser port 3000.
`npm start` remains available for a regular server without file watching.

BrowserSync serves the browser on port 3000 and proxies Express on port 3001.
Use `PORT` and `APP_PORT` to choose different ports if needed. Server restarts
clear the example API's in-memory message; front-end edits do not restart it.
Development dependencies are recorded in each project's package and lockfile;
run `npm ci` in the project folder after downloading a fresh copy.

## Start here

Read [setup](docs/setup.md), then [Part 1](docs/lessons/01-node-and-terminal.md). You do not need an existing project or any programming knowledge. The lessons explain which commands belong in the terminal and which code belongs in a file.

Build your own project in a folder named `is117-web-server`. The worked branches show what your program should look like **at the end** of each part. They are reference answers, rather than unfinished starters. You can read them on GitHub without cloning anything.

If you want to run the reference code locally, use a separate folder named `is117-reference`. [Setup](docs/setup.md) and [branch navigation](docs/branches.md) explain the difference between the two folders.

Follow the six lessons in your own project. When finished, use the [submission checklist](docs/assignment.md).

## The six parts

| Part and lesson | What you will learn | Worked branch | Checkpoint |
| --- | --- | --- | --- |
| [1. Node and the terminal](docs/lessons/01-node-and-terminal.md) | Install tools, create a file, and run JavaScript | [learn/01-node-and-terminal](https://github.com/kaw393939/is117-basic-web-server/tree/learn/01-node-and-terminal) | A message prints in the terminal |
| [2. An npm project](docs/lessons/02-npm-project.md) | Create `package.json` and an `npm start` command | [learn/02-npm-project](https://github.com/kaw393939/is117-basic-web-server/tree/learn/02-npm-project) | `npm start` runs the same program |
| [3. Your first web server](docs/lessons/03-first-server.md) | Install Express and answer a browser request | [learn/03-first-server](https://github.com/kaw393939/is117-basic-web-server/tree/learn/03-first-server) | The home page appears at `localhost:3000` |
| [4. Routes and status codes](docs/lessons/04-routes-and-status.md) | Add `/about` and a helpful missing-page response | [learn/04-routes-and-status](https://github.com/kaw393939/is117-basic-web-server/tree/learn/04-routes-and-status) | Two pages return `200`; a missing page returns `404` |
| [5. Your first automated test](docs/lessons/05-first-test.md) | Install Jest as a development dependency and test the home page | [learn/05-first-test](https://github.com/kaw393939/is117-basic-web-server/tree/learn/05-first-test) | One HTTP test passes |
| [6. Complete the tests](docs/lessons/06-complete-tests.md) | Test the other responses and use a failure to find a bug | [learn/06-complete-tests](https://github.com/kaw393939/is117-basic-web-server/tree/learn/06-complete-tests) | Three HTTP tests pass |

Each part builds on the previous one. Read a small explanation, predict what will happen, try the code, and explain the result before moving on. Each lesson includes a guided task and a small change to try independently.

`main` contains the full textbook and finished application. Each `learn/...` branch contains only the application features introduced so far, its own README, and the lessons up through that part. Express first appears in Part 3; Jest and the test file first appear in Part 5.

## Run a worked checkpoint

First install Node.js as described in [Part 1](docs/lessons/01-node-and-terminal.md), and Git as described in [setup](docs/setup.md). Then run:

```bash
git clone https://github.com/kaw393939/is117-basic-web-server.git is117-reference
cd is117-reference
git switch learn/01-node-and-terminal
node index.js
```

Part 1 prints:

```text
Hello, IS117! Node.js is running.
```

Follow that branch's README before switching to the next part. Check `git status` and save any edits first. Run `npm ci` after switching to Parts 2–6 to install the versions recorded in that branch's lockfile. Part 1 has no npm project yet; Parts 1–4 have no Jest tests yet.

## Run the finished example

In a clean reference clone, switch to the final checkpoint:

```bash
git switch learn/06-complete-tests
npm ci
npm test
npm start
```

You should see **3 passing tests**, followed by `Server running at http://localhost:3000`. Keep the terminal running and visit:

| Address | Expected response |
| --- | --- |
| `http://localhost:3000/` | `Hello, IS117! Your web server is working.` |
| `http://localhost:3000/about` | `A web server receives a request and sends a response.` |
| `http://localhost:3000/missing-page` | `Page not found.` with status `404` |

Press **Ctrl+C** in the server terminal to stop it. The tests start and stop their own server; they do not require a separately running `npm start` process.

## Keep these guides nearby

- [Setup](docs/setup.md): tools and separate working/reference folders.
- [Branch navigation](docs/branches.md): run the correct checkpoint and compare two parts.
- [Glossary](docs/glossary.md): plain-language definitions.
- [Troubleshooting](docs/troubleshooting.md): common mistakes and what to check.
- [Instructor guide](docs/instructor-guide.md): pacing and questions for each part.

## For the instructor

The [student walkthrough notes](note.md) record the observed results and the reasons for the instructional changes.

The organization follows the [six-part IS218 example](https://github.com/kaw393939/is218-command-factory-statistics), with the prerequisite level reset to a student's first program. There are no additional application frameworks or testing packages.

From `main`, export the six worked snapshots without changing Git:

```bash
node tools/build-lessons.js --output ../is117-lessons
```

Use a new output folder. To verify the documents, actual lesson branch contents, sequential ancestry, programs, and tests:

```bash
node tools/verify-course.js
```

That check uses the installed dependencies in the main checkout. Add `--install` to verify fresh `npm ci` installs in temporary folders as well. [The instructor guide](docs/instructor-guide.md) explains the teaching checkpoints; [branch navigation](docs/branches.md) describes maintenance.
