"use strict";

const express = require("express");
const { asyncHandler } = require("../../auth/checkAuth");
const { authentication } = require("../../auth/authUtils");
const userController = require("../../controllers/user.controller");
const router = express.Router();

// authentication
router.use(authentication);

router.post("/add", asyncHandler(userController.createUser));
router.get("/factory", asyncHandler(userController.getUserOfFactory));

module.exports = router;
