'use strict';

//TODO: https://pandao.github.io/editor.md/en.html
const setupDatabase = require('./lib/db');
const SETUPAgentModel = require('./models/agent');
const SETUPMetricModel = require('./models/metric');
const SetupAgentService = require('./lib/services/agent');
const SetupMetricService = require('./lib/services/metric');
const defaults = require('defaults');

module.exports = async function (config) {
  config = defaults(config, {
    dialect: 'sqlite',
    pool: {
      max: 10,
      min: 0,
      idle: 10000
    },
    query: {
      raw: true
    }
  });
  const sequelize = setupDatabase(config);
  const AgentModel = SETUPAgentModel(config);
  const MetricModel = SETUPMetricModel(config);

  AgentModel.hasMany(MetricModel);// dentro de él va a estar metric model (muchas)
  MetricModel.belongsTo(AgentModel);

  await sequelize.authenticate(); // conectar a la base de datos, se hizo?

  if(config.setup) await sequelize.sync({ force: true });// sincronizar base de datos o crearla // force true destruir y volver a crear db

  const Agent = new SetupAgentService(AgentModel);
  const Metric = new SetupMetricService(MetricModel, AgentModel);

  return {
    Agent,
    Metric
  }
};
