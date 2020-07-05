'use strict';

const http = require('http');
const app = require('express')();
const chalk = require('chalk');

const { Api } = require('../platziverse-utils/config');
const server = http.createServer(app);
const { port } = Api;

server.listen(port, () => {
  console.log(chalk.cyan(`Listening on port: ${port}`));
});
