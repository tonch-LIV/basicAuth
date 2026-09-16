'use strict';

require('dotenv').config();

const { db } = require('./src/auth/models/index.js');
const { start } = require('./src/server.js');

const PORT = process.env.PORT || 3000;

//  creates or syncs db tables, then after db is ready; starts listening
db.sync()
  .then(() => {
    start(PORT);
  })
  .catch((error) => {
    console.error('Could not start server:', error.message);
  });