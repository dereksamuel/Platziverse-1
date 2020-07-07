'use strict';

const test = require('ava');
const util = require('util');
const request = require('supertest'); // supertest es para hacer peticiones http
const { createSandbox } = require('sinon');
const proxyquire = require('proxyquire');

const serverApi = require('../index');
const { agent, metric } = require('../../platziverse-utils/fixtures');
const auth = require('../auth');
const { config } = require('../../platziverse-utils/config');
const sign = util.promisify(auth.sign);

let sandbox = null;
let token = null;
let server = null;
let dbStub = null;
let AgentStub = {};
let MetricStub = {};

test.beforeEach(async () => {
  sandbox = createSandbox();

  dbStub = createSandbox().stub();
  dbStub.returns(Promise.resolve({
    Agent: AgentStub,
    Metric: MetricStub
  }));

  AgentStub.findConnected = createSandbox().stub();
  AgentStub.findConnected.returns(Promise.resolve(agent.allConnected));

  token = await sign({ admin: true, username: 'Esgar' }, config.auth.secret);

  const api = proxyquire('../routes/api.js', {
    'platziverse-db': dbStub
  });

  server = proxyquire('../index.js', {
    './routes/api.js': api// traer rutas del api con dbStub
  });
});

test.afterEach(() => {
  sandbox && createSandbox().restore();
});

test.serial.cb('/api/agents', (t) => {
  request(serverApi)
    .get('/api/agents')
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      t.falsy(err, 'Error should be false');
      let body = JSON.stringify(res.body);
      let expected = JSON.stringify(agent.allConnected);
      t.deepEqual(body, expected, 'response.body should be the expected agent');
      t.end();
    });
});

test.serial.cb('/api/agents - NOT AUTHORIZED', (t) => {
  const tokenStub = '454f5d5fsd5f1sdf1ds1fds21f2ds'
  request(serverApi)
    .get('/api/agents')
    .set('Authorization', `Bearer ${tokenStub}`)
    .expect(500)
    .expect('Content-Type', /text/)
    .end((err, res) => {
      let body = JSON.stringify(res.body);
      let expected = JSON.stringify(agent.allConnected);
      t.notDeepEqual(body, expected, 'response.body should not be the expected agent');
      t.end();
    });
});

test.serial.todo('/api/agent/:uuid');

test.serial.cb('/api/agent/:uuid - FIND AGENT BY UUID', (t) => {
  const uuid = 'yyy-tt-zz';

  request(serverApi)
    .get(`/api/agent/${uuid}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
    .expect('Content-Type', /json/)
    .expect('Content-Length', '190')
    .end((err, res) => {
      t.falsy(err, 'Error should be false');
      let Agent = res.body;
      let AgentFixture = agent.byUuid(uuid);
      t.truthy(Agent, 'Should be exist agent');
      t.deepEqual(Agent, AgentFixture, 'response.body should be the expected agent find by uuid');
      t.end();
    });
});

test.serial.todo('/api/agent/:uuid - not found')

test.serial.cb('/api/agent/:uuid - FIND AGENT BY UUID (NOT FOUND)', (t) => {
  const uuid = 'yyy-tt-zzAS4415465a646asas3a';

  request(serverApi)
    .get(`/api/agent/${uuid}`)
    .expect(404)
    .expect('Content-Type', /text/)
    .expect('Content-Length', '9')
    .end((err, res) => {
      t.truthy(err, 'Error should be true');
      let AgentFixture = agent.byUuid(uuid);
      let ResponseNotFound = JSON.stringify(res.body);
      t.deepEqual(ResponseNotFound, '{}', 'Response on body should be {}');
      t.notDeepEqual(uuid, AgentFixture, 'response.body should not be the expected agent found by uuid');
      t.end();
    });
});

test.serial.todo('/api/metrics/:uuid')

test.serial.cb('/api/metrics/:uuid - FIND UUID OF AGENT WITH METRICS', (t) => {
  const uuid = '73c61e52-2d0b-4811-936e-da6e5518d134';

  request(serverApi)
    .get(`/api/metrics/${uuid}`)
    .set('Authorization', `Bearer ${token}`)
    .expect('Content-Type', /json/)
    .expect('Content-Length', '67')
    .end((err, res) => {
      t.falsy(err, 'Error should be false');
      let MetricBody = res.body;
      let MetricFixture = [
        {
          type: 'callbackMetric',
        },
        {
          type: 'promiseKetric',
        },
        {
          type: 'rss',
        },
      ];
      t.truthy(MetricBody, 'res.body should be exist');
      t.deepEqual(MetricBody, MetricFixture, 'MetricBody should be equal to MetricFixture');
      t.end();
    });
});

test.serial.todo('/api/metrics/:uuid - not found')

test.serial.cb('/api/metrics/:uuid - FIND UUID OF AGENT WITH METRICS (NOT FOUND)', (t) => {
  const uuid = 'cualquierCosa';
  request(serverApi)
    .get(`/api/metrics/${uuid}`)
    .expect(404)
    .expect('Content-Type', /text/)
    .expect('Content-Length', '9')
    .end((err, res) => {
      t.truthy(err, 'Error should be true');
      let MetricFixture = agent.byUuid(uuid);
      let ResponseNotFound = JSON.stringify(res.body);
      t.deepEqual(ResponseNotFound, '{}', 'Response on body should be {}');
      t.notDeepEqual(uuid, MetricFixture, 'response.body should not be the expected agent found by uuid');
      t.end();
    });
});

test.serial.todo('/api/metrics/:uuid/:type')

test.serial.cb('/api/metrics/:uuid/:type - FIND UUID OF AGENT AND TYPE OF METRICS WITH METRICS', (t) => {
  const uuid = '6b7a6dde-551d-410b-b297-e94b8b637556';
  const type = 'callbackMetric';

  request(serverApi)
    .get(`/api/metrics/${uuid}/${type}`)
    .set('Authorization', `Bearer ${token}`)
    .expect('Content-Type', /json/)
    .expect('Content-Length', '309')
    .end((err, res) => {
      t.falsy(err, 'Error should be false');
      let MetricTypeFixture = [
        {
          createdAt: '2020-07-05T22:24:04.870Z',
          id: 47,
          type: 'callbackMetric',
          value: '0.05874242582302891',
        },
        {
          createdAt: '2020-07-05T22:24:02.886Z',
          id: 44,
          type: 'callbackMetric',
          value: '0.2968601413510581',
        },
        {
          createdAt: '2020-07-05T22:24:00.922Z',
          id: 41,
          type: 'callbackMetric',
          value: '0.06692634490428051',
        },
      ];
      let Response = res.body;
      t.deepEqual(Response, MetricTypeFixture, 'Response.body should be equal to MetricTypeFixture');
      t.end();
    });
});

test.serial.todo('/api/metrics/:uuid/:type - not found')

test.serial.cb('/api/metrics/:uuid/:type - FIND UUID OF AGENT AND TYPE OF METRICS WITH METRICS (NOT FOUND)', (t) => {
  const uuid = 'cualquierCosa';
  const type = 'cualquierTipo'
  request(serverApi)
    .get(`/api/metrics/${uuid}/${type}`)
    .expect(404)
    .expect('Content-Type', /text/)
    .expect('Content-Length', '9')
    .end((err, res) => {
      t.truthy(err, 'Error should be true');
      let ResponseNotFound = JSON.stringify(res.body);
      t.deepEqual(ResponseNotFound, '{}', 'Response on body should be {}');
      t.end();
    });
});
