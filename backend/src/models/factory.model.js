"use strict";

const mongoose = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Factory";
const COLLECTION_NAME = "factories";

// Declare the Schema of the Mongo model
const FactorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    location: {
      type: String,
      required: true,
      trim: true
    },
    employees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ]
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, FactorySchema);
