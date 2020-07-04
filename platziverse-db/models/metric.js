'use strict';

const { DataTypes } = require('sequelize');
const setupDatabase = require('../lib/db');

module.exports = function setupMetricModel(config) {
  const sequelize = setupDatabase(config); //TODO: Definir métricas en la base de datos que es sequelize
  return sequelize.define('METRIC', {
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    value: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  });
}