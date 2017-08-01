'use strict';

import express from 'express';
import http from 'http';
import SocketIO from 'socket.io';
import bodyParser from 'body-parser';
import Immutable from 'immutable';

const app = express();
const server = http.Server(app);
const io = new SocketIO(server);
let sockets = Immutable.Map({});
let socketsMap = Immutable.Map({});


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/send', function(req, res){
  req.body.map((item) => {
    if (sockets.has(item.channel) && sockets.get(item.channel).length > 0) {
      sockets.get(item.channel).map((socket) => {
        socket.emit(item.name, item.data);
      });
    }
  });
  res.end();
});

server.listen(3000);

const authCallback = (socket, next) => (socketId) => {
  if(socketId) {
    const newSockets = sockets.has(socketId) ? sockets.get(socketId) : [];
    newSockets.push(socket);
    sockets = sockets.set(socketId, newSockets);
    socketsMap = socketsMap.set(socket.id, socketId);
    return next();
  } else {
    return next(new Error('Auth failed'));
  }

};

const doAuth = (cookies, authCallback) => {
  let result = null;

  const options = {
    host: 'localhost',
    port: 80,
    path: '/api/v2/me',
    method: 'GET',
    headers: {Cookie: cookies}
  };

  const req = http.request(options, function(res) {
    res.setEncoding('utf8');
    return res.on('data', function (chunk) {
      const parsed = JSON.parse(chunk);
      if(parsed.data && parsed.data.person && parsed.data.person.id) {
        result = parsed.data.person.id;
        return authCallback(result);
      } else {
        return authCallback(null);
      }
    });
  });

  req.end();
};

io.use((socket, next) => {
  const cookies = socket.handshake.headers.cookie;
  return doAuth(cookies, authCallback(socket, next));
});

io.on('connection', function (socket) {
  socket.emit('connected', { status: 200 });

  socket.on('disconnect', function () {
    if(socketsMap.has(socket.id)) {
      const removeFrom = socketsMap.get(socket.id);
      const newSockets = sockets.get(removeFrom).filter((item) => item.id !== socket.id);
      sockets = sockets.set(removeFrom, newSockets);
      socketsMap = socketsMap.delete(socket.id);
    }
  });
});

