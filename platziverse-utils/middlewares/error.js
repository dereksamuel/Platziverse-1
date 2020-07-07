'use strict';
const { Api } = require('../config');
const { res_error } = Api;
const chalk = require('chalk');

module.exports = (err, req, res, next) => {
  const e = 'Error';

  if (err.message.match(/not found/)) {// si tiene en alguna parte not found
    return res_error(err, req, res, 'Not found', chalk, 400, e);
  };

  if (err.message.match(/unauthorized/)) {
    return res_error(err, req, res, 'Unauthorized', chalk, 401, e);
  };

  res_error(err, req, res, 'Error en el servidor', chalk, 500, e);
};
