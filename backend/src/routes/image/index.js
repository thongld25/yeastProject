"use strict";

const express = require("express");
const { asyncHandler } = require("../../auth/checkAuth");
const { authentication } = require("../../auth/authUtils");
const ImageController = require("../../controllers/image.controller");
const upload = require("../../configs/upload");
const router = express.Router();

// authentication
router.use(authentication);

router.post(
  "/add/:measurementId",
  upload.single("image"),
  asyncHandler(ImageController.addNormalImageByMeasurementId)
);
router.post(
  "/add/methylene/:measurementId",
  upload.single("image"),
  asyncHandler(ImageController.addMethyleneImageByMeasurementId)
);
router.post(
  "/add/counting/:measurementId",
  upload.single("image"),
  asyncHandler(ImageController.addCountingImageByMeasurementId)
);
router.get(
  "/:imageId",
  asyncHandler(ImageController.getImageById)
);
router.delete(
  "/delete/:imageId",
  asyncHandler(ImageController.deleteImageById)
);

module.exports = router;
