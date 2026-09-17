'use strict';

const express = require('express');

const authRouter = require('./auth/router.js');
const handleNotFound = require('./middleware/404.js');
const handleServerError = require('./middleware/500.js');

const cors = require('cors');

// creates express app
const app = express();

// enables cors
app.use(cors());
// parses JSON request bodies
app.use(express.json());
// parses HTML form submissions
app.use(express.urlencoded({
  extended: true,
}));

app.use(authRouter);

app.use(handleNotFound); // catches requests that dont match routes
app.use(handleServerError);

function start(port) {
  return app.listen(port, () => {
    console.log(`Server listening on ${port}`);
  });
}

// separate exports for future testing patterns
module.exports = { app, start };