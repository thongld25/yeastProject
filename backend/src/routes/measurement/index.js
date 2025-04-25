"use strict";

const express = require("express");
const { asyncHandler } = require("../../auth/checkAuth");
const { authentication } = require("../../auth/authUtils");
const MeasurementController = require("../../controllers/measurement.controller");
const upload = require("../../configs/upload");
const router = express.Router();

// authentication
router.use(authentication);

router.post(
  "/add",
  upload.array("images"),
  asyncHandler(MeasurementController.createMeasurement)
);
router.get(
  "/:experimentId",
  asyncHandler(MeasurementController.getMeasurementByExperimentId)
);
router.get(
  "/images/:measurementId",
  asyncHandler(MeasurementController.getImagesByMeasurementId)
);
router.get(
  "/image/:imageId",
  asyncHandler(MeasurementController.getImageById)
);
router.post(
  "/add/images",
  upload.array("images"),
  asyncHandler(MeasurementController.addImagesByMeasurementId)
);
router.delete(
  "/image/:imageId",
  asyncHandler(MeasurementController.deleteImageById)
);
module.exports = router;
