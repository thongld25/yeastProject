"use strict";

const MeasurementService = require("../services/measurement.service");
const { SuccessResponse } = require("../core/success.response");

class MeasurementController {
  createMeasurement = async (req, res, next) => {
    const { name, experimentId, time, imageType, lensType } = req.body;
    const images = req.files;
    new SuccessResponse({
      message: "Create user success!",
      metadata: await MeasurementService.createMeasurement(name, experimentId, images, time, imageType, lensType),  
    }).send(res);
  };

  getMeasurementByExperimentId = async (req, res, next) => {
    new SuccessResponse({
      message: "Get measurement by experimentId success!",
      metadata: await MeasurementService.getMeasurementByExperimentId(req.params.experimentId),
    }).send(res);
  };

  getImagesByMeasurementId = async (req, res, next) => {
    new SuccessResponse({
      message: "Get images by measurementId success!",
      metadata: await MeasurementService.getImagesByMeasurementId(req.params.measurementId),
    }).send(res);
  };

  getImageById = async (req, res, next) => {
    new SuccessResponse({
      message: "Get image by id success!",
      metadata: await MeasurementService.getImageById(req.params.imageId),
    }).send(res);
  }

  addImagesByMeasurementId = async (req, res, next) => {
    const { measurementId, imageType, lensType } = req.body;
    const images = req.files;
    new SuccessResponse({
      message: "Create user success!",
      metadata: await MeasurementService.addImage(measurementId, images, imageType, lensType),  
    }).send(res);
  }

  deleteImageById = async (req, res, next) => {
    new SuccessResponse({
      message: "Delete image by id success!",
      metadata: await MeasurementService.deleteImageById(req.params.imageId),
    }).send(res);
  }
}

module.exports = new MeasurementController();
