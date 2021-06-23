const express = require('express');
const { create, getByName, deleteByName } = require('../controller/organization/index');
const router = express.Router();
const authentication = require('../middlewares/authentication');
const { CREATE, FIND_BY_NAME, DELETE_BY_NAME } = require('./constant/organizationPath');

router.post(CREATE, authentication, create);

router.get(FIND_BY_NAME, authentication, getByName);

router.delete(DELETE_BY_NAME, authentication, deleteByName);

module.exports = router;