'use strict';

import HttpServer from './HttpServer';
import SocketsManager from './SocketsManager';
import fs from 'fs';

const config = require('../config.json');

if(!config.port && !parseInt(config.port, 10)) {
  throw new Error(`You should provide port number as integer, given value is: ${config.port}`);
}
if(!config.jwtSecret) {
  throw new Error('Please specify the secret key which would be used to encrypt auth and messages');
}


if(config.secure) {
  if(!config.keyFile || !config.certFile) {
    throw new Error('If you want to use secure connection you have to config paths to certificate and key files');
  }
  config.key  = fs.readFileSync(config.keyFile);
  config.cert = fs.readFileSync(config.certFile);
}

const socketsManager = new SocketsManager(config);

const httpServer = new HttpServer(config, socketsManager);

socketsManager.runSocketServer(httpServer.getServer());

httpServer.run();

