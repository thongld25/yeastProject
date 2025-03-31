"use strict";

const FactoryService = require("../services/factory.service");
const { SuccessResponse } = require("../core/success.response");

class FactoryController {
  createFactory = async (req, res, next) => {
    new SuccessResponse({
      message: "Create factory success!",
      metadata: await FactoryService.createFactory(req.body),
    }).send(res);
  };

  getAllFactory = async (req, res, next) => {
    new SuccessResponse({
      message: "Get all factory success!",
      metadata: await FactoryService.findAllFactory(),
    }).send(res);
  };

}

module.exports = new FactoryController();
