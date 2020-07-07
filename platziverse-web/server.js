'use strict';

const debug = require('debug')('platziverse:web');
const path = require('path');// hacer operaciones con el sistema de archivos
const http = require('http');
const express = require('express');
const chalk = require('chalk');
const socketio = require('socket.io');
const PlatziverseAgent = require('platziverse-agent');

const app = express();
const proxy = require('./proxy');
const server = http.createServer(app);
const { Api } = require('../platziverse-utils/config');
const ErrorHandler = require('../platziverse-utils/middlewares/error');
const { portWeb } = Api;
const io = socketio(server);
const agent = new PlatziverseAgent();

app.use(ErrorHandler);
app.use(express.static(path.join(__dirname, 'public')));// es un middleware más que hace esto: ./public o ./ public
app.use('/', proxy);

//Socket Io websockets
io.on('connect', (socket) => {
  debug(`Connected ${socket.id}`);

  agent.on('agent/message', (payload) => {
    socket.emit('agent/message', payload);
  });

  agent.on('agent/connected', (payload) => {
    socket.emit('agent/connected', payload);
  });

  agent.on('agent/disconnected', (payload) => {
    socket.emit('agent/disconnected', payload);
  });
});

server.listen(portWeb, () => {
  console.log(chalk.cyan(`[platziverse-web]: `), `Listening on port: ${portWeb}`);
  agent.connect();
});

function handleFatalError (err) {
  console.group(chalk.red('Fatal Error'));
    console.log(chalk.bgRed('[error-message]: '), err.message);
    console.log(chalk.bgRed('[error-stack]: '), err.stack);
  console.group(chalk.red('FatalError'));
};

process.on('uncaughtException', handleFatalError);
process.on('unhandledRejection', handleFatalError);
