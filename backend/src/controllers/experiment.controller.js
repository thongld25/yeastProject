"use strict";

const ExperimentService = require("../services/experiment.service");
const { SuccessResponse } = require("../core/success.response");

class ExperimentController {
  createExperiment = async (req, res, next) => {
    const { title, description, time } = req.body;
    const userId = req.user.userId;
    new SuccessResponse({
      message: "Create experiment success!",
      metadata: await ExperimentService.createExperiment({
        title,
        description,
        time,
        userId,
      }),
    }).send(res);
  };

  getExperimentByUserIdPage = async (req, res, next) => {
    const userId = req.user.userId;
    const { page, limit } = req.query;
    new SuccessResponse({
      message: "Get experiment success!",
      metadata: await ExperimentService.findByUserIdPage(userId, {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
      }),
    }).send(res);
  };

  getExperimentOfFactory = async (req, res, next) => {
    const userId = req.user.userId;
    new SuccessResponse({
      message: "Get experiment success!",
      metadata: await ExperimentService.findOfFactory(userId),
    }).send(res);
  };
  deleteExperiment = async (req, res, next) => {
    new SuccessResponse({
      message: "Delete experiment success!",
      metadata: await ExperimentService.deleteExperiment(
        req.params.experimentId
      ),
    }).send(res);
  };
  updateExperiment = async (req, res, next) => {
    const { experimentId } = req.params;
    const { title, description, time } = req.body;
    new SuccessResponse({
      message: "Update experiment success!",
      metadata: await ExperimentService.updateExperiment(experimentId, {
        title,
        description,
        time,
      }),
    }).send(res);
  };
  getExperimentById = async (req, res, next) => {
    const { experimentId } = req.params;
    new SuccessResponse({
      message: "Get experiment by id success!",
      metadata: await ExperimentService.findById(experimentId),
    }).send(res);
  };
  searchExperimentOfEmployee = async (req, res, next) => {
    const { title, startTime, endTime, page = 1, limit = 10 } = req.query;
    const userId = req.user.userId;
    new SuccessResponse({
      message: "Search experiment success!",
      metadata: await ExperimentService.searchExperiments({
        userId,
        title,
        startTime,
        endTime,
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
      }),
    }).send(res);
  };
  getExperimentOfUser = async (req, res, next) => {
    const userId = req.user.userId;
    new SuccessResponse({
      message: "Get experiment of user success!",
      metadata: await ExperimentService.findByUserId(userId),
    }).send(res);
  };
  getExperimentInFactoryOfManager = async (req, res, next) => {
    const userId = req.user.userId;
    const { page, limit } = req.query;
    new SuccessResponse({
      message: "Get experiment of factory success!",
      metadata: await ExperimentService.getExperimentInFactoryOfManager(userId, {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
      }),
    }).send(res);
  }

  searchExperimentsInFactoryOfManager = async (req, res, next) => {
    const { title, creatorName, startTime, endTime, page = 1, limit = 10 } = req.query;
    const userId = req.user.userId;
    new SuccessResponse({
      message: "Search experiment success!",
      metadata: await ExperimentService.searchExperimentsInFactoryOfManager({
        userId,
        creatorName,
        title,
        startTime,
        endTime,
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
      }),
    }).send(res);
  }

  getExperimentByUserId = async (req, res, next) => {
    const userId = req.params.userId;
    new SuccessResponse({
      message: "Get experiment by user id success!",
      metadata: await ExperimentService.findByUserId(userId),
    }).send(res);
  }
}

module.exports = new ExperimentController();
