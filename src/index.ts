import { config } from "~config";
import express from 'express';
import { createServer } from 'http';
import socket from 'socket.io';
import ioRoutes from './io/routes';
import './repositories/player.repository';

const app = express();
const http = createServer(app);
const io = socket(http);

ioRoutes(io);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
});

http.listen(config.port, function(){
  console.log(`listening on *:${config.port}`);
});
