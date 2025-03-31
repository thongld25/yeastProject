"use strict";

const mongoose = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Experiment";
const COLLECTION_NAME = "experiments";

// Declare the Schema of the Mongo model
var ExperimentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    factoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Factory",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, ExperimentSchema);
