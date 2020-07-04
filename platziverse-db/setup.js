'use strict';

const db = require('./');
const inquirer = require('inquirer');
const chalk = require('chalk');
const debug = require('debug')('platziverse:db');

const prompt = inquirer.createPromptModule();
const { config } = require('../response/config');

async function setup () {
  config.logging = (t) => debug(t);

  if (process.argv[2] !== 'yes') {
    const answer = await prompt([
      {
        type: 'confirm',
        name: 'setup',
        message: 'This will destroy your database, are you sure?'
      }
    ]);
    config.logging = (t) => debug(t);
    if(!answer.setup) return console.log('Nothing happened :)');
  }

  await db(config).catch(handleFATALerror)
  console.log('[success]');
  process.exit(0);
};

function handleFATALerror (err) {
  console.error(chalk.bgRedBright('[fatal-error]:'));
  console.error(chalk.yellow(err.message));
  console.error(err.stack);
  process.exit(1);
};

setup();