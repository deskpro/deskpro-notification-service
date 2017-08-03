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
      // error
    }
    res.end();
  }
}
