'use strict';

const db = require('../');
const chalk = require('chalk');
const { config } = require('../../platziverse-utils/config');

async function run () {
  const { Agent, Metric } = await db(config).catch(handleFatalError);

  const agent = await Agent.createOrUpdate({
    uuid: 'yyy-tt-zz',
    name: 'Milena',
    username: 'desadaal',
    hostname: 'host',
    pid: process.pid,
    connected: true
  }).catch(handleFatalError);

  console.group(chalk.blueBright('-- AGENT --'));
    console.log(agent);
  console.group(chalk.blueBright('-- AGENT --'));

  const agents = await Agent.findAllData().catch(handleFatalError);
  console.group(chalk.yellow('-- AGENTS --'));
    console.log(agents);
  console.group(chalk.yellow('-- AGENTS --'));

  const metrics = await Metric.findByAgentUuid(agent.uuid).catch(handleFatalError);
  console.group(chalk.magenta('-- METRICS --'));
    console.log(metrics);
  console.group(chalk.magenta('-- METRICS --'));

  const metric = await Metric.createMetric(agent.uuid, {
    type: 'memory',
    value: 300
  }).catch(handleFatalError);
  console.group(chalk.cyan('-- METRIC --'));
    console.log(metric);
  console.group(chalk.cyan('-- METRIC --'));

  const metricTypes = await Metric.findByTypeAgentUuid('memory', agent.uuid).catch(handleFatalError);
  console.group(chalk.white('-- METRIC_TYPES --'));
    console.log(metricTypes);
  console.group(chalk.white('-- METRIC_TYPES --'));
};

function handleFatalError (err) {
  console.group(chalk.redBright('FATAL_ERROR'));
    console.error(chalk.bgRed('[error-message]: '), err.message);
    console.error(chalk.bgRed('[error-stack]: '), err.stack);
  console.group(chalk.redBright('FATAL_ERROR'));
  process.exit(1);
};

run();
