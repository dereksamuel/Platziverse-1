'use strict';

const MongoLib = require('../mongo/index');

module.exports = class UserService {
  constructor() {
    this.collection = 'users';
    this.db = new MongoLib();
  }
  async getUser({ email }) {
    const [ user ] = await this.db.getAll(this.collection, { email });
    return user;
  }
  async createUser({ user }) {
    const { name, email, password } = user;

    const createUserId = await this.db.create(this.collection, {
      name, email, password
    });

    return createUserId;
  }
  async getUserOrCreate({ user }) {
    const requestUser = await this.getUser({ email: user.email });

    if (requestUser) return requestUser;

    await this.createUser({ user });
    return await this.getUser({ email: user.email });
  }
}