'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
  }
  Book.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: `Please provide a "Title"`
        }
      }
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: `Please provide an "Author"`
        }
      }
    },
    genre: DataTypes.STRING,
    year: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Book',
  });
  return Book;
};