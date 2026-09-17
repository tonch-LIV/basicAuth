'use strict';

const { Sequelize, DataTypes } = require('sequelize');
const usersModel = require('./users-model.js');

const sequelize = process.env.NODE_ENV === 'test'
  ? new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
  })
  : new Sequelize(process.env.DATABASE_URL, {
    logging: false,
  });
   
const users = usersModel(sequelize, DataTypes);

module.exports = {
  db: sequelize,
  users,
};