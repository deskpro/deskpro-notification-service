import SocketIO from 'socket.io';
import socketioJwt from 'socketio-jwt';

const SocketsServer =  (server, socketsManager, config) => {
  new SocketIO(server)
    .on('connection', socketioJwt.authorize({ secret: config.jwtSecret, timeout: 15000 }))
    .on('connection', (socket) => {
      if(config.debug) {
        console.log(`Socket with id: ${socket.id} connected`);
      }
      socket.on('disconnect', function () {
        if(config.debug) {
          console.log(`Socket with id: ${socket.id} disconnected`);
        }
        socketsManager.deleteSocket(socket);
      });
    })
    .on('authenticated', (socket) => {
      if(config.debug) {
        console.log(`Socket with id: ${socket.id} successfully authenticated`);
      }
      socketsManager.addSocket(socket.decoded_token.id, socket);
    });
};

export default SocketsServer;
