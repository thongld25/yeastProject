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
  asyncHandler(ImageController.addImageByMeasurementId)
);
router.get(
  "/search",
  asyncHandler(ImageController.searchImagesOfUser)
);
router.get("/manager/search", asyncHandler(ImageController.searchImagesInFactoryOfManager));
router.get(
  "/manager/all",
  asyncHandler(ImageController.getImagesInFactoryOfManager)
);
router.get("/user", asyncHandler(ImageController.getImagesByUserId));

router.get("/image/:imageId", asyncHandler(ImageController.getImageById));
router.delete(
  "/delete/:imageId",
  asyncHandler(ImageController.deleteImageById)
);
router.put(
  "/update/typeBacteria/:imageId",
  asyncHandler(ImageController.editTypeBacteria)
);
router.put(
  "/update/report/:imageId",
  asyncHandler(ImageController.reportBacteria)
);
router.put(
  "/update/boxBacteria/:imageId",
  asyncHandler(ImageController.updateInfoBacteria)
);

module.exports = router;
