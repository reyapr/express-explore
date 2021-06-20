const { isEmailValid, isPasswordValid  } = require('../../helpers/common')
const User = require('../../models/user');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');

const maxAge = 300;

const validateEmailPassword = ({email, password}, res) => {
  let isValid = true;
  if (!isEmailValid(email)) {
    isValid = false
    res.status(400).json({
      message: 'Please fill a valid email address',
    });
  }

  if (!isPasswordValid(password)) {
    isValid = false;
    res.status(400).json({
      message: 'Your password minimum eight characters, at least one letter and one number',
    });
  }
  return isValid;
}

const getUserDataResponse = ({ id, email, role }) => ({ id, email, role })

const getToken = ({id, email, role}) => jwt.sign(
  {id, email, role}, process.env.USER_SECRET, { expiresIn: '1h' })

const getUserResponse = ({ message, data = null}) => ({message, data})
  
module.exports = {
  signUp: (req, res) => {
    const isEmailPasswordValid = validateEmailPassword(req.body, res);
    if(!isEmailPasswordValid) {
      return;
    }
    const newUser = {...req.body};
    
    User.create(newUser)
      .then(user => {
        res.cookie('token', getToken(user), {httpOnly: true, maxAge: maxAge * 1000})
        res
          .status(200)
          .json(getUserResponse({
            message: 'Success to Create Account!',
            data: getUserDataResponse(user)
          }))
      })
      .catch(err => {
        console.log(`failed to save user: ${newUser}`, err);
        res
          .status(400)
          .json(getUserResponse({
            message: 'Failed to create account',
          }))
        
      })
  },
  signIn: (req, res) => {
    const { email, password } = req.body;
    
    User.findOne({email, isLogin: false})
      .then(user => {
        const isPasswordMatch = bcryptjs.compareSync(password, user.password);
        if(isPasswordMatch) {
          return User.updateOne({_id: user._id}, {
            isLogin: true
          })
          .then(_ => user)
        }
        res.status(400).json(getUserResponse({
          message: 'Wrong password'
        }))
      })
      .then(user => {
        res.cookie('token', getToken(user), {httpOnly: true, maxAge: maxAge * 1000})
        res.status(200).json({
          message: 'Success login',
          data: getUserDataResponse(user)
        })
      })
      .catch(err => {
        console.log(`failed to get email: ${email}`, err)
        res.status(400).json(getUserResponse({
          message: 'Email is Invalid'
        }))
      })
  },
  signOut: (req, res) => {
    const { token } = req.cookies;
    
    const user = jwt.decode(token);
    
    User.findOne({ email: user.email })
      .then(user => {
        res.cookie('token', '', {maxAge: 1})
        res.redirect('/')
      })
      .catch(err => {
        console.log(`failed to get email: ${email}`, err)
        res.status(400).json(getUserResponse({
          message: 'Email is Invalid'
        }))
      })
  }
}

