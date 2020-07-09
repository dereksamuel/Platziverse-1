'use strict';

const passport = require('passport');
const axios = require('axios');
const { OAuth2Strategy } = require('passport-oauth');
const Boom = require('@hapi/boom');

const { config, Api } = require('../platziverse-utils/config');
const { oauth } = config;

const GOOGLE_AUTHORIZATION_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://www.googleapis.com/oauth2/v4/token';
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo';

const oAuth2Strategy = new OAuth2Strategy({
  authorizationURL: GOOGLE_AUTHORIZATION_URL,
  tokenURL: GOOGLE_TOKEN_URL,
  clientID: oauth.clientId,
  clientSecret: oauth.clientIdSecret,
  callbackURL: '/auth/google-oauth/callback'// siempre un callback
}, async (accessToken, refreshToken, profile, cb) => {
  const { data, status } = await axios({
    url: `${Api.endpoint}/auth/sign-provider`,
    method: 'post',
    data: {
      name: profile.name,
      email: profile.email,
      password: profile.id,
      apiKeyToken: Api.apiToken
    }
  });

  if (!data || status !== 200) {
    return cb(Boom.unauthorized(), false);
  }

  return cb(null, data);
});

oAuth2Strategy.userProfile = function(accessToken, done) {
  this._oauth2.get(GOOGLE_USERINFO_URL, accessToken, (err, body) => {
    if (err) {
      return done(err);
    }

    try {
      const { sub, name, email } = JSON.parse(body);

      const profile = {
        id: sub,
        name,
        email
      }

      done(null, profile);
    } catch (err) {
      return done(err);
    }
  });
}

passport.use('google-oauth', oAuth2Strategy);
