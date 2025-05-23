"use strict";

const { default: mongoose } = require("mongoose");
const { NotFoundError, BadRequestError } = require("../core/error.response");
const experimentModel = require("../models/experiment.model");
const UserService = require("./user.service");
const imageModel = require("../models/image.model");
const measurementModel = require("../models/measurement.model");
const userModel = require("../models/user.model");

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

  static findByUserIdPage = async (userId, { page = 1, limit = 10 }) => {
    const foundUser = await UserService.findById(userId);
    if (!foundUser) throw new NotFoundError("User not found");

    const skip = (page - 1) * limit;

    const [experiments, total] = await Promise.all([
      experimentModel
        .find({ userId })
        .skip(skip)
        .limit(limit)
        .sort({ time: 1 })
        .lean(),
      experimentModel.countDocuments({ userId }),
    ]);

    return {
      experiments,
      total,
      page,
      limit,
    };
  };

  static findByUserId = async (userId) => {
    const foundUser = await UserService.findById(userId);
    if (!foundUser) throw new NotFoundError("User not found");
    const experiments = await experimentModel
      .find({ userId })
      .sort({ time: 1 })
      .lean();
    if (!experiments) throw new NotFoundError("Experiments not found");
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

  static searchExperiments = async ({
    userId,
    title,
    startTime,
    endTime,
    page = 1,
    limit = 10,
  }) => {
    const foundUser = await userModel.findById(userId);
    if (!foundUser) throw new NotFoundError("User not found");

    const query = {
      userId,
    };
    const escapeRegex = (text) => {
      return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    };
    if (title && title.trim()) {
      const safeTitle = escapeRegex(title.trim());
      query.title = { $regex: safeTitle, $options: "i" };
    }

    if ((startTime && startTime.trim()) || (endTime && endTime.trim())) {
      query.time = {};
      if (startTime && startTime.trim()) {
        const start = new Date(startTime);
        if (!isNaN(start)) query.time.$gte = start;
      }
      if (endTime && endTime.trim()) {
        const end = new Date(endTime);
        if (!isNaN(end)) query.time.$lte = end;
      }
    }

    const skip = (page - 1) * limit;
    console.log("▶ Final Mongo Query:", JSON.stringify(query, null, 2));
    console.log("⏰ start:", startTime, "→", new Date(startTime));
    console.log("⏰ end:", endTime, "→", new Date(endTime));

    const [experiments, total] = await Promise.all([
      experimentModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .sort({ time: 1 })
        .lean(),
      experimentModel.countDocuments(query),
    ]);
    return {
      experiments,
      total,
      page,
      limit,
    };
  };

  static getExperimentInFactoryOfManager = async (
    userId,
    { page = 1, limit = 10 }
  ) => {
    if (!userId) throw new NotFoundError("User not found");
    const foundUser = await UserService.findById(userId);
    if (!foundUser) throw new NotFoundError("User not found");
    const skip = (page - 1) * limit;
    const users = await userModel.find({
      factoryId: foundUser.factoryId,
      role: "employee",
    });
    const userIds = users.map((user) => user._id);
    const [experiments, total] = await Promise.all([
      experimentModel
        .find({ userId: { $in: userIds } })
        .skip(skip)
        .limit(limit)
        .sort({ time: 1 })
        .populate("userId", "name email role")
        .lean(),
      experimentModel.countDocuments({ userId: { $in: userIds } }),
    ]);
    if (!experiments) throw new NotFoundError("Experiments not found");
    return {
      experiments,
      total,
      page,
      limit,
    };
  };

  static searchExperimentsInFactoryOfManager = async ({
    userId,
    creatorName,
    title,
    startTime,
    endTime,
    page = 1,
    limit = 10,
  }) => {
    const foundUser = await userModel.findById(userId);
    if (!foundUser) throw new NotFoundError("User not found");

    // Lấy danh sách user trong cùng nhà máy
    const userQuery = { factoryId: foundUser.factoryId };
    if (creatorName && creatorName.trim()) {
      const safeName = creatorName
        .trim()
        .replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
      userQuery.name = { $regex: safeName, $options: "i" };
    }

    const usersInFactory = await userModel.find(userQuery).select("_id").lean();
    const userIds = usersInFactory.map((u) => u._id);

    // Tạo query tìm thí nghiệm
    const query = {
      userId: { $in: userIds },
    };

    if (title && title.trim()) {
      const safeTitle = title
        .trim()
        .replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
      query.title = { $regex: safeTitle, $options: "i" };
    }

    if ((startTime && startTime.trim()) || (endTime && endTime.trim())) {
      query.time = {};
      if (startTime && startTime.trim()) {
        const start = new Date(startTime);
        if (!isNaN(start)) query.time.$gte = start;
      }
      if (endTime && endTime.trim()) {
        const end = new Date(endTime);
        if (!isNaN(end)) query.time.$lte = end;
      }
    }

    const skip = (page - 1) * limit;

    const [experiments, total] = await Promise.all([
      experimentModel
        .find(query)
        .populate("userId", "name") // Để lấy tên người tạo
        .skip(skip)
        .limit(limit)
        .sort({ time: 1 })
        .lean(),
      experimentModel.countDocuments(query),
    ]);

    return {
      experiments,
      total,
      page,
      limit,
    };
  };
}

module.exports = ExperimentService;
