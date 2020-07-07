'use strict';


const agent = {
  "id":3,
  "uuid":"mm-xx-vv-nn",
  "username":"Pepe",
  "name":"Derek",
  "hostname":"host",
  "pid":1,
  "connected":true,
  "createdAt":"2020-07-05T21:51:15.964Z",
  "updatedAt":"2020-07-05T21:51:15.964Z"
}

const agents = [
  agent,
  extendedLazzy(agent, { id: 2, uuid: 'mm-xx-vv', name: 'Suesck', username: 'Testeador2', pid: 2, connected: false }),
  extendedLazzy(agent, { "id":5,"uuid":"yyy-tt-zz","username":"desadaal","name":"Milena","hostname":"host","pid":13210,"connected":true,"createdAt":"2020-07-05T22:12:56.460Z","updatedAt":"2020-07-05T22:12:56.460Z" }),
  extendedLazzy(agent, { id: 4, uuid: 'jj-zz-aa', name: 'Suesck4', username: 'Testeador4', pid: 4, connected: false })
];

function extendedLazzy(object, value) {
  const clone = Object.assign({}, object);// primer valor es el objeto al que le quiere copiar propiedades y el segundo valores que quiero copiar
  return Object.assign(clone, value);
}

//**/////***//**//*/****/***/**/**-*/ */ */ */ */ */ */ */

const metric = {
  id: 1,
  type: 'callbackMetric',
  value: '1234Kokorick',
  agentId: '73c61e52-2d0b-4811-936e-da6e5518d134',
  createdAt: new Date(),
  updatedAt: new Date()
};

const metrics = [
  metric,
  extendedMetric(metric, { id: 2, type: 'mobile', value: '456Ñlp', agentId: 'c71d80db-d16c-4d25-bb91-5d2ab4f422d4' }),
  extendedMetric(metric, { id: 3, type: 'mobile', value: '123987', agentId: '6b7a6dde-551d-410b-b297-e94b8b637556' }),
  extendedMetric(metric, { id: 4, type: 'cpu', value: '5642' }),
];

function extendedMetric (obj, value) {
  const clone = Object.assign({}, obj);
  return Object.assign(clone, value);
};

module.exports = {
  agent: {
    singleAgent: agent,
    all: agents,
      allConnected: agents.filter((items) => items.connected === true),
      allDisconnected: agents.filter((items) => items.connected === false),
      allSuesck: agents.filter((items) => items.name === 'Testeador2'),
      byUuid: (uuid) => agents.filter((items) => items.uuid === uuid).shift(),
      byId: (id) => agents.find((items) => items.id === id)
  },
  metric: {
      singleMetric: metric,
      all: metrics,
      findById: (id) => metrics.find((item) => item.id === id),
      allTypes: () => metrics.forEach((item) => {
        console.log(item.type);
        return item.type;
      }),
      TypeSelected: (selected) => metrics.filter((item) => item.type === selected),
      allValues: () => metrics.forEach((item) => {
        console.log(item.value);
        return item.value;
      }),
      orderByTheSelected: (orderBy, limit) => {
        const filteredOrder = metrics.filter((items) => items.type);
        if (orderBy === 'DESC') {
          return filteredOrder.reverse().slice(0, limit);
        }
        if (orderBy === 'ASCE'){
          return filteredOrder.slice(0, limit);
        }
        return null;
      },
      findAgentById: (uuid) => metrics.filter((items) => {
        return items.agentId === uuid;
      }).shift()
  }
}