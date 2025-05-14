"use strict";

const { default: mongoose } = require("mongoose");
const { NotFoundError, BadRequestError } = require("../core/error.response");
const experimentModel = require("../models/experiment.model");
const UserService = require("./user.service");
const imageModel = require("../models/image.model");
const measurementModel = require("../models/measurement.model");

class ExperimentService {
  static createExperiment = async ({ title, description, userId, time }) => {
    const foundUser = await UserService.findById(userId);
    if (!foundUser) throw new NotFoundError("User not found");
    const newExperiment = await experimentModel.create({
      title,
      description,
      userId,
      factoryId: foundUser.factoryId,
      time: new Date(time),
    });
    if (!newExperiment) throw new BadRequestError("Error creating experiment");
    return newExperiment;
  };

  static findByUserId = async (userId) => {
    const foundUser = await UserService.findById(userId);
    if (!foundUser) throw new NotFoundError("User not found");
    const experiments = await experimentModel
      .find({ userId, factoryId: foundUser.factoryId })
      .lean();
    return experiments;
  };

  static findOfFactory = async (userId) => {
    const foundUser = await UserService.findById(userId);
    if (!foundUser) throw new NotFoundError("User not found");
    const experiments = await experimentModel
      .find({ factoryId: foundUser.factoryId })
      .lean();
    if (!experiments) throw new NotFoundError("Experiments not found");
    return experiments;
  };
  static findById = async (experimentId) => {
    const experiment = await experimentModel.findById(experimentId).lean();
    if (!experiment) throw new NotFoundError("Experiment not found");
    return experiment;
  };
  static deleteExperiment = async (experimentId) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const experiment = await experimentModel
        .findById(experimentId)
        .session(session);
      if (!experiment) throw new NotFoundError("Experiment not found");

      const measurements = await measurementModel
        .find({ experimentId: experiment._id })
        .session(session);
      const measurementIds = measurements.map((m) => m._id);

      await imageModel.deleteMany(
        { measurementId: { $in: measurementIds } },
        { session }
      );

      await measurementModel.deleteMany(
        { experimentId: experiment._id },
        { session }
      );

      const deletedExperiment = await experimentModel
        .findByIdAndDelete(experimentId)
        .session(session);

      if (!deletedExperiment)
        throw new BadRequestError("Error deleting experiment");

      await session.commitTransaction();
      return {
        message: "Experiment deleted successfully",
      };
    } catch (error) {
      await session.abortTransaction();
      console.error("❌ Error in deleteExperiment:", {
        message: error.message,
        stack: error.stack,
      });
      throw error;
    } finally {
      session.endSession();
    }
  };

  static updateExperiment = async (experimentId, data) => {
    const updatedExperiment = await experimentModel
      .findByIdAndUpdate(experimentId, data, { new: true })
      .lean();
    if (!updatedExperiment) throw new NotFoundError("Experiment not found");
    return updatedExperiment;
  };
}

module.exports = ExperimentService;
