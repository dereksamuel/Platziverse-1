'use strict';
const { MongoClient } = require('mongodb');
const chalk = require('chalk');
const { config2 } = require('../../../platziverse-utils/config');
const { username, password, host, port, dbname } = config2;
const MONGO_URI = `mongodb://${username}:${password}@${host}:${port}/test?replicaSet=Cluster0-shard-0&ssl=true&authSource=${dbname}`;;

module.exports = class MongoLib {
  constructor() {
    this.client = new MongoClient(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, });
  }
  connection() {
    console.log(MONGO_URI);
    return new Promise((res, rej) => {
      this.client.connect((err) => {
        if (err) {
          rej(err);
        }
        console.log('Connected to DB succesfuly');
        res(this.client.db('portfolio'));
      });
    });

  }
  getAll(collection, query) {
    return this.connection()
    .then((data) => data.collection(collection).find().toArray())
    .catch((err) => console.error(err));
  }
  async create(collection, data) {
    return this.connection()
    .then((data) => data.collection(collection).insertOne(data))
    .catch((err) => console.error(err));
  }
}