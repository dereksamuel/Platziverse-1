'use strict';

module.exports = class SetupMetricService {
  constructor(MetricModel, AgentModel) {
    this.MetricModel = MetricModel;
    this.AgentModel = AgentModel;
  }

  async findByAgentUuid (uuid) {
    return this.MetricModel.findAll({
      attributes: [ 'type' ], // array con alias
      group: [ 'type' ],
      include: [{
        attributes: [],
        model: this.AgentModel,
        where: {
          uuid
        }
      }],
      raw: true// solo en js o en JSON
    });
  }

  async findByTypeAgentUuid(type, uuid) {
    return this.MetricModel.findAll({
      attributes: [ 'id', 'type', 'value', 'createdAt' ],
      where: {
        type
      },
      limit: 15,
      order: [[ 'createdAt', 'DESC' ]],
      include: [{
        attributes: [],
        model: this.AgentModel,
        where: {
          uuid
        }
      }],
      raw: true
    });
  }

  async createMetric(uuid, metric) {
    const agentExist = await this.AgentModel.findOne({ where: { uuid } });

    if (agentExist) {
      Object.assign(metric, { AGENTId: agentExist.id });// metric.agentId = agentExist.id
      const result = await this.MetricModel.create(metric);
      return result.toJSON();
    }
  }
};
