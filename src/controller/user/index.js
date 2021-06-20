const { isEmailValid, isPasswordValid } = require('../../libraries/common')
const User = require('../../models/user');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const { BusinessLogicException } = require('../../libraries/exception');

const maxAge = 300;

const validateEmailPassword = ({ email, password }, next) => {
  let isValid = true;
  if (!isEmailValid(email)) {
    isValid = false
    next(new BusinessLogicException({
      status: 400,
      message: 'Please fill a valid email address'
    }));
  }

  if (!isPasswordValid(password)) {
    isValid = false;
    next(new BusinessLogicException({
      status: 400,
      message: 'Your password minimum eight characters, at least one letter and one number'
    }));
  }
  return isValid;
}

const getUserDataResponse = ({ id, email, role }) => ({ id, email, role })

const getToken = ({ id, email, role }) => jwt.sign(
  { id, email, role }, process.env.USER_SECRET, { expiresIn: '1h' })

const getUserResponse = ({ message, data = null }) => ({ message, data })

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

module.exports = {
  signUp: (req, res, next) => {
    const isEmailPasswordValid = validateEmailPassword(req.body, next);

    if (isEmailPasswordValid) {
      const newUser = { ...req.body };

      User.create(newUser)
        .then(user => {
          res.cookie('token', getToken(user), { httpOnly: true, maxAge: maxAge * 1000 })
          res
            .status(200)
            .json(getUserResponse({
              message: 'Success to Create Account!',
              data: getUserDataResponse(user)
            }))
        })
        .catch(err => next(err))
    }
  },
  signIn: (req, res, next) => {
    const { email, password } = req.body;

    User.findOne({ email })
      .then(user => {
        if (user) {
          return comparePasswordAndUpdate(user, password)
        }

        throw new BusinessLogicException({
          status: 400,
          message: 'User Not Found'
        })
      })
      .then(user => {
        res.cookie('token', getToken(user), { httpOnly: true, maxAge: maxAge * 1000 })
        res.status(200).json({
          message: 'Success login',
          data: getUserDataResponse(user)
        })
      })
      .catch(err => next(err))
  },
  signOut: (req, res, next) => {
    const { token } = req.cookies;

    const user = jwt.decode(token);

    User.findOne({ email: user.email })
      .then(user => {
        if (user) {
          res.cookie('token', '', { maxAge: 1 })
          res.redirect('/')
        }
        throw new BusinessLogicException({
          status: 400,
          message: 'Email is invalid'
        })
      })
      .catch(err => next(err))
  }
}

