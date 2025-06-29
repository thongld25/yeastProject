"use strict";
const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  filename: {
    type: String,
  },
  // Original Image
  originalImage: {
    type: String,
  },
  // Mask Image
  maskImage: {
    type: String,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed", "initial"],
    default: "pending",
  },
  measurementId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Measurement",
  },
  points: [
    {
      x: Number,
      y: Number,
    },
  ],
  bacteriaData: [
    {
      cell_id: { type: String },
      x: Number,
      y: Number,
      width: Number,
      height: Number,
      type: {
        type: String,
      },
      editType:{
        type: String,
      },
      wrongType:{
        type: Boolean,
        default: false,
      },
      wrongBox:{
        type: Boolean,
        default: false,
      },
      area: Number,
      perimeter: Number,
      circularity: Number,
      convexity: Number,
      CE_diameter: Number,
      major_axis_length: Number,
      minor_axis_length: Number,
      aspect_ratio: Number,
      max_distance: Number,
      image: {
        type: String,
      },
      statusCell: {
        type: String,
      },
    },
  ],
});

module.exports = mongoose.model("Image", ImageSchema);
