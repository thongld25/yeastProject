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
const userModel = require("../models/user.model.js");

class MeasurementService {
  static async createMeasurement(
    name,
    experimentId,
    time,
    imageType,
    lensType
  ) {
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
      imageType,
      lensType,
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

  static async getMeasurementOfUser(userId, { page = 1, limit = 10 }) {
    if (!userId) {
      throw new BadRequestError("Missing required fields");
    }
    const foundUser = await userModel.findById(userId);
    if (!foundUser) {
      throw new NotFoundError("User not found");
    }
    const experiment = await experimentModel
      .find({ userId: userId })
      .select("_id")
      .lean();
    if (!experiment) {
      throw new NotFoundError("Experiment not found");
    }
    const experimentIds = experiment.map((e) => e._id);
    const skip = (page - 1) * limit;
    const [measurements, total] = await Promise.all([
      measurementModel
        .find({ experimentId: { $in: experimentIds } })
        .skip(skip)
        .limit(limit)
        .populate("experimentId")
        .lean(),
      measurementModel
        .countDocuments({ experimentId: { $in: experimentIds } })
        .lean(),
    ]);
    if (!measurements) {
      throw new NotFoundError("Measurements not found");
    }
    return {
      measurements,
      total,
      page,
      limit,
    };
  }

  static async searchMeasurements({
    userId,
    name,
    startTime,
    endTime,
    page = 1,
    limit = 10,
  }) {
    if (!userId) {
      throw new BadRequestError("Missing required fields");
    }
    const foundUser = await userModel.findById(userId);
    if (!foundUser) {
      throw new NotFoundError("User not found");
    }
    const experiment = await experimentModel
      .find({ userId: userId })
      .select("_id")
      .lean();
    if (!experiment) {
      throw new NotFoundError("Experiment not found");
    }
    const experimentIds = experiment.map((e) => e._id);
    const query = {
      experimentId: { $in: experimentIds },
    };
    const escapeRegex = (text) => {
      return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    };
    if (name && name.trim()) {
      const safeName = escapeRegex(name.trim());
      query.name = { $regex: safeName, $options: "i" };
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
    const [measurements, total] = await Promise.all([
      measurementModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .populate("experimentId")
        .lean(),
      measurementModel.countDocuments(query),
    ]);
    return {
      measurements,
      total,
      page,
      limit,
    };
  }

  static async getMeasurementInFactoryOfManager(
    userId,
    { page = 1, limit = 10 }
  ) {
    if (!userId) {
      throw new BadRequestError("Missing required fields");
    }
    const foundUser = await userModel.findById(userId);
    if (!foundUser) {
      throw new NotFoundError("User not found");
    }
    const users = await userModel
      .find({ factoryId: foundUser.factoryId, role: "employee" })
      .select("_id")
      .lean();
    if (!users) {
      throw new NotFoundError("Users not found");
    }
    const userIds = users.map((u) => u._id);
    const experiments = await experimentModel
      .find({ userId: { $in: userIds } })
      .select("_id")
      .lean();
    if (!experiments) {
      throw new NotFoundError("Experiments not found");
    }
    const experimentIds = experiments.map((e) => e._id);
    const skip = (page - 1) * limit;
    const [measurements, total] = await Promise.all([
      measurementModel
        .find({ experimentId: { $in: experimentIds } })
        .skip(skip)
        .limit(limit)
        .populate({
          path: "experimentId",
          select: "title userId",
          populate: {
            path: "userId",
            select: "name",
          },
        })
        .lean(),
      measurementModel
        .countDocuments({ experimentId: { $in: experimentIds } })
        .lean(),
    ]);
    if (!measurements) {
      throw new NotFoundError("Measurements not found");
    }
    return {
      measurements,
      total,
      page,
      limit,
    };
  }

  static async searchMeasurementsInFactoryOfManager({
    userId,
    name,
    startTime,
    endTime,
    creatorName,
    experimentTitle,
    page = 1,
    limit = 10,
  }) {
    if (!userId) throw new BadRequestError("Missing required fields");

    const foundUser = await userModel.findById(userId);
    if (!foundUser) throw new NotFoundError("User not found");

    // B1: Tìm tất cả user trong cùng nhà máy
    const userQuery = { factoryId: foundUser.factoryId };
    if (creatorName && creatorName.trim()) {
      const safeName = creatorName
        .trim()
        .replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
      userQuery.name = { $regex: safeName, $options: "i" };
    }
    const users = await userModel.find(userQuery).select("_id").lean();
    const userIds = users.map((u) => u._id);

    // B2: Tìm tất cả experiment thỏa mãn
    const experimentQuery = { userId: { $in: userIds } };
    if (experimentTitle && experimentTitle.trim()) {
      const safeTitle = experimentTitle
        .trim()
        .replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
      experimentQuery.title = { $regex: safeTitle, $options: "i" };
    }
    const experiments = await experimentModel
      .find(experimentQuery)
      .select("_id")
      .lean();
    const experimentIds = experiments.map((e) => e._id);

    // B3: Query measurement
    const query = { experimentId: { $in: experimentIds } };

    if (name && name.trim()) {
      const safeName = name.trim().replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
      query.name = { $regex: safeName, $options: "i" };
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

    const [measurements, total] = await Promise.all([
      measurementModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .populate({
          path: "experimentId",
          select: "title userId",
          populate: { path: "userId", select: "name" },
        })
        .lean(),
      measurementModel.countDocuments(query),
    ]);

    return {
      measurements,
      total,
      page,
      limit,
    };
  }
}
module.exports = MeasurementService;
