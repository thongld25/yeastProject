"use strict";

const AccessService = require("../services/access.service");
const { OK, CREATED, SuccessResponse } = require("../core/success.response");

class AccessController {

  getUserProfile = async (req, res, next) => {
    new SuccessResponse({
      message: "Get user profile success!",
      metadata: await AccessService.getUserProfile(req.user.userId),
    }).send(res);
  }

  handlerRefreshToken = async (req, res, next) => {
    new SuccessResponse({
      message: "Get token success!",
      metadata: await AccessService.handlerRefeshToken({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore,
      }),
    }).send(res);
  };

  logout = async (req, res, next) => {
    new SuccessResponse({
      message: "Logout success!",
      metadata: await AccessService.logout(req.keyStore),
    }).send(res);
  };

  login = async (req, res, next) => {
    new SuccessResponse({
      metadata: await AccessService.login(req.body),
    }).send(res);
  };

  signUp = async (req, res, next) => {
    new CREATED({
      message: "Created!",
      metadata: await AccessService.signUp(req.body),
    }).send(res);
  };
}

module.exports = new AccessController();
