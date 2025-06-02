const createServer = require('../src/server'); // sesuaikan jika path berbeda
const supertest = require('supertest');

describe('GET /', () => {
  it('should return 200 and welcome message', async () => {
    const server = await createServer();
    const response = await supertest(server.listener).get('/');
    
    expect(response.statusCode).toBe(200);
    expect(response.payload).toContain('Selamat datang');
  });
});
