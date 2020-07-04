'use strict';

const metric = {
  id: 1,
  type: 'cpu',
  value: '1234Kokorick',
  agentId: null,
  createdAt: new Date(),
  updatedAt: new Date()
};

const metrics = [
  metric,
  extendedMetric(metric, { id: 2, type: 'mobile', value: '456Ñlp' }),
  extendedMetric(metric, { id: 3, type: 'mobile', value: '123987' }),
  extendedMetric(metric, { id: 4, type: 'cpu', value: '5642' }),
];

function extendedMetric (obj, value) {
  const clone = Object.assign({}, obj);
  return Object.assign(clone, value);
};

module.exports = {
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
    items.agentId = uuid;
    return items.agentId === uuid;
  }).shift()
};
