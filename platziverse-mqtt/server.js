'use strict';
const debug = require('debug')('platziverse:mqtt');
const { Server } = require('mosca');
const redis = require('redis');
const chalk = require('chalk');
const db = require('platziverse-db');
const { config } = require('../response/config');
const parseToReadable = require('../response/utils');

config.logging = (t) => debug(t);

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
const clients = new Map();

let Agent, Metric;

server.on('clientConnected', (client) => {
  debug(`CLient connected: ${client.id}`);
  clients.set(client.id, null);
});

server.on('clientDisconnected', async (client) => {
  debug(`CLient disconnected: ${client.id}`);
  const agent = clients.get(client.id);

  if (agent) {
    agent.connected = false;
    try {
      await Agent.createOrUpdate(agent);
    } catch (err) {
      return handleError(err);
    };

    clients.delete(client.id);
    server.publish({
      topic: 'agent/disconnected',
      payload: JSON-stringify({
        agent: {
          uuid: agent.uuid,
          name: agent.name,
          hostname: agent.hostname,
          pid: agent.pid,
          connected: agent.connected
        }
      })
    });
    debug(`CLient (${client.id}) associated to Agent (${agent.uuid}) marked as disconnected`);
  };
});

server.on('published', async (packet, client) => {
  debug(`Received: ${packet.topic}`); // tipo de mensaje

  switch (packet.topic) {
    case 'agent/connected':
    case 'agent/disconnected':
      debug(`Payload: ${packet.payload}`);// 
      break;
    case 'agent/message':
      debug(`Payload: ${packet.payload}`);
      const payload = parseToReadable(packet.payload);
      if (payload) {
        payload.agent.connected = true;
        let agent;
        try {
          agent = await Agent.createOrUpdate(payload.agent);
        } catch (err) {
          return handleError(err);
        };
        debug(`Àgent ${agent.uuid} saved`);

        //Notify agent is connected
        const { uuid, name, hostname, pid, connected } = agent;

        if (!clients.get(client.id)) {
          clients.set(client.id, agent);
          server.publish({
            topic: 'agent/connected',
            payload: JSON.stringify({
              agent: {
                uuid,
                name,
                hostname,
                pid,
                connected
              }
            })
          });
        };

        //Store Metrics
        for (let metric of payload.metrics) {// iterar sobre arreglo como forEach
          let m;
          try {
            m = await Metric.createMetric(agent.uuid, metric);
          } catch (err) {
            return handleError(err);
          };

          debug(`Metric ${m.id} saved on agent ${agent.uuid}`);
        };
      }
      break;
    default:
      break;
  };
});

server.on('ready', async () => {
  const services = await db(config).catch(handleFatalError);

  Agent = services.Agent;
  Metric = services.Metric;

  console.log(`${chalk.bgGreen(chalk.blackBright('[platzi-mqtt]:'))} server is running on port ${settings.port}`);
});

server.on('error', handleFatalError);

function handleFatalError (err) {
  console.group(chalk.redBright('FATAL_ERROR'));
    console.error(chalk.bgRed('[error-message]: '), err.message);
    console.error(chalk.bgRed('[error-stack]: '), err.stack);
  console.group(chalk.redBright('FATAL_ERROR'));
  process.exit(1);
};

function handleError (err) {
  console.group(chalk.redBright('ERROR'));
    console.error(chalk.bgRed('[error-message]: '), err.message);
    console.error(chalk.bgRed('[error-stack]: '), err.stack);
  console.group(chalk.redBright('ERROR'));
};

process.on('uncaughtException', handleFatalError);
process.on('unhandledRejection', handleFatalError);// cuando no manejo el rejection de una promise
