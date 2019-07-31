const { Sequelize, Model } = require('sequelize');
const sequelize = require('../core/mysql');

const classicFields = {
  image: Sequelize.STRING,
  content: Sequelize.STRING,
  pubDate: Sequelize.DATEONLY,
  favNum: Sequelize.INTEGER,
  title: Sequelize.STRING,
  type: Sequelize.TINYINT,
};

class Movie extends Model {}
Movie.init({ ...classicFields }, { sequelize });

class Sentence extends Model {}
Sentence.init({ ...classicFields }, { sequelize });

class Music extends Model {}
Music.init(
  {
    ...classicFields,
    url: Sequelize.STRING,
  },
  { sequelize },
);

module.exports = {
  Movie,
  Sentence,
  Music,
};
