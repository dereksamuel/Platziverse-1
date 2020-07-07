'use strict';

const express = require('express');
const request = require('request-promise-native');

const api = express.Router();
const { Api } = require('../platziverse-utils/config');
const { endpoint, apiToken } = Api;

api.get('/agents', async (req, res, next) => {
  const options = {
    method: 'GET',
    url: `${endpoint}/api/agents`,
    headers: {
      'Authorization': `Bearer ${apiToken}`
    },
    json: true
  };

  let result;

  try {
    result = await request(options);
  } catch (err) {
    return next(err);
  };

  res.send(result);
});

api.get('/agent/:uuid', async (req, res) => {
  const { uuid } = req.params;
  const options = {
    method: 'GET',
    url: `${endpoint}/api/agent/${uuid}`,
    headers: {
      'Authorization': `Bearer ${apiToken}`
    },
    json: true
  };

  let result;
  try {
    result = await request(options);
  } catch (err) {
    return next(err);
  }

  res.send(result);
});

api.get('/metrics/:uuid', async (req, res) => {
  const { uuid } = req.params;
  const options = {
    method: 'GET',
    url: `${endpoint}/api/metrics/${uuid}`,
    headers: {
      'Authorization': `Bearer ${apiToken}`
    },
    json: true
  };

  let result;
  try {
    result = await request(options);
  } catch (err) {
    return next(err);
  };

  res.send(result);
});

api.get('/metrics/:uuid/:type', async (req, res) => {
  const { uuid, type } = req.params;
  const options = {
    method: 'GET',
    url: `${endpoint}/api/metrics/${uuid}/${type}`,
    headers: {
      'Authorization': `Bearer ${apiToken}`
    },
    json: true
  };

  let result;
  try {
    result = await request(options);
  } catch (err) {
    return next(err);
  };

  res.send(result);
});

module.exports = api;
