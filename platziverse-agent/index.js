'use strict';

const debug = require('debug')('platziverse-agent');
const os = require('os');
const util = require('util');
const mqtt = require('mqtt');
const defaults = require('defaults');
const uuid = require('uuid');
const EventEmiter = require('events');// es event emiter en esta evaluación

const { transform } = require('../platziverse-utils/config');

const options = {
  name: 'untiled',
  username: 'derek',
  interval: 5000,
  mqtt: {
    host: 'mqtt://localhost:8010'
  }
}

class PlatziverseAgent extends EventEmiter {
  constructor(opts) {
    super();
    this.options = defaults(opts, options);
    this.timer = null;
    this.status_timer = false;
    this.client = null;
    this.metrics = new Map();
  }
  addMetric(type, fn) {
    this.metrics.set(type, fn);
  }
  removeMetric(type) {
    this.metrics.delete(type);
  }
  connect() {
    if (!this.status_timer) {
      const opts = this.options;
      this.client = mqtt.connect(opts.mqtt.host);
      this.status_timer = true;

      this.client.subscribe('agent/message');// para escuchar
      this.client.subscribe('agent/connected');
      this.client.subscribe('agent/disconnected');


      this.client.on('connect', () => {
        this.agentId = uuid.v4(); // un uuid único creado
        this.emit('connected', this.agentId);
        this.timer = setInterval(async () => {
          if (this.metrics.size > 0) {
            let message = {
              agent: {
                uuid: this.agentId,
                username: opts.username,
                name: opts.name,
                hostname: os.hostname() || 'localhost',
                pid: process.pid
              },
              metrics: [],
              timestamp: new Date().getTime()
            }
            for (let [ type, fn ] of this.metrics) {// for Each
              if (fn.length === 1) {// ver cantidad de argumentos en función
                fn = util.promisify(fn); // promisify sirve para ver si al argumento le pasaron parámetros, en tal caso sería un cb
              }
              message.metrics.push({
                type,
                value: await Promise.resolve(fn())
              });
            }
            debug('Sending', message);
            
            this.client.publish('agent/message', JSON.stringify(message));
            this.emit('message', message);
          }
        }, opts.interval);
      });

      this.client.on('message', (topic, payload) => {
        payload = transform(payload);
        let broadcast = false;

        switch (topic) {
          case 'agent/connected':
            break;
          case 'agent/disconnected':
            break;
          case 'agent/message':
            broadcast = payload && payload.agent && payload.agent.uuid !== this.agentId;
            break;
        
          default:
            break;
        }
        if (broadcast) {
          this.emit(topic, payload);
        }
      });// recibir message

      this.client.on('error', () => this.disconnect());
    }
  }
  disconnect() {
    if (this.status_timer) {
      clearInterval(this.timer);
      this.status_timer = false;
      this.emit('disconnected');
      this.client.end();
    }
  }
};

module.exports = PlatziverseAgent;
