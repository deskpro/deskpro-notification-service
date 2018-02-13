import express from 'express';
import http from 'http';
import https from 'https';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';

export default class HttpServer
{
  constructor(config, socketsManager) {
    this.port   = config.port;
    this.secret = config.jwtSecret;
    this.host = config.host ? config.host : 'localhost';
    this.socketsManager = socketsManager;

    const app = express();
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    if (config.secure) {
      const options = {
        key: config.key,
        cert: config.cert
      };
      this.server = https.createServer(options, app);
    } else {
      this.server = http.Server(app);
    }

    app.post('/send', this.handlePost.bind(this));
    app.post('/test', this.handleTest.bind(this));
  }

  getServer() {
    return this.server;
  }

  run() {
    this.server.listen({port: this.port, host: this.host});
  }

  handlePost(req, res) {
    try {
      const decoded = jwt.verify(req.body.jwt, this.secret);
      decoded.map((item) => {
        this.socketsManager.sendMessage(item);
      });
    } catch(e) {
      res.statusCode = 400;
      res.write(JSON.stringify({error: 'token is invalid'}), 'utf-8')
    }
    res.end();
  }

  handleTest(req, res) {
    try {
      const decoded = jwt.verify(req.body.jwt, this.secret);
      if(decoded.test && decoded.test === true) {
        res.write(JSON.stringify({success: true}), 'utf-8')
      }
    } catch(e) {
      res.statusCode = 400;
      res.write(JSON.stringify({error: 'token is invalid'}), 'utf-8')
    }
    res.end();
  }
}
