"use strict";

const { NotFoundError, BadRequestError } = require("../core/error.response");
const factoryModel = require("../models/factory.model");
const userModel = require("../models/user.model");
const experimentModel = require("../models/experiment.model");
const mearurementModel = require("../models/measurement.model");
const imageModel = require("../models/image.model");
const mongoose = require("mongoose");

class FactoryService {
  static createFactory = async ({ name, location }) => {
    const foundFactory = await factoryModel.findOne({ name });
    if (foundFactory) throw new BadRequestError("Factory already exists");
    const newFactory = await factoryModel.create({
      name,
      location,
    });
    if (!newFactory) throw new BadRequestError("Error creating factory");
    return newFactory;
  };

  // static findAllFactory = async () => {
  //   const factories = await factoryModel.find({}).lean();
  //   if (!factories) throw new NotFoundError("Factories not found");
  //   return factories;
  // };

  // find all factory and number of employees in each factory
  static findAllFactoryWithEmployeeCount = async () => {
    try {
      const result = await factoryModel.aggregate([
        {
          $lookup: {
            from: "users", // Tên collection users
            localField: "_id",
            foreignField: "factoryId",
            as: "employees",
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            location: 1,
            status: 1,
            employeeCount: { $size: "$employees" },
          },
        },
      ]);

      return result;
    } catch (error) {
      throw new Error(
        "Error fetching factory list with employee count: " + error.message
      );
    }
  };

  static findFactoryById = async (id) => {
    const factory = await factoryModel.findById(id);
    if (!factory) throw new NotFoundError("Factory not found");
    return factory;
  };
  static updateFactory = async (id, data) => {
    const factory = await factoryModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    );
    if (!factory) throw new NotFoundError("Factory not found");
    return factory;
  };

  static deleteFactory = async (id) => {
    const session = await mongoose.startSession(); // Khởi tạo session
    session.startTransaction(); // Bắt đầu transaction

    try {
      const factory = await factoryModel.findById(id).session(session);
      if (!factory) throw new NotFoundError("Factory not found");
      const employees = await userModel
        .find({ factoryId: id })
        .session(session);
      const employeeIds = employees.map((emp) => emp._id);

      // Tìm các experiment do các nhân viên tạo
      const experiments = await experimentModel
        .find({ userId: { $in: employeeIds } })
        .session(session);
      const experimentIds = experiments.map((exp) => exp._id);

      // Tìm các measurement trong các experiment
      const measurements = await mearurementModel
        .find({
          experimentId: { $in: experimentIds },
        })
        .session(session);
      const measurementIds = measurements.map((m) => m._id);

      // Xóa ảnh liên quan
      await imageModel
        .deleteMany({ measurementId: { $in: measurementIds } })
        .session(session);

      // Xóa measurements
      await mearurementModel
        .deleteMany({ experimentId: { $in: experimentIds } })
        .session(session);

      // Xóa experiments
      await experimentModel
        .deleteMany({ userId: { $in: employeeIds } })
        .session(session);

      // Xóa nhân viên
      await userModel.deleteMany({ factoryId: id }).session(session);

      // Xóa factory
      const deleted = await factoryModel.findByIdAndDelete(id).session(session);
      if (!deleted) throw new BadRequestError("Failed to delete factory");

      await session.commitTransaction(); // Hoàn tất transaction
      session.endSession();

      return { message: "Factory and related data deleted successfully" };
    } catch (error) {
      await session.abortTransaction(); // Hoàn tác nếu có lỗi
      session.endSession();
      throw error; // Ném lại lỗi để controller xử lý
    } finally {
      session.endSession(); // Đảm bảo kết thúc session
    }
  };
  static countingEmployeeOfFactory = async (userId) => {
    const user = await userModel.findById(userId);
    if (!user) throw new NotFoundError("User not found");
    const factoryId = user.factoryId;
    if (!factoryId) throw new NotFoundError("Factory not found");
    const employees = await userModel.find({ factoryId }).lean();
    if (!employees) throw new NotFoundError("Employees not found");
    const employeeCount = employees.length;
    const employeeIds = employees.map((emp) => emp._id);
    const experiments = await experimentModel
      .find({ userId: { $in: employeeIds } })
      .lean();
    const experimentCount = experiments.length;
    const experimentIds = experiments.map((exp) => exp._id);
    const measurements = await mearurementModel
      .find({ experimentId: { $in: experimentIds } })
      .lean();
    const measurementCount = measurements.length;
    const imageCount = await imageModel.countDocuments({
      measurementId: { $in: measurements.map((m) => m._id) },
    });
    return {
      employeeCount,
      experimentCount,
      measurementCount,
      imageCount,
    };
  };
}
module.exports = FactoryService;
