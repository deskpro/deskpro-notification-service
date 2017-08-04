import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';

export default class HttpServer
{
  constructor(port, secret, socketsManager) {
    this.port = port;
    this.secret = secret;
    this.socketsManager = socketsManager;

    const app = express();
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    this.server = http.Server(app);
    app.post('/send', this.handlePost.bind(this));
    app.post('/test', this.handleTest.bind(this));
  }

  getServer() {
    return this.server;
  }

  run() {
    this.server.listen(this.port);
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
