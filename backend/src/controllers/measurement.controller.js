"use strict";

const MeasurementService = require("../services/measurement.service");
const { SuccessResponse } = require("../core/success.response");
const imageProcessingQueue = require('../queue');

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
  createMeasurementv2 = async (req, res, next) => {
    const { name, experimentId, time, imageType, lensType } = req.body;
    const images = req.files;
    new SuccessResponse({
      message: "Create user success!",
      metadata: await MeasurementService.createMeasurementv2(name, experimentId, images, time, imageType, lensType),  
    }).send(res);
  };
  getJobStatus = async (req, res) => {
    try {
      const jobId = req.params.jobId;
      if (!jobId) {
      return res.status(400).json({ message: 'Job ID is required' });
      }

      const job = await imageProcessingQueue.getJob(jobId);
      if (!job) {
      return res.status(404).json({ message: 'Job not found' });
      }

      const status = await job.getState();
      const progress = await job.progress();
      const result = {
      status,
      progress,
      returnValue: job.returnvalue,
      failedReason: job.failedReason
      };

      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ 
      message: 'Error fetching job status',
      error: error.message
      });
    }
  };

  deleteMeasurement = async (req, res, next) => {
    new SuccessResponse({
      message: "Delete measurement success!",
      metadata: await MeasurementService.deleteMeasurementById(req.params.measurementId),
    }).send(res); 
  };

  updateMeasurement = async (req, res, next) => {
    const { measurementId } = req.params;
    const { name, time} = req.body;
    new SuccessResponse({
      message: "Update measurement success!",
      metadata: await MeasurementService.updateMeasurement(measurementId, { name, time}),
    }).send(res);
  };
  
  getMeasurementById = async (req, res, next) => {
    const { measurementId } = req.params;
    new SuccessResponse({
      message: "Get measurement by id success!",
      metadata: await MeasurementService.getMeasurementById(measurementId),
    }).send(res);
  };
}

module.exports = new MeasurementController();
