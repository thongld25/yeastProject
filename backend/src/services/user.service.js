"use strict";

const { randomBytes } = require("crypto");
const { BadRequestError } = require("../core/error.response");
const userModel = require("../models/user.model");
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

  static createUser = async ({ email, name, role, factoryId, gender, birthDate }) => {
    const session = await mongoose.startSession();
    session.startTransaction();    

    try {
      // 1. Check trùng email
      const foundUser = await userModel.findOne({ email }).lean();
      if (foundUser) throw new BadRequestError("Email already exists");

      // 2. Tìm factory và BỎ .lean() để có document instance
      const foundFactory = await FactoryService.findFactoryById(factoryId);
      if (!foundFactory) throw new BadRequestError("Factory not found");

      // 3. Tạo mật khẩu
      const password = randomBytes(8).toString("hex");
      const passwordHash = await bcrypt.hash(password, 10);

      // 4. Tạo user với session transaction
      const newUser = await userModel.create(
        [{ 
          email, 
          name, 
          password: passwordHash, 
          role, 
          factoryId, 
          gender, 
          birthDate: new Date(birthDate) 
        }],
        { session }
      );

      // 5. Thêm user vào factory (sửa newUser[0] vì create trả về array)
      foundFactory.employees.push(newUser[0]._id);
      await foundFactory.save({ session }); // Thêm session vào save()

      // 6. Gửi email
      await MailService.sendMail({
        sendTo: email,
        title: "Your password",
        description: `Your password is ${password}`
      });

      await session.commitTransaction();
      return newUser[0];
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  };


  static findUserOfFactory = async (factoryId) => {
    const users = await userModel.find({ factoryId }).lean();
    if (!users) throw new BadRequestError("Users not found");
    return users;
  };
}

module.exports = UserService;
