'use strict';
const debug = require('debug')('platziverse:mqtt');
const { Server } = require('mosca');
const redis = require('redis');
const chalk = require('chalk');

const backend = {
  type: 'redis',
  redis,
  return_buffers: true
};

const settings = {
  port: 8010,
  backend
};

const server = new Server(settings);

server.on('clientConnected', (client) => debug(`CLient connected: ${client.id}`));

server.on('clientDisconnected', (client) => debug(`CLient disconnected: ${client.id}`));

server.on('published', (packet, client) => {
  debug(`Received: ${packet.topic}`);
  debug(`Payload: ${packet.payload}`);
});

server.on('ready', () => {
  console.log(`${chalk.bgGreen(chalk.blackBright('[platzi-mqtt]:'))} server is running on port ${settings.port}`);
});
