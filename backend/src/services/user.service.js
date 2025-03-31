"use strict";

const { randomBytes } = require("crypto");
const { BadRequestError } = require("../core/error.response");
const userModel = require("../models/user.model");
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

  static createUser = async ({ email, name, role, factoryId }) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    const foundUser = await userModel.findOne({ email }).lean();
    if (foundUser) {
      await session.abortTransaction();
      session.endSession();
      throw new BadRequestError("Email already exists");
    }
    const password = randomBytes(8).toString("hex");
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await userModel.create(
      [{ email, name, password: passwordHash, role, factoryId }],
      { session }
    );
    console.log("Sending email to:", email); // Debug xem email có giá trị không
    const sendMail = await MailService.sendMail({
      sendTo: email,
      title: "Your password",
      description: `Your password is ${password}`,
    });
    if (!sendMail) {
      await session.abortTransaction();
      session.endSession();
      throw new BadRequestError("Error sending email");
    }
    await session.commitTransaction();
    session.endSession();

    return newUser;
  };

  static findUserOfFactory = async (factoryId) => {
    const users = await userModel.find({ factoryId }).lean();
    if (!users) throw new BadRequestError("Users not found");
    return users;
  };
}

module.exports = UserService;
