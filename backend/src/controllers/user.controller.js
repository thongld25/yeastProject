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
}

module.exports = new UserController();
