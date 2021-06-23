var express = require('express');
const { signIn, signUp, signOut } = require('../controller/user');
const authentication = require('../middlewares/authentication');
const { SIGN_UP, SIGN_IN, SIGN_OUT } = require('./constant/userPath');
var router = express.Router();

router.post(SIGN_UP, signUp);

router.post(SIGN_IN, signIn);

router.post(SIGN_OUT, authentication, signOut);

module.exports = router;
