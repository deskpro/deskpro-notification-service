'use strict';

import HttpServer from './HttpServer';
import SocketsManager from './SocketsManager';
import SocketsServer from './SocketServer';

const config = require('../config.json');

if(!config.port && !parseInt(config.port, 10)) {
  throw new Error(`You should provide port number as integer, given value is: ${config.port}`);
}
if(!config.jwtSecret) {
  throw new Error('Please specify the secret key which would be used to encrypt auth and messages');
}

const socketsManager = new SocketsManager();

const httpServer = new HttpServer(config.port, config.jwtSecret, socketsManager);

SocketsServer(httpServer.getServer(), socketsManager, config);

httpServer.run();

