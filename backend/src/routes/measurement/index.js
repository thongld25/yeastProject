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
  upload.array("images", 10),
  asyncHandler(MeasurementController.createMeasurement)
);
router.get(
  "/experiment/:experimentId",
  asyncHandler(MeasurementController.getMeasurementByExperimentId)
);
router.get(
  "/images/:measurementId",
  asyncHandler(MeasurementController.getImagesByMeasurementId)
);
router.get("/image/:imageId", asyncHandler(MeasurementController.getImageById));
router.post(
  "/add/images",
  upload.array("images", 10),
  asyncHandler(MeasurementController.addImagesByMeasurementId)
);
router.delete(
  "/image/:imageId",
  asyncHandler(MeasurementController.deleteImageById)
);
router.post(
  "/createv2",
  upload.array("images", 10),
  asyncHandler(MeasurementController.createMeasurementv2)
);
router.get(
  "/job-status/:jobId",
  asyncHandler(MeasurementController.getJobStatus)
);
router.delete(
  "/delete/:measurementId",
  asyncHandler(MeasurementController.deleteMeasurement)
);
router.put(
  "/update/:measurementId",
  asyncHandler(MeasurementController.updateMeasurement)
);
router.get(
  "/:measurementId",
  asyncHandler(MeasurementController.getMeasurementById)
);
module.exports = router;
