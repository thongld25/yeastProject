"use strict";

const express = require("express");
const { asyncHandler } = require("../../auth/checkAuth");
const { authentication } = require("../../auth/authUtils");
const userController = require("../../controllers/user.controller");
const router = express.Router();

// authentication
router.use(authentication);

router.post("/add", asyncHandler(userController.createUser));
router.post("/create", asyncHandler(userController.addUser));
router.post("/change-password", asyncHandler(userController.changePassword));
router.get("/factory/:factoryId", asyncHandler(userController.getUserOfFactory));
router.get("/manager/employee", asyncHandler(userController.getEmployeeOfFactory));
router.get("/:userId", asyncHandler(userController.getUserById));
router.get("/counting/:userId", asyncHandler(userController.countingExperimentOfUser));
router.delete("/delete/:userId", asyncHandler(userController.deleteUserById));
router.put("/update/:userId", asyncHandler(userController.updateUser));

module.exports = router;
