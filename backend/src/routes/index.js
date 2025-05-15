'use strict'

const express = require("express");
const { apiKey, permission } = require("../auth/checkAuth");
const router = express.Router();

//check apiKey
router.use(apiKey);

// check permission
router.use(permission('0000'))

router.use('/v1/api', require('./access'));
router.use('/v1/api/experiment', require('./experiment'));
router.use('/v1/api/factory', require('./factory'));
router.use('/v1/api/user', require('./user'));
router.use('/v1/api/measurement', require('./measurement'));
router.use('/v1/api/image', require('./image'));

module.exports = router;