'use strict';

const express = require('express');
const basicAuth = require('./middleware/basic.js');
const { users } = require('./models/index.js');

const router = express.Router();

router.post('/signup', async (req, res, next) => {
  try {
    const user = await users.create(req.body);

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

router.post('/signin', basicAuth, (req, res) => {
  res.status(200).json({
    user: req.user,
  });
});

module.exports = router;