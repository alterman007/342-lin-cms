const util = require('util');
const bcrypt = require('bcryptjs');
const { Sequelize, Model } = require('sequelize');
const sequelize = require('../core/mysql');
const { bcryptSeedLength } = require('../config/secure');
const { authLevel } = require('../lib/enum');

const hash = util.promisify(bcrypt.hash);

class User extends Model {
  static async hashPassword(password) {
    const ps = await hash(password, bcryptSeedLength);
    return ps;
  }

  async validateUsername(username) {
    const user = await User.findOne({
      where: {
        username,
      },
    });
    if (user) {
      throw new Error('username has been used');
    }
  }

  static async verifyUserPassword(username, password) {
    const user = await User.findOne({
      where: {
        username,
      },
    });
    if (!user) {
      throw new Error('user not found');
    }
    const correct = await bcrypt.compare(password, user.password);
    if (!correct) {
      throw new Error('password incorrect');
    }
    return user;
  }

  static async getUserByOpenid(openid) {
    const user = await User.findOne({ where: { openid } });
    return user;
  }

  static async registerByOpenid(openid, username) {
    const user = await User.create({ openid, username });
    return user;
  }
}

User.init(
  {
    id: {
      // 主键 唯一
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: Sequelize.STRING(64),
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      // set(val) { },
    },
    scope: {
      type: Sequelize.INTEGER,
      defaultValue: authLevel.USER,
    },
    openid: Sequelize.STRING,
  },
  { sequelize },
);

module.exports = User;
