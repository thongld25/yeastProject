"use strict";

const express = require("express");
const FactoryController = require("../../controllers/factory.controller");
const { asyncHandler } = require("../../auth/checkAuth");
const { authentication } = require("../../auth/authUtils");
const router = express.Router();

// authentication
router.use(authentication);

router.post("/add", asyncHandler(FactoryController.createFactory));
router.get("/all", asyncHandler(FactoryController.getAllFactory));
router.get("/manager/count", asyncHandler(FactoryController.countingFactory));
router.get("/:id", asyncHandler(FactoryController.getFactoryById));
router.put("/update/:id", asyncHandler(FactoryController.updateFactory));
router.delete("/delete/:id", asyncHandler(FactoryController.deleteFactory));

module.exports = router;
