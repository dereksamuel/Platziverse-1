'use strict';

module.exports = class setupAgentService {
  constructor(AgentModel) {
    this.Model = AgentModel;
  }

  findAllData() {
    return this.Model.findAll();
  }

  findConnected() {
    return this.Model.findAll({
      where: {
        connected: true
      }
    });
  }

  findByUsername(username) {
    return this.Model.findAll({
      where: {
        username,
        connected: true
      }
    });
  }

  findById(id) {
    // id = id -5;
    return this.Model.findById(id);
  }

  findByUuid(uuid) {
    return this.Model.findOne({
      where: {
        uuid
      }
    });
  }

  async createOrUpdate(agent) {
    // For update
    const condition = {
      where: {
        uuid: agent.uuid
      }
    };
    const existingAgent = await this.Model.findOne(condition);
    if (existingAgent) {
      const updated = await this.Model.update(agent, condition);
      return updated ? this.Model.findOne(condition) : existingAgent;
    };
    // For create
    const resultCreate = await this.Model.create(agent);
    return resultCreate.toJSON();
  }
}
