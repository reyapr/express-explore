const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const { isEmailValid, isPasswordValid } = require('../libraries/common');

const schema = new mongoose.Schema({
  role: {
    type: String,
    default: 'admin'
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    required: true,
    validate: [isEmailValid, 'Email is invalid']
  },
  password: {
    type: String,
    required: true,
    validate: [isPasswordValid, 'invalid password']
  }
},{
  timestamps: true
})

schema.pre('save', function preSave(next) {
  const hashedPassword = bcryptjs.hashSync(this.password, bcryptjs.genSaltSync(10));
  this.password = hashedPassword;
  next()
})

const Model = mongoose.model('user', schema);

module.exports = Model;