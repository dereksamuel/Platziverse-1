'use strict';

const http = require('http');// se utiliza para realizar las pruebas e inclusive, con express
const app = require('express')();
const chalk = require('chalk');
const debug = require('debug');

const routes = require('./routes/api');
const ErrorHandler = require('../platziverse-utils/middlewares/error');
const { Api } = require('../platziverse-utils/config');
const server = http.createServer(app);
const { port, res_error } = Api;

app.use('/api', routes);
// Express error handler
// 1. err, 2. req, 3. res 4. next = siempre presente en middlewares
app.use(ErrorHandler);

function handleFatalError (err) {
  res_error(err, null, null, 'Error fatal', chalk, null, 'FATAL ERROR');
  console.group(chalk.red('Fatal Error'));
    console.log(chalk.bgRed('[error-message]: '), err.message);
    console.log(chalk.bgRed('[error-stack]: '), err.stack);
  console.group(chalk.red('FatalError'));
};

if (!module.parent) {
  server.listen(port, () => {
    console.log(chalk.cyan(`Listening on port: ${port}`));
  });
  
  process.on('uncaughtException', handleFatalError);
  process.on('unhandledRejection', handleFatalError);
}

module.exports = server;
