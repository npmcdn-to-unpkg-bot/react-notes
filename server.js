'use strict';

const fs = require('fs');
const path = require('path');
const Hapi = require('hapi');
const inert = require('inert');
const server = new Hapi.Server();
const port = 3000;
const NOTES_DB = path.join(__dirname, 'noteDB.json')

server.connection({ port: port });
server.register(inert, (err) => {
  if (err) {
    console.error(err);
  }

  server.route({
    method: 'GET',
    path: '/api/notes',
    handler: (request, reply) => {
      fs.readFile(NOTES_DB, (err, data) => {
        if (err) {
          console.error('Oh shit!');
        }
        reply(data)
      })
    }
  });

  server.route({
	method: 'POST',
	path: '/api/notes',
	handler: (request, reply) => {
	  fs.appendFile(NOTES_DB, 'not quite but close',(err) => {
	  })
	}
  });

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
