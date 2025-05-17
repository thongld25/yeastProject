"use strict";

const { SuccessResponse } = require("../core/success.response");
const ImageService = require("../services/image.service");

class ImageController {
  addNormalImageByMeasurementId = async (req, res, next) => {
    try {
      const { measurementId } = req.params;
      const {name} = req.body;
      const image = req.file;
      new SuccessResponse({
        message: "Add image success!",
        metadata: await ImageService.addNormalImage(measurementId, image, name),
      }).send(res);
    } catch (err) {
      next(err);
    }
  };

  addMethyleneImageByMeasurementId = async (req, res, next) => {
    try {
      const { measurementId } = req.params;
      const {name} = req.body;
      const image = req.file;
      new SuccessResponse({
        message: "Add image success!",
        metadata: await ImageService.addMethyleneImage(measurementId, image, name),
      }).send(res);
    } catch (err) {
      next(err);
    }
  }

  addCountingImageByMeasurementId = async (req, res, next) => {
    try {
      const { measurementId } = req.params;
      const {name} = req.body;
      const image = req.file;
      new SuccessResponse({
        message: "Add image success!",
        metadata: await ImageService.addCountingImage(measurementId, image, name),
      }).send(res);
    } catch (err) {
      next(err);
    }
  };

  getImageById = async (req, res, next) => {
    try {
      const { imageId } = req.params;
      new SuccessResponse({
        message: "Get image by id success!",
        metadata: await ImageService.getImageById(imageId),
      }).send(res);
    } catch (err) {
      next(err);
    }
  };

  deleteImageById = async (req, res, next) => {
    try {
      const { imageId } = req.params;
      new SuccessResponse({
        message: "Delete image by id success!",
        metadata: await ImageService.deleteImageById(imageId),
      }).send(res);
    } catch (err) {
      next(err);
    }
  }

}

module.exports = new ImageController();
