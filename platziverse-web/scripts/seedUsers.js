'use strict';

const bcrypt = require('bcrypt');
const debug = require('debug')('platziverse:script:users');
const chalk = require('chalk');

const MongoLib = require('../../platziverse-db/lib/mongo/index');
const { Api } = require('../../platziverse-utils/config');

const users = [
  {
    email: 'dereksamuelgr@gmail.com',
    name: 'ROOT',
    password: Api.auth.default_admin_password,
    isAdmin: true
  },
  {
    email: 'ds.paulpena14@gmail.com',
    name: 'Derek',
    password: Api.auth.default_user_password
  },
  {
    email: 'example@gmail.com',
    name: 'test',
    password: Api.auth.default_user_password
  }
];

async function createUser(mongoDB, user) {
  const { name, email, password, isAdmin } = user;
  const hashedPassword = await bcrypt.hash(password, 10);

  const userId = await mongoDB.create('users', {
    name, email, password: hashedPassword, isAdmin: Boolean(isAdmin)
  });

  return userId;
}

async function seedUsers() {
  try {
    const mongoDB = new MongoLib();

    const promise = users.map(async (user) => {
      const userId = await createUser(mongoDB, user);
      console.log(chalk.green(`User created with id: ${userId}`));
    });

    await Promise.all(promise);
    return process.exit(0);
  } catch (err) {
    console.log(chalk.bgRed(err));
    process.exit(1);
  }
}

seedUsers();