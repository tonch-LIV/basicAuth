'use strict';

const base64 = require('base-64');

const basicAuth = require('./basic.js');
const { db, users } = require('../models/index.js');

beforeEach(async () => {
  await db.sync({ force: true });
});

afterAll(async () => {
  await db.close();
});

describe('Basic Authen middleware', () => {
  test('attaches an authenticated user to req.user', async () => {
    await users.create({
      username: 'middleware-user',
      password: 'secret',
    });

    const req = {
      headers: {
        authorization: `Basic ${base64.encode('middleware-user:secret')}`,
      },
    };

    const next = jest.fn();

    await basicAuth(req, {}, next);

    expect(req.user.username).toBe('middleware-user');
    expect(next).toHaveBeenCalledWith();
  });

  test('passes Invalid Login to next for invalid credentials', async () => {
    await users.create({
      username: 'middleware-user',
      password: 'secret',
    });

    const req = {
      headers: {
        authorization: `Basic ${base64.encode(
          'middleware-user:wrong-password',
        )}`,
      },
    };

    const next = jest.fn();

    await basicAuth(req, {}, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect(next.mock.calls[0][0].message).toBe('Invalid Login');
  });
});