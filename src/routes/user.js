var express = require('express');
const { signIn, signUp, signOut } = require('../controller/user');
const authentication = require('../middlewares/authentication');
var router = express.Router();

router.post('/signUp', signUp);

router.post('/signIn', signIn);

router.post('/signOut', authentication, signOut);

router.get('/users', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
