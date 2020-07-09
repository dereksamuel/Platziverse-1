'use strict';

const express = require('express');
const request = require('request-promise-native');
const jwt = require('jsonwebtoken');

const api = express.Router();
const { Api, config } = require('../platziverse-utils/config');
const passport = require('passport');
const Boom = require('@hapi/boom');
const { endpoint, apiToken } = Api;
const userServices = require('../platziverse-db/lib/services/users');
const userService = new userServices();

require('./oauth');

api.get('/auth/google-oauth', passport.authenticate('google-oauth', {
  scope: ['email', 'profile', 'openid']
}));

api.get('/auth/google-oauth/callback', passport.authenticate('google-oauth', { session: false }), (req, res, next) => {
  if (!req.user) {
    next(Boom.unauthorized());
  }

  const { token, ...user } = req.user;
  res.cookie('token', token, {
    httpOnly: !config.dev,
    secure: !config.dev
  });
  res.status(200).json(user);
  res.redirect('/agents');
});

api.post('/sign-provider', async (req, res, next) => {
  const { body } = req;

  const { ...user } = body;

  try {
    const queriedUser = await userService.getUserOrCreate({ user });
    const { _id: id, name, email } = queriedUser;
    const payload = {
      sub: id,
      name,
      email
    }

    const token = jwt.sign(payload, config.auth.secret, {
      expiresIn: '15m'
    });

    return res.status(200).json({ token, user: { id, name, email } });
  } catch (err) {
    next(err);
  }
});

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

api.get('/agent/:uuid', async (req, res, next) => {
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

api.get('/metrics/:uuid', async (req, res, next) => {
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

api.get('/metrics/:uuid/:type', async (req, res, next) => {
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
