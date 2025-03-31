"use strict";

const UserService = require("../services/user.service");
const { SuccessResponse } = require("../core/success.response");

class UserController {
  createUser = async (req, res, next) => {
    new SuccessResponse({
      message: "Create factory success!",
      metadata: await UserService.createUser(req.body),
    }).send(res);
  };

  getUserOfFactory = async (req, res, next) => {
    new SuccessResponse({
      message: "Get all factory success!",
      metadata: await UserService.findUserOfFactory(req.body.factoryId),
    }).send(res);
  };
}

module.exports = new UserController();
