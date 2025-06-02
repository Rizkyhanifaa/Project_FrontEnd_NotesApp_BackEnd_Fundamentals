const Hapi = require('@hapi/hapi');
const routes = require('./routes');

const createServer = async () => {
  const server = Hapi.server({
    port: 5000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  server.route(routes);
  return server;
};

module.exports = createServer;
