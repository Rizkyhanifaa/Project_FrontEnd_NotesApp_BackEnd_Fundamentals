const createServer = require('../src/server');
const supertest = require('supertest');

describe('Server routes test', () => {
  let server;

  beforeAll(async () => {
    server = await createServer();
  });

  test('GET / should return 200 and welcome message', async () => {
    const res = await supertest(server.listener).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'success');
  });

  test('POST /notes should return 201 when note is created', async () => {
    const payload = {
      title: 'Test Note',
      tags: ['test'],
      body: 'This is a test note.',
    };

    const res = await supertest(server.listener)
      .post('/notes')
      .send(payload);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('status', 'success');
    expect(res.body.data).toHaveProperty('noteId');
  });
});
