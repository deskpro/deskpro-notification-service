import Immutable from 'immutable';

export default class SocketsManager
{
  constructor() {
    this.sockets = Immutable.Map({});
    this.socketsMap = Immutable.Map({});
  }
  
  sendMessage(message) {
    if (this.sockets.has(message.channel) && this.sockets.get(message.channel).length > 0) {
      this.sockets.get(message.channel).map((socket) => {
        socket.emit(message.name, message.data);
      });
    }
  }
  
  addSocket(userId, socket) {
    if(userId) {
      const newSockets = this.sockets.has(userId) ? this.sockets.get(userId) : [];
      newSockets.push(socket);
      this.sockets = this.sockets.set(userId, newSockets);
      this.socketsMap = this.socketsMap.set(socket.id, userId);
    }
  };

  deleteSocket(socket) {
    if(this.socketsMap.has(socket.id)) {
      const removeFrom = this.socketsMap.get(socket.id);
      const newSockets = this.sockets.get(removeFrom).filter((item) => item.id !== socket.id);
      this.sockets = this.sockets.set(removeFrom, newSockets);
      this.socketsMap = this.socketsMap.delete(socket.id);
    }
  }
}