'use strict';

const http = require('http');
const app = require('express')();
const chalk = require('chalk');

const routes = require('./routes/api');
const { Api } = require('../platziverse-utils/config');
const server = http.createServer(app);
const { port } = Api;

app.use('/api', routes);

server.listen(port, () => {
  console.log(chalk.cyan(`Listening on port: ${port}`));
});
