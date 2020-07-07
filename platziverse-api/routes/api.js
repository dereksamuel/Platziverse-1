'use strict';

const debug = require('debug')('platziverse:api:routes');
const express = require('express');
const db = require('platziverse-db');
const guard = require('express-jwt-permissions')();
const auth = require('express-jwt');

const { config } = require('../../platziverse-utils/config');

const api = express.Router();
config.logging = (t) => debug(t);

let services, Agent, Metric;

api.use('*', async (req, res, next) => {
  if (!services) {
    try {
      services = await db(config);
      debug('Connected to database');
    } catch (err) {
      next(err);
    }

    Agent = services.Agent;
    Metric = services.Metric;
  }
  next();
});

api.get('/agents', auth(config.auth), async (req, res, next) => {
  debug('A request has come to /agents');

  const { user } = req; // me lo entrega el auth(config.auth)
  console.log('[usuario]: ', user);

  if(!user || !user.username) {
    return next(new Error('unauthorized'));
  }

  let agents = [];

  try {
    if (user.admin) {
      agents = await Agent.findConnected();
    } else {
      agents = await Agent.findByUsername(user.username);
    }
  } catch (err) {
    return next(err);
  }

  res.send(agents);// tal vez el error si se vuelve a ocasionar es por el await aquí
});

api.get('/agent/:uuid', auth(config.auth), async (req, res, next) => {
  const { uuid } = req.params;
  debug('A request has come to /agent/:uuid');
  const { user } = req;

  if(!user || !user.username) {
    return next(new Error('unauthorized'));
  }

  let agent;
  try {
    agent = await Agent.findByUuid(uuid);
  } catch (err) {
    return next(err);
  }

  if (!agent) {
    return next(new Error(`Agent not found with uuid: ${uuid}`));
  };

  res.send(agent);
});

api.get('/metrics/:uuid', auth(config.auth), guard.check(['metrics:read']), async (req, res, next) => {
  const { uuid } = req.params;
  debug(`A request has come to /metrics/${uuid}`);
  const { user } = req;

  if(!user || !user.username) {
    return next(new Error('unauthorized'));
  }
// unauthorized token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InBpcGFwbHV0YXJjbyIsIm5hbWUiOiJEYW5pZWwiLCJhZG1pbiI6dHJ1ZSwicGVybWlzc2lvbnMiOltdLCJpYXQiOjE1OTQwNzQ3MDV9.y0KtGqqEEg24Kjmg-T2Gm1K5F8nSiKwE9P0BZnDC82o
// token valido: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InBpcGFwbHV0YXJjbyIsIm5hbWUiOiJEayIsImFkbWluIjp0cnVlLCJwZXJtaXNzaW9ucyI6WyJtZXRyaWNzOnJlYWQiXSwiaWF0IjoxNTk0MDczNzQ1fQ.PKB7IHTBB4UVoD21KJAwTRWqUON7e0z1x_U29PdV-9c
  let metrics = [];
  try {
    metrics = await Metric.findByAgentUuid(uuid);
  } catch (err) {
    return next(err);
  }

  if (!metrics || metrics.length === 0) {
    return next(new Error(`Metric not found for agent with uuid: ${uuid}`));
  };
  res.json(metrics);
});

api.get('/metrics/:uuid/:type', auth(config.auth), async (req, res, next) => {
  const { uuid, type } = req.params;
  debug(`A request has come to /metrics/${uuid}/${type}`);
  const { user } = req;

  if(!user || !user.username) {
    return next(new Error('unauthorized'));
  }

  let metrics = [];
  try {
    metrics = await Metric.findByTypeAgentUuid(type, uuid);
  } catch (err) {
    console.log(err);
  }

  if (!metrics || metrics.length === 0) {
    return next(new Error(`Metric not found for agent with uuid and type: ${uuid}, ${type}`));
  };
  res.send(metrics);
});

module.exports = api;
