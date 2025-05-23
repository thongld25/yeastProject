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
  asyncHandler(experimentController.getExperimentByUserIdPage)
);
router.get("/manager", asyncHandler(experimentController.getExperimentInFactoryOfManager));
router.get("/manager/search", asyncHandler(experimentController.searchExperimentsInFactoryOfManager));
router.get("/manager/user/:userId", asyncHandler(experimentController.getExperimentByUserId));
router.get(
  "/user/all",
  asyncHandler(experimentController.getExperimentOfUser)
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
  "/search",
  asyncHandler(experimentController.searchExperimentOfEmployee)
);
router.get(
  "/experiment/:experimentId",
  asyncHandler(experimentController.getExperimentById)
);

module.exports = router;
