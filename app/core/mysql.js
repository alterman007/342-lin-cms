const Sequelize = require('sequelize');
const { mysqlConfig } = require('../config/db');

const { dbName, host, port, username, password } = mysqlConfig;

const sequelize = new Sequelize(dbName, username, password, {
  host,
  port,
  dialect: 'mariadb',
  logging: console.log,
  timezone: '+08:00',
  define: {
    timestamps: true, // 自动添加 createAt, updateAt
    paranoid: true,
  },
});

sequelize.sync({
  force: false, // waring: false
});

module.exports = sequelize;
