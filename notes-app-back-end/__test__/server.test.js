const createServer = require('../src/server');
const supertest = require('supertest');

describe('GET /', () => {
  let server;

  beforeAll(async () => {
    server = await createServer();
    await server.initialize(); // hanya inisialisasi, jangan .start()
  });

  afterAll(async () => {
    await server.stop();
  });

  it('should return 200 and welcome message', async () => {
    const res = await supertest(server.listener).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toMatch(/Selamat datang|Welcome/i); // sesuaikan dengan response-mu
  });
});
