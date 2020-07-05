'use strict';

exports.config = {
  database: process.env.DB_NAME || 'platziverse',
  username: process.env.DB_USER || 'derek',
  password: process.env.DB_PASS || 'platzi',
  host: process.env.DB_HOST || 'localhost',
  dialect: 'postgres',
  logging: () => {}
};

exports.transform = function parsePayload (payload) {
  if (payload instanceof Buffer) {
    payload = payload.toString('utf8');
  }

  try {
    payload = JSON.parse(payload);
  } catch (err) {
    console.error(err);
    payload = null;
  };
  return payload;
};

exports.Api = {
  port: process.env.PORT || 3000
}
