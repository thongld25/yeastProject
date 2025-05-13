"use strict";

const { randomBytes } = require("crypto");
const { BadRequestError } = require("../core/error.response");
const userModel = require("../models/user.model");
const experimentModel = require("../models/experiment.model");
const mearurementModel = require("../models/measurement.model");
const imageModel = require("../models/image.model");
const factoryModel = require("../models/factory.model");
const FactoryService = require("./factory.service");
const bcrypt = require("bcrypt");
const MailService = require("./mail.service");
const mongoose = require("mongoose");

class UserService {
  static findByEmail = async ({
    email,
    select = { email: 1, password: 1, name: 1, role: 1, factoryId: 1 },
  }) => {
    return await userModel.findOne({ email }).select(select).lean();
  };

  static findById = async (id) => {
    return await userModel.findOne({ _id: id }).lean();
  };

  static createUser = async ({
    email,
    name,
    role,
    factoryId,
    gender,
    birthDate,
  }) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1. Check email
      const foundUser = await userModel.findOne({ email }).session(session);
      if (foundUser) throw new BadRequestError("Email already exists");

      // 2. Tìm factory có session (vẫn kiểm tra tồn tại)
      const foundFactory = await factoryModel
        .findById(factoryId)
        .session(session);
      if (!foundFactory) throw new BadRequestError("Factory not found");

      // 3. Random mật khẩu
      const password = randomBytes(8).toString("hex");
      const passwordHash = await bcrypt.hash(password, 10);

      // 4. Tạo user
      const [newUser] = await userModel.create(
        [
          {
            email,
            name,
            password: passwordHash,
            role,
            factoryId,
            gender,
            birthDate: new Date(birthDate),
          },
        ],
        { session }
      );

      // 5. Commit transaction
      await session.commitTransaction();
      session.endSession();

      // 6. Gửi email sau khi commit
      setImmediate(async () => {
        try {
          await MailService.sendMail({
            sendTo: email,
            title: "Your password",
            description: `Your password is ${password}`,
          });
          console.log("✅ Email sent to:", email);
        } catch (mailErr) {
          console.error("❌ Email sending failed:", mailErr.message);
        }
      });

      return newUser;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error("❌ Error in createUser:", {
        message: error.message,
        stack: error.stack,
      });
      throw error;
    }
  };

  static findUserOfFactory = async (factoryId) => {
    const users = await userModel.find({ factoryId }).lean();
    if (!users) throw new BadRequestError("Users not found");
    return users;
  };

  static deleteUser = async (id) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const user = await userModel.findById(id).session(session);
      if (!user) throw new BadRequestError("User not found");
      const experiments = await experimentModel
        .find({ userId: user._id })
        .session(session);
      const experimentIds = experiments.map((exp) => exp._id);

      const measurements = await mearurementModel
        .find({
          experimentId: { $in: experimentIds },
        })
        .session(session);
      const measurementIds = measurements.map((m) => m._id);

      await imageModel
        .deleteMany({ measurementId: { $in: measurementIds } })
        .session(session);

      // Xóa measurements
      await mearurementModel
        .deleteMany({ experimentId: { $in: experimentIds } })
        .session(session);

      // Xóa experiments
      await experimentModel.deleteMany({ userId: user._id }).session(session);

      const deleted = await userModel.findByIdAndDelete(id).session(session);
      if (!deleted) throw new BadRequestError("Failed to delete user");
      await session.commitTransaction();
      return {
        message: "User and related data deleted successfully",
      };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  };

  static updateUser = async (id, data) => {
    const user = await userModel.findById(id);
    if (!user) throw new BadRequestError("User not found");
    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    );
    if (!updatedUser) throw new BadRequestError("Failed to update user");
    return updatedUser;
  }
}

module.exports = UserService;
