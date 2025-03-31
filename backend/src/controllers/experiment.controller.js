"use strict";

const ExperimentService = require("../services/experiment.service");
const {SuccessResponse} = require("../core/success.response");

class ExperimentController {
    createExperiment = async (req, res, next) => {
        const {title, description} = req.body;
        const userId = req.user.userId;
        new SuccessResponse({
            message: "Create experiment success!",
            metadata: await ExperimentService.createExperiment({title, description, userId}),
        }).send(res);
    }

    getExperimentByUserId = async (req, res, next) => {
        const userId = req.user.userId;
        new SuccessResponse({
            message: "Get experiment success!",
            metadata: await ExperimentService.findByUserId(userId),
        }).send(res);
    }

    getExperimentOfFactory = async (req, res, next) => {
        const userId = req.user.userId;
        new SuccessResponse({
            message: "Get experiment success!",
            metadata: await ExperimentService.findOfFactory(userId),
        }).send(res);
    }
}

module.exports = new ExperimentController();
