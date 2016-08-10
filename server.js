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
		fs.readFile(NOTES_DB, (err, data) => {
			var notes = JSON.parse(data);
			notes.push({user: request.payload.user, id: Date.now().toString(), text:request.payload.note});
			fs.writeFile(NOTES_DB, JSON.stringify(notes), (err) => {
				if(err){
					console.error(err);
				}
				reply('/');
			});

		});
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
