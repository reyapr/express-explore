const User = require('../../models/user');
const bcryptjs = require('bcryptjs');
const { BusinessLogicException } = require('../../libraries/exception');
const jwt = require('jsonwebtoken');
const { isEmailValid, isPasswordValid } = require('../../libraries/common')


const validateEmailPassword = ({ email, password }) => {
  return new Promise((resolve, reject) => {
    if (!isEmailValid(email)) {
      reject(new BusinessLogicException({
        status: 400,
        message: 'Please fill a valid email address'
      }))
    }

    if (!isPasswordValid(password)) {
      reject(new BusinessLogicException({
        status: 400,
        message: 'Your password minimum eight characters, at least one letter and one number'
      }))
    }
    resolve(true);
  })
}

const comparePasswordAndUpdate = (user, password) => {
  return bcryptjs.compare(password, user.password)
    .then(isPasswordMatch => {
      if (isPasswordMatch) {
        return User.updateOne({ _id: user._id })
      }
      throw new BusinessLogicException({
        status: 400,
        message: 'Wrong Password'
      })
    })
    .then(_ => user)
}

const userService = {
  signUp: userRequest => {
    return validateEmailPassword(userRequest)
      .then(() => User.create(userRequest))
  },
  signIn: userRequest => {
    const { email, password } = userRequest;
    return User.findOne({ email })
      .then(user => {
        if (user) {
          return comparePasswordAndUpdate(user, password)
        }

        throw new BusinessLogicException({
          status: 400,
          message: 'User Not Found'
        })
      })
  },
  signOut: token => {
    const user = jwt.decode(token);
    return User.findOne({ email: user.email })
      .then(user => {
        if(!user) {
          throw new BusinessLogicException({
            status: 400,
            message: 'Email is invalid'
          });
        }
        return user;
      })
  }
}

module.exports = userService;