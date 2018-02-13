import Immutable from 'immutable';

export default class SocketsManager
{
  constructor(config) {
    this.debug = config.debug;
    this.sockets = Immutable.Map({});
    this.socketsMap = Immutable.Map({});
  }
  
  sendMessage(message) {
    if (this.sockets.has(message.channel) && this.sockets.get(message.channel).length > 0) {
      if(this.debug) {
        console.log(`
=======================
New message via channel: ${message.channel}
Message name: ${message.name}
Data: ${JSON.stringify(message.data, null, 2)}
=======================\r\n
          `);
      }

      this.sockets.get(message.channel).map((socket) => {
        socket.emit(`${message.channel}-${message.name}`, message.data);
      });
    }
  }
  
  addSocket(userId, socket) {
    let channel;
    if(parseInt(userId, 10)) {
      channel = `private-${userId}`
    } else {
      channel = userId;
    }

    const newSockets = this.sockets.has(channel) ? this.sockets.get(channel) : [];
    newSockets.push(socket);
    this.sockets = this.sockets.set(channel, newSockets);
    const newUsers = this.socketsMap.has(socket.id) ? this.socketsMap.get(socket.id) : [];
    newUsers.push(channel);
    this.socketsMap = this.socketsMap.set(socket.id, newUsers);

    if(this.debug) {
      console.log(`Socket with id ${socket.id} added for on channel ${channel}`);
    }
  };

  deleteSocket(socket) {
    if(this.socketsMap.has(socket.id)) {
      const removeFromArray = this.socketsMap.get(socket.id);
      let newSockets;
      removeFromArray.map(removeFrom => {
        newSockets = this.sockets.get(removeFrom).filter((item) => item.id !== socket.id);
        if(this.debug) {
          console.log(`Socket with id ${socket.id} removed from channel ${removeFrom}`);
        }
        this.sockets = this.sockets.set(removeFrom, newSockets);
      });

      this.socketsMap = this.socketsMap.delete(socket.id);
    }
  }
}