"use strict";

const { NotFoundError, BadRequestError } = require("../core/error.response");
const measurementModel = require("../models/measurement.model");
const ExperimentService = require("./experiment.service");
const experimentModel = require("../models/experiment.model");
const imageModel = require("../models/image.model");
const cellData = require("../data/mockData.js").cellData;
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");
const imageProcessingQueue = require("../queue");

class MeasurementService {
  static async createMeasurement(name, experimentId, time) {
    if (!name || !experimentId || !time) {
      throw new BadRequestError("Missing required fields");
    }
    const experiment = await experimentModel.findById(experimentId);
    if (!experiment) {
      throw new NotFoundError("Experiment not found");
    }
    const newMeasurement = await measurementModel.create({
      name,
      experimentId,
      time: new Date(time),
    });
    if (!newMeasurement) {
      throw new BadRequestError("Measurement creation failed");
    }
    return newMeasurement;
  }

  static async getMeasurementByExperimentId(experimentId) {
    if (!experimentId) {
      throw new BadRequestError("Missing required fields");
    }
    const measurements = await measurementModel.find({
      experimentId,
    });
    if (!measurements) {
      throw new NotFoundError("Measurement not found");
    }
    return measurements;
  }

  static async getImagesByMeasurementId(measurementId) {
    if (!measurementId) {
      throw new BadRequestError("Missing required fields");
    }
    const images = await imageModel.find({ measurementId }).lean();
    if (!images) {
      throw new NotFoundError("Images not found");
    }
    return images;
  }
  static async getImageById(imageId) {
    if (!imageId) {
      throw new BadRequestError("Missing required fields");
    }
    const image = await imageModel.findById(imageId).lean();
    if (!image) {
      throw new NotFoundError("Image not found");
    }
    return image;
  }
  static async deleteImageById(imageId) {
    if (!imageId) {
      throw new BadRequestError("Missing required fields");
    }

    const image = await imageModel.findById(imageId);
    if (!image) {
      throw new NotFoundError("Image not found");
    }

    // Nếu ảnh này có measurementId thì mới tìm và xóa khỏi mảng images
    if (image.measurementId) {
      const measurement = await measurementModel.findById(image.measurementId);
      if (measurement) {
        const index = measurement.images.indexOf(imageId);
        if (index > -1) {
          measurement.images.splice(index, 1);
          await measurement.save();
        }
      }
    }

    await imageModel.findByIdAndDelete(imageId);
    return "Image deleted successfully";
  }
  static async deleteMeasurementById(measurementId) {
    if (!measurementId) {
      throw new BadRequestError("Missing required fields");
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const measurement = await measurementModel
        .findById(measurementId)
        .session(session);
      if (!measurement) {
        throw new NotFoundError("Measurement not found");
      }

      // Xoá ảnh liên quan đến measurement
      await imageModel.deleteMany({ measurementId }, { session });

      // Xoá measurement
      await measurementModel.findByIdAndDelete(measurementId).session(session);

      await session.commitTransaction();
      return "Measurement deleted successfully";
    } catch (error) {
      await session.abortTransaction();
      console.error("❌ Error in deleteMeasurementById:", {
        message: error.message,
        stack: error.stack,
      });
      throw error;
    } finally {
      session.endSession();
    }
  }
  static async updateMeasurement(measurementId, data) {
    if (!measurementId || !data) {
      throw new BadRequestError("Missing required fields");
    }
    const updatedMeasurement = await measurementModel
      .findByIdAndUpdate(measurementId, data, { new: true })
      .lean();
    if (!updatedMeasurement) {
      throw new NotFoundError("Measurement not found");
    }
    return updatedMeasurement;
  }

  static async getMeasurementById(measurementId) {
    if (!measurementId) {
      throw new BadRequestError("Missing required fields");
    }
    const measurement = await measurementModel
      .findById(measurementId)
      .populate("experimentId")
      .lean();
    if (!measurement) {
      throw new NotFoundError("Measurement not found");
    }
    return measurement;
  }
}
module.exports = MeasurementService;
