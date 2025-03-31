"use strict";

const express = require("express");
const experimentController = require("../../controllers/experiment.controller");
const { asyncHandler } = require("../../auth/checkAuth");
const { authentication } = require("../../auth/authUtils");
const { get } = require("lodash");
const router = express.Router();

// authentication
router.use(authentication);

router.post("/add", asyncHandler(experimentController.createExperiment));
router.get(
  "/employee",
  asyncHandler(experimentController.getExperimentByUserId)
);
router.get(
  "/factory",
  asyncHandler(experimentController.getExperimentOfFactory)
);

module.exports = router;
