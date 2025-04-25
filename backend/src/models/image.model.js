"use strict";
const { area120tables } = require("googleapis/build/src/apis/area120tables");
const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  // Original Image
  originalImage: {
    type: String,
  },
  // Mask Image
  maskImage: {
    type: String,
  },
  imageType: String,
  measurementId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Measurement",
  },
  bacteriaData: [
    {
      cell_id: { type: String},
      x: Number,
      y: Number,
      width: Number,
      height: Number,
      type: {
        type: String,
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
    },
  ],
});

module.exports = mongoose.model("Image", ImageSchema);
