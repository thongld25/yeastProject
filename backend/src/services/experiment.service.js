"use strict";

const { NotFoundError, BadRequestError } = require("../core/error.response");
const experimentModel = require("../models/experiment.model");
const UserService = require("./user.service");

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
    const experiments = await experimentModel.find({ factoryId: foundUser.factoryId }).lean();
    if (!experiments) throw new NotFoundError("Experiments not found");
    return experiments;
  };
  static findById = async (experimentId) => {
    const experiment = await experimentModel.findById(experimentId).lean();
    if (!experiment) throw new NotFoundError("Experiment not found");
    return experiment;
  };
}

module.exports = ExperimentService;
