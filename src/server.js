'use strict';

const express = require('express');
const app = require('cors');

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

function start(port) {
  return app.listen(port, () => {
    console.log(`Server listening on ${port}`);
  });
}

// separate exports for future testing patterns
module.exports = { app, start };