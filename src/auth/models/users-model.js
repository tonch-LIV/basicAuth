'use strict';

const bcrypt = require('bcrypt');

function usersModel(sequelize, DataTypes) {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,  // prevents duplicate accounts 
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  // copies fields for response; removes password from copy
  User.prototype.toJSON = function () {
    const user = { ...this.get({ plain: true }) };
    delete user.password;
    return user;
  };

  // replaces plain-text with bcrypt hash before Sequelize inserts record
  User.beforeCreate(async (user) => {
    user.password = await bcrypt.hash(user.password, 10);
  });

  // find `User` login cred, compare submitted password, and returns user if and when valid.
  User.authenticateBasic = async function (username, password) {
    const user = await this.findOne({
      where: { username },
    });

    if (!user) {
      throw new Error('Invalid Login');
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      throw new Error('Invalid Login');
    }

    return user;
  };

  return User;
}

module.exports = usersModel;