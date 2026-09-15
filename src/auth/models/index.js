'use strict';

const { Sequelize, DataTypes } = require('sequelize');
const usersModel = require('./users-model.js');

const connectionString = 
  process.env.NODE_ENV === 'test'
    ? 'sqlite::memory:'
    : process.env.DATABASE_URL;

  // 
const sequelize = new Sequelize(connectionString, {
  logging: false,
});

// 
const users = usersModel(sequelize, DataTypes);

module.exports = {
  db: sequelize,
  users,
};