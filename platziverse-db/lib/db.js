'use strict';

const Sequelize = require('sequelize');
let sequelize = null;

module.exports = function setupDatabase(config) {
  if (!sequelize) {
    sequelize = new Sequelize(config); // Para no crear multiples instancias a la base de datos
  }
  return sequelize;
};
