
const userService = require('../../service/user/index');
const jwt = require('jsonwebtoken');

const maxAge = 300;
const getUserDataResponse = ({ id, email, role }) => ({ id, email, role })

const getToken = ({ id, email, role }) => jwt.sign(
  { id, email, role }, process.env.USER_SECRET, { expiresIn: '1h' })

const getUserResponse = ({ message, data = null }) => ({ message, data })

module.exports = {
  signUp: (req, res, next) => {
      userService.signUp(req.body)
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
  },
  signIn: (req, res, next) => {
    userService.signIn(req.body)
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

    userService.signOut(token)
      .then(() => {
        res.cookie('token', '', { maxAge: 1 })
        res.redirect('/')
      })
      .catch(err => next(err))
  }
}

