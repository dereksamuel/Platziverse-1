'use strict';

const test = require('ava');
const proxyquire = require('proxyquire');
const sinon = require('sinon');

const fixtureAgent = require('./fixtures/agent');
const { createSandbox } = require('sinon');

let config = {
  logging: () => {}
} // sqlite pruebas

let MetricStub = {
  belongsTo: sinon.spy()// preguntas como: cuántas veces fue llamado el método.
}// TODO: Representa al modelo de métrica

let AgentStub = null;// TODO: Representa al modelo de agente
let db = null;
let sandbox = null;
let id = 2;
let single = Object.assign({}, fixtureAgent.singleAgent);
let uuid = single.uuid; // aquí está el error toJSON
let uuidArgs = { where: { uuid } };
let usernameArgs = { where: { username: 'Testeador2', connected: true } };
let connectedArgs = { where: { connected: true } };
let newAgent = {
  uuid: 'mm-xx-vv-nn',
  name: 'test',
  username: 'Testeador4y5',
  hostname: 'host',
  pid: 0,
  connected: false
};

test.beforeEach(async () => {
  sandbox = sinon.createSandbox();
  AgentStub = {
    hasMany: sandbox.spy()// recetear el estado del sinon, pues AgentStub se llama cada vez que se llama un test
  };

  // Model findOne Stub
  AgentStub.findOne = createSandbox().stub();
  AgentStub.findOne.withArgs(uuidArgs).returns(Promise.resolve(fixtureAgent.byUuid(uuid)));// posible error

  // Model find by Id Stub
  AgentStub.findById = createSandbox().stub()// creamos función en modelo
  AgentStub.findById.withArgs(id).returns(Promise.resolve(fixtureAgent.byId(id)));

  // Model update Stub
  AgentStub.update = createSandbox().stub();
  AgentStub.update.withArgs(single, uuidArgs).returns(Promise.resolve(single));

  // Model create Stub
  AgentStub.create = createSandbox().stub();
  AgentStub.create.withArgs(newAgent).returns(Promise.resolve({
    toJSON() { return newAgent }
  }));

  //findAll Stub
  AgentStub.findAll = createSandbox().stub();
  AgentStub.findAll.withArgs().returns(Promise.resolve(fixtureAgent.all));
  AgentStub.findAll.withArgs(connectedArgs).returns(Promise.resolve(fixtureAgent.allConnected));
  AgentStub.findAll.withArgs(usernameArgs).returns(Promise.resolve(fixtureAgent.allSuesck));

  const setupDatabase = proxyquire('../', {
    './models/agent': () => AgentStub,// reemplaza lo que estas rutas traen del index
    './models/metric': () => MetricStub// sobreescribir modelos
  });// requerir modelos desde afuera

  db = await setupDatabase(config);
});

test.afterEach(() => {
  sandbox && sandbox.restore();// restaurar el estado0 del sandbox
});

test('Agent', (t) => {
  t.truthy(db.Agent, 'Agent service should exist');// tiene un valor que no sea vacío
});

test.serial('Setup', (t) => {
  t.true(AgentStub.hasMany.called, 'AgentModel.hasMany was executed'); // me la da el spy
  t.true(MetricStub.belongsTo.called, 'MetricStub.belongsTo was executed');
  t.true(MetricStub.belongsTo.calledOnce, 'MetricStub should be called once');
  t.true(AgentStub.hasMany.calledOnce, 'AgentStub sholud be called once');
  t.true(AgentStub.hasMany.calledWith(MetricStub), 'Argument sholud be the MetricStub');
  t.true(MetricStub.belongsTo.calledWith(AgentStub), 'Argument should be the Agent');
});// para que el entorno de stubs no esté saturado por eso serial pues ava ejecuta en paralelo, es para no tener problemas con otros test

