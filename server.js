'use strict';

const fs = require('fs');
const path = require('path');
const Hapi = require('hapi');
const inert = require('inert');
const Good = require('good');
const server = new Hapi.Server();
const port = 3000;
const NOTES_DB = path.join(__dirname, 'noteDB.json')

server.connection({ port: port });

server.route({
  method: 'POST',
  path: '/api/notes',
  config: {
    handler: (request, reply) => {
      var requestData = request.payload;
      fs.readFile(NOTES_DB, (err, data) => {
        var notes = JSON.parse(data);
        notes.push({
          user: requestData.user,
          id: Date.now()
            .toString(),
          text: requestData.note
        });
        fs.writeFile(NOTES_DB, JSON.stringify(notes), (err) => {
          if (err) {
            console.error(err);
          }

          if (requestData.displayImage_) {
            displayImage_ = requestData.displayImage_;
            console.log('picture was included');
            var name = displayImage_.hapi.filename;
            var path = __dirname + "/uploadedPhotos/" + name;
            var file = fs.createWriteStream(path);

            file.on('error', function(err) {
              console.error(err)
            });

            displayImage_.pipe(file);
          }
          console.log('here fo real>>>');

          reply('/');
        });
      });
    }
  }

});


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
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
      reply.file('./index.html');
    }
  });

});



server.register({
  register: Good,
  options: {
    reporters: {
      console: [{
        module: 'good-squeeze',
        name: 'Squeeze',
        args: [{
          response: '*',
          log: '*'
        }]
      }, {
        module: 'good-console'
      }, 'stdout']
    }
  }
}, (err) => {

  if (err) {
    throw err; // something bad happened loading the plugin
  }

  server.start((err) => {

    if (err) {
      throw err;
    }
    server.log('info', 'Server running at: ' + server.info.uri);
  });
});
