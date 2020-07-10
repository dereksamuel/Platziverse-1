'use strict';

const five = require('johnny-five');
const BeagleBone = require('beaglebone-io');
const PlatziverseAgent = require('platziverse-agent');

const board = new five.Board({
  io: new BeagleBone()
});// instanciar nueva utilización de five

const agent = new PlatziverseAgent({
  name: 'BeagleBone',
  username: 'dereksamuelgr',
  interval: 2000,
  mqtt: {
    host: 'mqtt://localhost:8010'
  }
});

board.on('ready', function () {
  let temp = 0;

  const sensor = new five.Thermometer({// clases de five
    controller: 'LM35', // controlador
    pin: 'A0'// en puerto análogo del arduino
  });

  agent.addMetric('temperatura', function () {
    return temp;
  });

  sensor.on('change', function () {
    temp = this.celsius;// asignar a temperatura en grados celsius los datos
  });

  agent.connect();
});
