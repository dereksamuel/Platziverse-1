'use strict';

const debug = require('debug')('platziverse-agent');
const mqtt = require('mqtt');
const defaults = require('defauults');
const uuid = require('uuid');
const EventEmiter = require('events');

const { transform } = require('../platziverse-utils/config');

const options = {
  name: 'untiled',
  username: 'derek',
  interval: 5000,
  mqtt: {
    host: 'mqtt://localhost'
  }
}

class PlatziverseAgent extends EventEmiter {
  constructor (opts) {
    super();
    this.options = defaults(opts, options);
    this.timer = null;
    this.status_timer = false;
    this.client = null;
  }
  connect () {
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
        this.timer = setInterval(() => {
          this.emit('agent/message', 'this is a message');
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
  disconnect () {
    if (this.status_timer) {
      clearInterval(this.timer);
      this.status_timer = false;
      this.emit('disconnected');
    }
  }
};

module.exports = PlatziverseAgent;
