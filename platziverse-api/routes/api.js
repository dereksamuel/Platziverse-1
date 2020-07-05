'use strict';

const debug = require('debug')('platziverse:api:routes');
const express = require('express');

const api = express.Router();

api.get('/agents', (req, res) => {
  res.send('Hello platziverse online');
});

api.get('/agent/:uuid', (req, res) => {
  const { uuid } = req.params;
});

api.get('/metrics/:uuid', (req, res) => {
  const { uuid } = req.params;
});

api.get('/metrics/:uuid/:type', (req, res) => {
  const { uuid, type } = req.params;
});

module.exports = api;
