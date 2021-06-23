const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.POSTGRES_CONNECTION);

module.exports = sequelize;