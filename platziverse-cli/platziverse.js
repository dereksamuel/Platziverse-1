#!/usr/bin/env node

'use strict';

const blessed = require('blessed');
const contrib = require('blessed-contrib');
const platziverseAgent = require('platziverse-agent');
const moment = require('moment');

const agent = new platziverseAgent();
const agents = new Map();
const metrics = new Map();

const screen = blessed.screen();
const grid = new contrib.grid({
  rows: 1,
  cols: 4,
  screen
});

const tree = grid.set(0, 0, 1, 1, contrib.tree, {
  label: 'Connected Agents'
});

const line = grid.set(0, 1, 1, 3, contrib.line, {
  label: 'Metrics',
  showLegend: true,
  minY: 0,
  xPadding: 5
});

agent.on('agent/connected', payload => {
  const { uuid } = payload.agent

  if (!agents.has(uuid)) {
    agents.set(uuid, payload.agent)
    agentMetrics.set(uuid, {})
  }

  renderData()
})

tree.on('select', node => {
  const { uuid } = node;

  if (node.agent) {
    node.extended ? extended.push(uuid) : extended = extended.filter(e => e !== uuid);
    selected.uuid = null;
    selected.type = null;
    return;
  }

  selected.uuid = uuid;
  selected.type = node.type;

  renderMetric();
});

function renderMetric () {
  if (!selected.uuid && !selected.type) {
    line.setData([{ x: [], y: [], title: '' }])
    screen.render()
    return
  }

  const agentMetrics = metrics.get(selected.uuid)
  const values = agentMetrics[selected.type]
  const series = [{
    title: selected.type,
    x: values.map(v => v.timestamp).slice(-10),
    y: values.map(v => v.value).slice(-10)
  }]

  line.setData(series)
  screen.render()
}

agent.on('agent/disconnected', payload => {
  const { uuid } = payload.agent

  if (agents.has(uuid)) {
    agents.delete(uuid)
    agentMetrics.delete(uuid)
  }

  renderData()
})

agent.on('agent/message', (payload) => {
  const { uuid } = payload.agent;
  const { timestamp } = payload;

  if (!agents.has(uuid)) {
    agents.set(uuid, payload.agent);
    metrics.set(uuid, {});
  }

  const agentMetrics = metrics.get(uuid);

  payload.metrics.forEach((element) => {
    const { type, value } = element;
    if (!Array.isArray(agentMetrics[type])) {
      agentMetrics[type] = [];
    }

    const length = agentMetrics[type].length;
    if(length >= 20) {
      agentMetrics[type].shift();// para eliminar en map
    }

    agentMetrics[type].push({
      value,
      timestamp: moment(timestamp).format('HH:mm:ss')
    });// agregar dentro de cada tipo
  });

  renderData();
});

function renderData() {
  const treeData = {};
  for (let [ uuid, val ] of agents) {
    const title = `${val.name} - (${val.pid})`;
    treeData[title] = {
      uuid,
      agent: true,
      children: {}
    }// así se agrega una propiedad a un objeto

    const agentMetrics = metrics.get(uuid);
    Object.keys(agentMetrics).forEach((type) => {
      const metric = {
        uuid,
        type,
        metric: true
      }

      const metricName = ` ${type}`;
      treeData[title].children[metricName] = metric;
    });
  }

  tree.setData({
    extended: true,
    children: treeData
  });

  screen.render();
}

screen.key([ 'escape', 'q', 'C-c' ], (ch, key) => {
  process.exit(0);
});

agent.connect();
tree.focus();
screen.render();
