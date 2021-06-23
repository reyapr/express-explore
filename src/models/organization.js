const { DataTypes } = require('sequelize')
const sequelize = require('../config/postgresql');

const Organization = sequelize.define('Organization', {
  name: {
    type: DataTypes.TEXT,
    unique: true
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'organization'
})

Organization.sync();

module.exports = Organization;