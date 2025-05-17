"use strict";

const { SuccessResponse } = require("../core/success.response");
const StatisticsService = require("../services/statistics.service");

class StatictisController {
  getStatisticsOfMeasurement = async (req, res, next) => {
    try {
      const { measurementId } = req.params;
      new SuccessResponse({
        message: "Get statistics of measurement success!",
        metadata: await StatisticsService.getStatisticsOfMeasurement(measurementId),
      }).send(res);
    } catch (err) {
      next(err);
    }
  };

  getStatisticsOfExperiment = async (req, res, next) => {
    try {
      const { experimentId } = req.params;
      new SuccessResponse({
        message: "Get statistics of experiment success!",
        metadata: await StatisticsService.getStatisticsOfExperiment(experimentId),
      }).send(res);
    } catch (err) {
      next(err);
    }
  };
}

module.exports = new StatictisController();
