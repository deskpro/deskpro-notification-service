import SocketIO from 'socket.io';
import socketioJwt from 'socketio-jwt';

export default class SocketsManager
{
  constructor(config) {
    this.debug = config.debug;
    this.secret = config.jwtSecret;
  }

  runSocketServer(httpServer) {
    const debug = this.debug;
    const jwtSecret = this.secret;
    this.ioServer = new SocketIO(httpServer)
      .on('connection', socketioJwt.authorize({ secret: jwtSecret, timeout: 15000 }))
      .on('connection', (socket) => {
        if(debug) {
          console.log(`Socket with id ${socket.id} connected`);
        }
        socket.on('disconnect', function () {
          if(debug) {
            console.log(`Socket with id ${socket.id} disconnected`);
          }
        });
      })
      .on('authenticated', (socket) => {
        if(debug) {
          console.log(`Socket with id ${socket.id} successfully authenticated`);
        }
        this.addSocket(socket.decoded_token.id, socket);
        if(socket.decoded_token.id)
        this.addSocket('agent_public', socket); // automatically subscribe to agent broadcast channel
      });
  }

  sendMessage(message) {
    if(this.debug) {
      console.log(`
=======================
New message via channel: ${message.channel}
Message name: ${message.name}
Data: ${JSON.stringify(message.data, null, 2)}
=======================\r\n
          `);
    }

    this.ioServer.in(message.channel).emit(`${message.channel}-${message.name}`, message.data);
  }
  
  addSocket(userId, socket) {
    let channel;
    if(parseInt(userId, 10)) {
      channel = `private-${parseInt(userId, 10)}`
    } else {
      channel = `private-${userId}`;
    }
    socket.join(channel);

    if(this.debug) {
      console.log(`Socket with id ${socket.id} added on channel ${channel}`);
    }
  };
}