'use strict';

const proxyquire = require('proxyquire');
const sinon = require('sinon');
const { createSandbox } = require('sinon');
const test = require('ava');

const { agent, metric } = require('../../platziverse-utils/fixtures');

const agentFixtures = agent;
const fixtureMetric = metric;

let config = {
  dialect: 'sqlite',
  logging: () => {}
};
let db = null;

let single = Object.assign({}, agentFixtures.singleAgent);
let uuid = single.uuid;

let singleMetric = Object.assign({}, fixtureMetric.singleMetric);
let type = singleMetric.type;

let byID = fixtureMetric.findAgentById(uuid);
let byTypes = fixtureMetric.allTypes();

let uuidArgs = { where: { uuid } };
let AgentStub = null;
let MetricStub = {
  belongsTo: sinon.spy()
};

const findAgentByUuid = {
  attributes: [ 'type' ],
  group: [ 'type' ],
  include: [{
    attributes: [],
    where: {
      uuid
    }
  }],
  raw: true
};

const findTypeByAgentUuid = {
  attributes: [ 'id', 'type', 'value', 'creadedAt' ],
  where: {
    type
  },
  limit: 15,
  order: [[ 'createdAt', 'DESC' ]],
  include: [{
    attributes: [],
    where: {
      uuid
    }
  }],
  raw: true
};

let newMetric = {
  id: 1,
  type: 'cpu',
  value: '1234Kokorick',
  agentId: null
};

test.beforeEach(async () => {
  AgentStub = {
    hasMany: createSandbox().spy()
  };

  //for findAll
  MetricStub.findAll = createSandbox().stub();
  MetricStub.findAll.withArgs(findAgentByUuid).returns(Promise.resolve(byID, byTypes));
  MetricStub.findAll.withArgs(findTypeByAgentUuid).returns(Promise.resolve(fixtureMetric.orderByTheSelected('DESC'), fixtureMetric.TypeSelected(type)));

  //FindOne for Agent
  AgentStub.findOne = createSandbox().stub();
  AgentStub.findOne.withArgs(uuidArgs).returns(Promise.resolve(agentFixtures.byUuid(uuid)));

  //For create Metric
  MetricStub.create = createSandbox().stub();
  MetricStub.create.withArgs(newMetric).returns(Promise.resolve({
    toJSON() { return newMetric }
  }));

  const setupDatabase = proxyquire('../', {
    './models/agent.js': () => AgentStub,
    './models/metric.js': () => MetricStub
  });

  db = await setupDatabase(config);
});

test('Metric', (t) => {
  t.truthy(db.Metric, 'setupDatabase should have the metricStub');
  t.truthy(db.Agent, 'setupDatabase should have the agentStub');
});

test.serial('Metric#FindAgentByUuid', async (t) => {
  let agent = await db.Agent.findByUuid(uuid);
  let metric = await db.Metric.findByAgentUuid(uuid);

  t.true(MetricStub.findAll.calledOnce, 'FindAll should be executed once');
  t.true(MetricStub.findAll.calledWith(findAgentByUuid), 'findAll should be called with args of agentUuid');

  t.deepEqual(agent.uuid, metric.agentId, 'Agent.uuid should be just as metric.AgentId');
});

test.serial('Metric#FindTypeByAgentUuid', async (t) => {
  let agent = await db.Agent.findByUuid(uuid);
  let metric = await db.Metric.findByTypeAgentUuid(type, uuid);

  t.true(MetricStub.findAll.calledOnce, 'FindAll should be executed once');
  t.true(MetricStub.findAll.calledWith(findTypeByAgentUuid), 'findAll should be called with args of agentUuid');

  t.deepEqual(metric[0].id, 4, 'Metric id should be four because in fixtures this is define so');
  t.deepEqual(agent.type, metric[0].type, 'Agent.uuid should be just as metric.AgentId');
});

test.serial('Metric#Create', async (t) => {
  let agent = await db.Agent.findByUuid(uuid);
  let metric = await db.Metric.createMetric(uuid, newMetric);
  newMetric.agentId = agent.uuid;

  t.true(MetricStub.create.calledOnce, 'create should be executed once');
  t.true(MetricStub.create.calledWith(newMetric), 'create should be called with args of newMetric');

  t.deepEqual(agent.uuid, newMetric.agentId, 'Metric id should be four because in fixtures this is define so');
  t.deepEqual(metric, newMetric, 'metric should be just as newMetric');
});
