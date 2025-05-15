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
router.delete(
  "/delete/:experimentId",
  asyncHandler(experimentController.deleteExperiment)
);
router.put(
  "/update/:experimentId",
  asyncHandler(experimentController.updateExperiment)
);
router.get(
  "/:experimentId",
  asyncHandler(experimentController.getExperimentById)
);

module.exports = router;
