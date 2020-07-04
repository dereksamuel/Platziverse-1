'use strict';

exports.config = {
  database: process.env.DB_NAME || 'platziverse',
  username: process.env.DB_USER || 'derek',
  password: process.env.DB_PASS || 'platzi',
  host: process.env.DB_HOST || 'localhost',
  dialect: 'postgres',
  //logging: () => {}
};
