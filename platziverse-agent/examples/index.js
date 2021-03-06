'use strict';

const PlatziverseAgent = require('../');

const agent = new PlatziverseAgent({
  name: 'exampleAgent',
  username: 'pepe',
  interval: 2000
});

agent.addMetric('rss', function getRss () {
  return process.memoryUsage().rss;// tipo de 
});

agent.addMetric('promiseKetric', function getRandomPromise () {
  return Promise.resolve(Math.random());
});

agent.addMetric('callbackMetric', function getRandomCallback (callback) {
  setTimeout(() => {
    callback(null, Math.random());
  }, 1000);
});

agent.connect();

//This agent only
agent.on('connected', handler);
agent.on('disconnected', handler);
agent.on('message', handler);

//Other Agents
agent.on('agent/connected', handler);
agent.on('agent/disconnected', handler);
agent.on('agent/message', handler);

function handler (payload) {
  console.log(payload)
}
