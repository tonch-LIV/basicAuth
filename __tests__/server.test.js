'use strict';

const supertest = require('supertest');

const { app } = require('../src/server.js');
const { db, users } = require('../src/auth/models/index.js');

const request = supertest(app);

// recreates sqlite tables from in-memory before each test; preventing duplicates / unexpected records
beforeEach(async () => {
  await db.sync({ force: true });
});

afterAll(async () => {
  await db.close();
});

describe('Authentication server', () => {
  // unknown routes reach; 404
  test('returns 404 for an unknown route', async () => {
    const response = await request.get('./missing');

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Not Found');
  });

  // JSON accepted by /signup; 201
  test('creates a user from JSON data and stores hashed password', async () => {
    const response = await request
      .post('/signup')
      .send({
        username: 'json-user',
        password: 'secret',
      });

    const storedUser = await users.findOne({
      where: { username: 'json-user' },
    });

    expect(response.status).toBe(201);
    expect(response.body.username).toBe('json-user');
    expect(storedUser.body.password).not.toBe('secret');
  });

  // form data accepted by /signup; 201
  test('creates a user from form data', async () => {
    const response = await request
      .post('/signup')
      .type('form')
      .send({
        username: 'form-user',
        password: 'secret',
      });

    expect(response.status).toBe(201);
    expect(response.body.username).toBe('form-user');
  });

  // Basic Authen accepted by /signup; 201
  test('signs in a user with valid Basic Authen', async () => {
    await request
      .post('/signup')
      .send({
        username: 'signin-user',
        password: 'secret',
      });
      
    const response = await request
      .post('/signin')
      .auth('signin-user', 'secret');

    expect(response.status).toBe(200);
    expect(response.body.user.username).toBe('signin-user');
  });

  // invalid credentials reach; 500
  test('rejects an invalid login', async () => {
    await request
      .post('/signup')
      .send({
        username: 'invalid-user',
        password: 'secret',
      });
      
    const response = await request
      .post('/signin')
      .auth('invalid-user', 'wrong-password');

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Invalid Login');
  });
});
