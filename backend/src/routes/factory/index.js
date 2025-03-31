"use strict";

const express = require("express");
const FactoryController = require("../../controllers/factory.controller");
const { asyncHandler } = require("../../auth/checkAuth");
const { authentication } = require("../../auth/authUtils");
const { get } = require("lodash");
const router = express.Router();

// authentication
router.use(authentication);

router.post("/add", asyncHandler(FactoryController.createFactory));
router.get("/all", asyncHandler(FactoryController.getAllFactory));

module.exports = router;
