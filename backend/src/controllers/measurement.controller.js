"use strict";

const MeasurementService = require("../services/measurement.service");
const { SuccessResponse } = require("../core/success.response");

class MeasurementController {
  createMeasurement = async (req, res, next) => {
    const { name, experimentId, time } = req.body;
    const images = req.files;
    new SuccessResponse({
      message: "Create user success!",
      metadata: await MeasurementService.createMeasurement(name, experimentId, images, time),  
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

}

module.exports = new MeasurementController();
