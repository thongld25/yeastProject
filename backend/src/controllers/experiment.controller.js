"use strict";

const ExperimentService = require("../services/experiment.service");
const {SuccessResponse} = require("../core/success.response");

class ExperimentController {
    createExperiment = async (req, res, next) => {
        const {title, description, time} = req.body;
        const userId = req.user.userId;
        new SuccessResponse({
            message: "Create experiment success!",
            metadata: await ExperimentService.createExperiment({title, description, time, userId}),
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
    deleteExperiment = async (req, res, next) => {
        new SuccessResponse({
            message: "Delete experiment success!",
            metadata: await ExperimentService.deleteExperiment(req.params.experimentId),
        }).send(res);
    }
    updateExperiment = async (req, res, next) => {
        const {experimentId} = req.params;
        const {title, description, time} = req.body;
        new SuccessResponse({
            message: "Update experiment success!",
            metadata: await ExperimentService.updateExperiment(experimentId, {title, description, time}),
        }).send(res);
    }
    getExperimentById = async (req, res, next) => {
        const {experimentId} = req.params;
        new SuccessResponse({
            message: "Get experiment by id success!",
            metadata: await ExperimentService.findById(experimentId),
        }).send(res);
    }
}

module.exports = new ExperimentController();
