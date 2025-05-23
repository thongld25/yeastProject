"use strict";

const { SuccessResponse } = require("../core/success.response");
const ImageService = require("../services/image.service");

class ImageController {
  addImageByMeasurementId = async (req, res, next) => {
    try {
      const { measurementId } = req.params;
      const { name } = req.body;
      const image = req.file;
      new SuccessResponse({
        message: "Add image success!",
        metadata: await ImageService.addImage(measurementId, image, name),
      }).send(res);
    } catch (err) {
      next(err);
    }
  };

  getImageById = async (req, res, next) => {
    try {
      const { imageId } = req.params;
      new SuccessResponse({
        message: "Get image by id success!",
        metadata: await ImageService.getImageById(imageId),
      }).send(res);
    } catch (err) {
      next(err);
    }
  };

  deleteImageById = async (req, res, next) => {
    try {
      const { imageId } = req.params;
      new SuccessResponse({
        message: "Delete image by id success!",
        metadata: await ImageService.deleteImageById(imageId),
      }).send(res);
    } catch (err) {
      next(err);
    }
  };

  getImagesByUserId = async (req, res, next) => {
    const userId = req.user.userId;
    const { page, limit } = req.query;
    new SuccessResponse({
      message: "Get images by user id success!",
      metadata: await ImageService.findImagesByUserIdPage(userId, {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
      }),
    }).send(res);
  };

  searchImagesOfUser = async (req, res, next) => {
    const userId = req.user.userId;
    const { page, limit, name, experimentId, measurementId } = req.query;
    new SuccessResponse({
      message: "Search images of user success!",
      metadata: await ImageService.findImagesOfUser(userId, {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        name,
        experimentId,
        measurementId,
      }),
    }).send(res);
  };

  getImagesInFactoryOfManager = async (req, res, next) => {
    const userId = req.user.userId;
    const { page, limit } = req.query;
    new SuccessResponse({
      message: "Get images in factory of manager success!",
      metadata: await ImageService.getImagesInFactoryOfManager(userId, {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
      }),
    }).send(res);
  };

  searchImagesInFactoryOfManager = async (req, res, next) => {
    const userId = req.user.userId;
    const { page, limit, name, experimentId, measurementId, employeeId } =
      req.query;
    new SuccessResponse({
      message: "Search images in factory of manager success!",
      metadata: await ImageService.searchImagesInFactoryOfManager(userId, {
        name,
        employeeId,
        experimentId,
        measurementId,
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
      }),
    }).send(res);
  };
}

module.exports = new ImageController();
