'use strict';

const base64 = require('base-64');
const { users } = require('../models/index.js');

async function basicAuth(req, res, next) {
  try {
    const authorization = req.headers.authorization;

    // verify Authorization header was provided
    if (!authorization) {
      throw new Error('Invalid Login');
    }

    // separate authentication scheme from the encoded credentials
    const [scheme, encodedCredentials] = authorization.split(' ');

    if (scheme !== 'Basic' || !encodedCredentials) {
      throw new Error('Invalid Login');
    }

    // decode credentials; locate the username/password separator
    const decodedCredentials = base64.decode(encodedCredentials);
    const separatorIndex = decodedCredentials.indexOf(':');

    if (separatorIndex === -1) {
      throw new Error('Invalid Login');
    }

    const username = decodedCredentials.slice(0, separatorIndex);
    const password = decodedCredentials.slice(separatorIndex + 1);

    // authenticate the credentials and attach the valid user to the request
    req.user = await users.authenticateBasic(username, password);

    next();
  } catch (error) {
    next(new Error('Invalid Login'));
  }
}

module.exports = basicAuth;
