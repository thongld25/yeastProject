"use strict";

const UserService = require("../services/user.service");
const { SuccessResponse } = require("../core/success.response");

class UserController {
  createUser = async (req, res, next) => {
    new SuccessResponse({
      message: "Create user success!",
      metadata: await UserService.createUser(req.body),
    }).send(res);
  };

  addUser = async (req, res, next) => {
    new SuccessResponse({
      message: "Add user success!",
      metadata: await UserService.addUser(req.body),
    }).send(res);
  };

  changePassword = async (req, res, next) => {
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const userId = req.user.userId;
    new SuccessResponse({
      message: "Change password success!",
      metadata: await UserService.changePassword(
        userId,
        oldPassword,
        newPassword
      ),
    }).send(res);
  };

  getUserOfFactory = async (req, res, next) => {
    new SuccessResponse({
      message: "Get all factory success!",
      metadata: await UserService.findUserOfFactory(req.params.factoryId),
    }).send(res);
  };

  getUserById = async (req, res, next) => {
    new SuccessResponse({
      message: "Get user by id success!",
      metadata: await UserService.findById(req.params.userId),
    }).send(res);
  };

  deleteUserById = async (req, res, next) => {
    new SuccessResponse({
      message: "Delete user by id success!",
      metadata: await UserService.deleteUser(req.params.userId),
    }).send(res);
  };

  updateUser = async (req, res, next) => {
    new SuccessResponse({
      message: "Update user by id success!",
      metadata: await UserService.updateUser(req.params.userId, req.body),
    }).send(res);
  };
  countingExperimentOfUser = async (req, res, next) => {
    const { userId } = req.params;
    new SuccessResponse({
      message: "Counting experiment of user success!",
      metadata: await UserService.countingExperimentOfUser(userId),
    }).send(res);
  };
  getEmployeeOfFactory = async (req, res, next) => {
    const userId = req.user.userId;
    new SuccessResponse({
      message: "Get employee of factory success!",
      metadata: await UserService.getEmployeeOfFactory(userId),
    }).send(res);
  };
}

module.exports = new UserController();
