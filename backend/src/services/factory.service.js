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

  // static findAllFactory = async () => {
  //   const factories = await factoryModel.find({}).lean();
  //   if (!factories) throw new NotFoundError("Factories not found");
  //   return factories;
  // };

  // find all factory and number of employees in each factory
  static findAllFactoryWithEmployeeCount = async () => {
    const factories = await factoryModel.aggregate([
      {
        $project: {
          _id: 1,
          name: 1,
          location: 1,
          createdAt: 1,
          employeeCount: { $size: "$employees" } // Đếm trực tiếp mảng employees
        }
      }
    ]);
    if (!factories) throw new NotFoundError("Factories not found");
    return factories;
  };

  static findFactoryById = async (id) => {
    const factory = await factoryModel.findById(id);
    if (!factory) throw new NotFoundError("Factory not found");
    return factory;
  }

}

module.exports = FactoryService;
