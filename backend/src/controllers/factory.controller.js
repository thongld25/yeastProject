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
      metadata: await FactoryService.findAllFactoryWithEmployeeCount(),
    }).send(res);
  };

  getFactoryById = async (req, res, next) => {
    new SuccessResponse({
      message: "Get factory by id success!",
      metadata: await FactoryService.findFactoryById(req.params.id),
    }).send(res);
  };

  updateFactory = async (req, res, next) => {
    new SuccessResponse({
      message: "Update factory success!",
      metadata: await FactoryService.updateFactory(req.params.id, req.body),
    }).send(res);
  };

  deleteFactory = async (req, res, next) => {
    new SuccessResponse({
      message: "Delete factory success!",
      metadata: await FactoryService.deleteFactory(req.params.id),
    }).send(res);
  };

}

module.exports = new FactoryController();
