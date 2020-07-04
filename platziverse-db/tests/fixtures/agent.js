'use strict';

const agent = {
  id: Math.random(),
  uuid: 'xx-mm-nn',
  name: 'Mario',
  username: 'Testeador',
  hostname: 'test-host',
  pid: 0,
  type: 'cpu',
  connected: true,
  createdAt: new Date(),
  updatedAt: new Date()
}

const agents = [
  agent,
  extendedLazzy(agent, { id: 2, uuid: 'mm-xx-vv', name: 'Suesck', username: 'Testeador2', pid: 2, connected: false }),
  extendedLazzy(agent, { id: 3, uuid: 'nm-xi-vf', name: 'Suesck3', username: 'Testeador3', pid: 3, type: 'mobile' }),
  extendedLazzy(agent, { id: 4, uuid: 'jj-zz-aa', name: 'Suesck4', username: 'Testeador4', pid: 4, connected: false })
];

function extendedLazzy(object, value) {
  const clone = Object.assign({}, object);// primer valor es el objeto al que le quiere copiar propiedades y el segundo valores que quiero copiar
  return Object.assign(clone, value);
}

module.exports = {
  singleAgent: agent,
  all: agents,
  allConnected: agents.filter((items) => items.connected === true),
  allDisconnected: agents.filter((items) => items.connected === false),
  allSuesck: agents.filter((items) => items.name === 'Testeador2'),
  byUuid: (uuid) => agents.filter((items) => items.uuid === uuid).shift(),
  byId: (id) => agents.find((items) => items.id === id)
};
