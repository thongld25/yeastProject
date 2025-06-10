"use strict";

const { NotFoundError, BadRequestError } = require("../core/error.response");
const factoryModel = require("../models/factory.model");
const userModel = require("../models/user.model");
const experimentModel = require("../models/experiment.model");
const measurementModel = require("../models/measurement.model");
const imageModel = require("../models/image.model");

class StatisticsService {
  static async getStatisticsOfMeasurement(measurementId) {
    if (!measurementId) throw new BadRequestError("Measurement ID is required");

    const measurement = await measurementModel.findById(measurementId);
    if (!measurement) throw new NotFoundError("Measurement not found");

    const experiment = await experimentModel.findById(measurement.experimentId);
    if (!experiment) throw new NotFoundError("Experiment not found");

    const user = await userModel.findById(experiment.userId);
    if (!user) throw new NotFoundError("User not found");

    const images = await imageModel.find({ measurementId }).lean();
    if (!images || images.length === 0)
      throw new NotFoundError("Images not found");

    const statsByImage = images.map((img, idx) => {
      const stats = {
        Normal: 0,
        Abnormal: 0,
        alive: 0,
        dead: 0,
      };
      img.bacteriaData?.forEach((cell) => {
        if (cell.type && stats.hasOwnProperty(cell.type)) {
          stats[cell.type]++;
        }
      });
      return {
        name: img.name || `Hình ảnh ${idx + 1}`,
        ...stats,
      };
    });

    return {
      name: user.name,
      email: user.email,
      time: measurement.time,
      statictis: statsByImage,
      measurementName: measurement.name,
      imageType: measurement.imageType,
      experimentName: experiment.title,
    };
  }

  static async getStatisticsOfExperiment(experimentId) {
    if (!experimentId) throw new BadRequestError("Experiment ID is required");

    const experiment = await experimentModel.findById(experimentId);
    if (!experiment) throw new NotFoundError("Experiment not found");

    const user = await userModel.findById(experiment.userId);
    if (!user) throw new NotFoundError("User not found");

    const measurements = await measurementModel.find({ experimentId }).lean();
    const allImages = await imageModel
      .find({
        measurementId: { $in: measurements.map((m) => m._id) },
      })
      .lean();

    const statsByMeasurement = measurements.map((m, idx) => {
      const stats = {
        Normal: 0,
        Abnormal: 0,
        alive: 0,
        dead: 0,
      };
      const relatedImages = allImages.filter((img) =>
        img.measurementId.equals(m._id)
      );
      relatedImages.forEach((img) => {
        img.bacteriaData?.forEach((cell) => {
          if (cell.type && stats.hasOwnProperty(cell.type)) {
            stats[cell.type]++;
          }
        });
      });
      return {
        name: m.name || `Lần đo ${idx + 1}`,
        ...stats,
      };
    });

    return {
      email: user.email,
      name: user.name,
      experimentName: experiment.title,
      statictis: statsByMeasurement,
      time: experiment.time,
    };
  }
}

module.exports = StatisticsService;
