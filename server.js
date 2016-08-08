'use strict';

const Hapi = require('hapi');
const inert = require('inert');
const server = new Hapi.Server();
const port = 3000

server.connection({ port: port });
server.register(inert, (err) => {
  if (err) {
    console.error(err);
  }

  server.route({
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
      reply.file('./index.html');
    }
  });
});


server.start((err) => {
  if (err) {
    console.error(err);
  }
  console.log("Server Running On: " + port);
});
