const createServer = require('./server');

const init = async () => {
  const server = await createServer();
  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