test.serial('Agent#findAll', async (t) => {
  let agents = await db.Agent.findAllData();

  t.true(AgentStub.findAll.called, 'findAll should be called on model');
  t.true(AgentStub.findAll.calledOnce, 'findAll should be called once');
  t.true(AgentStub.findAll.calledWith(), 'findAll should be called with arguments');

  t.is(agents.length, fixtureAgent.all.length, 'agents sholud be equal quatity');

  t.deepEqual(agents, fixtureAgent.all, 'agents should be the same');
});

test.serial('Agent#findConnected', async (t) => {
  const agents = await db.Agent.findConnected();

  t.true(AgentStub.findAll.called, 'findAll should be called on model');
  t.true(AgentStub.findAll.calledOnce, 'findAll should be called once');
  t.true(AgentStub.findAll.calledWith(connectedArgs), 'findAll should be called with arguments');

  t.is(agents.length, fixtureAgent.allConnected.length, 'agents sholud be equal quatity');

  t.deepEqual(agents, fixtureAgent.allConnected, 'agents should be the same');
});

test.serial('Agent#findById', async (t) => {
  let agent = await db.Agent.findById(id);

  t.true(AgentStub.findById.called, 'findById was executed');
  t.true(AgentStub.findById.calledOnce, 'findById was executed once');
  t.true(AgentStub.findById.calledWith(id), 'findById should be called with specified id');

  t.deepEqual(agent, fixtureAgent.byId(id), 'should be the same');
});

test.serial('Agent#findByUuid', async (t) => {
  let agent = await db.Agent.findByUuid(uuid);

  t.true(AgentStub.findOne.called, 'findOne was executed');
  t.true(AgentStub.findOne.calledOnce, 'findOne was executed once');
  t.true(AgentStub.findOne.calledWith(uuidArgs), 'findOne should be called with specified id');

  t.deepEqual(agent, fixtureAgent.byUuid(uuid), 'should be the same');
});

test.serial('Agent#findByUsername', async (t) => {
  const { username } = usernameArgs.where;
  let agents = await db.Agent.findByUsername(username);

  t.true(AgentStub.findAll.called, 'findAll should be called on model');
  t.true(AgentStub.findAll.calledOnce, 'findAll should be called once');
  t.true(AgentStub.findAll.calledWith(usernameArgs), 'findAll should be called with arguments');

  t.is(agents.length, fixtureAgent.allSuesck.length, 'agents sholud be equal quatity');

  t.deepEqual(agents, fixtureAgent.allSuesck, 'agents should be the same');
});

test.serial('Agent#createOrUpdate - exists', async (t) => {
  let agent = await db.Agent.createOrUpdate(single);

  t.true(AgentStub.findOne.called, 'findOne was executed');
  t.true(AgentStub.findOne.calledTwice, 'findOne was executed twice');
  t.true(AgentStub.findOne.calledWith(uuidArgs), 'findOne should be called with uuid args');

  t.true(AgentStub.update.called, 'agent.update called on model');
  t.true(AgentStub.update.calledOnce, 'update should executed once');
  t.true(AgentStub.update.calledWith(single), 'agent.update should be called with specified args');

  t.deepEqual(agent, single, 'agent should be the same'); // sea lo mismo que yo pedí
});

test.serial('Agent#createOrUpdate - new', async (t) => {
  let agent = await db.Agent.createOrUpdate(newAgent);

  t.true(AgentStub.findOne.called, 'findOne was executed');
  t.true(AgentStub.findOne.calledOnce, 'findOne was executed once');
  t.true(AgentStub.findOne.calledWith({
    where: { uuid: newAgent.uuid }
  }), 'findOne should be called with uuid');
  t.true(AgentStub.create.called, 'create should executed');
  t.true(AgentStub.create.calledOnce, 'create should executed once');
  t.true(AgentStub.create.calledWith(newAgent), 'create should be called with arguments');

  t.deepEqual(agent, newAgent, 'agent should be the same'); // sea lo mismo que yo pedí
});
