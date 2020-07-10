'use strict';

exports.config = {
  database: process.env.DB_NAME || 'platziverse',
  username: process.env.DB_USER || 'derek',
  password: process.env.DB_PASS || 'platzi',
  host: process.env.DB_HOST || 'localhost',
  dialect: 'postgres',
  logging: () => {},
  setup: true,
  auth: {
    secret: process.env.SECRET || 'secreto',
    algorithms: ['HS256']
  },
  oauth: {
    clientId: '928593104940-u81dhg72gqjmbgd4cc3fatbeu177118d.apps.googleusercontent.com',
    clientIdSecret: 'DNV3PK1MFnd1UzEaLEAY4Apn'
  }
}

exports.config2 = {
  username: 'platziverse',
  password: '8NwI7LmnYePOKpMx',
  host: 'rescue-shard-00-00.rx4kn.mongodb.net',
  port: 27017,
  dbname: 'admin'
}

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
}

exports.Api = {
  port: process.env.PORT || 5500,
  auth: {
    default_user_password: 'secret',
    default_admin_password: 'root',
    public_api_key_token: '',
    admin_api_key_token: ''
  },
  endpoint: process.env.ENDPOINT || 'http://localhost:5500',
  serverHost: 'http://localhost:5009',
  mqttHost: 'mqtt://localhost:8010',
  apiToken: process.env.TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InBpcGFwbHV0YXJjbyIsIm5hbWUiOiJEZXJlayIsImFkbWluIjp0cnVlLCJwZXJtaXNzaW9ucyI6WyJtZXRyaWNzOnJlYWQiXSwiaWF0IjoxNTk0MDgzMTcyfQ.YjCVkO9gs8dSam1Riw6RCUc2_8kgc67kjwTQSQcWQjk',
  portWeb: process.env.PORTWEB || 5009,
  res_error: (err, req, res, message, chalk, status, weight) => {
    if (req && res) {
        res
        .status(status)
        .send(message);
      console.group(chalk.red(weight));
        console.error(chalk.bgRed('[error-message]: '), err.message);
        console.error(chalk.bgRed('[error-stack]: '), err.stack);
      console.group(chalk.red(weight));
    }
    if (weight === 'FATAL ERROR') {
      process.exit(1);
    }
  }
}
