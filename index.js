'use strict';

import SocketIO from 'socket.io';
import HttpServer from './HttpServer';
import SocketsManager from './SocketsManager';
import SocketsServer from './SocketServer';

const config = require('../config.json');

const socketsManager = new SocketsManager();
const httpServer = new HttpServer(config.port, config.jwtSecret, socketsManager);

SocketsServer(httpServer.getServer(), socketsManager, config);

httpServer.run();

