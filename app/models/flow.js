const { Sequelize, Model } = require('sequelize');
const sequelize = require('../core/mysql');

class Flow extends Model {}

Flow.init(
  {
    index: Sequelize.INTEGER,
    artID: Sequelize.INTEGER,
    type: Sequelize.INTEGER,
  },
  { sequelize },
);
