"use strict";

const express = require("express");
const { asyncHandler } = require("../../auth/checkAuth");
const { authentication } = require("../../auth/authUtils");
const StatictisController = require("../../controllers/statictis.controller");
const upload = require("../../configs/upload");
const router = express.Router();

// authentication
router.use(authentication);
router.get(
  "/measurement/:measurementId",
  asyncHandler(StatictisController.getStatisticsOfMeasurement)
);
router.get(
  "/experiment/:experimentId",
  asyncHandler(StatictisController.getStatisticsOfExperiment)
);
module.exports = router;
