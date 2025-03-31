"use strict";

const { NotFoundError, BadRequestError } = require("../core/error.response");
const experimentModel = require("../models/experiment.model");
const UserService = require("./user.service");

class ExperimentService {
  static createExperiment = async ({ title, description, userId }) => {
    const foundUser = await UserService.findById(userId);
    if (!foundUser) throw new NotFoundError("User not found");
    const newExperiment = await experimentModel.create({
      title,
      description,
      userId,
      factoryId: foundUser.factoryId,
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
}

module.exports = ExperimentService;
