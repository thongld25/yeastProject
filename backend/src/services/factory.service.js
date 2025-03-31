"use strict";

const { NotFoundError, BadRequestError } = require("../core/error.response");
const factoryModel = require("../models/factory.model");

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

  static findAllFactory = async () => {
    const factories = await factoryModel.find({}).lean();
    if (!factories) throw new NotFoundError("Factories not found");
    return factories;
  };
}

module.exports = FactoryService;
