"use strict";

const { NotFoundError, BadRequestError } = require("../core/error.response");
const measurementModel = require("../models/measurement.model");
const ExperimentService = require("./experiment.service");
const imageModel = require("../models/image.model");
const cellData = require("../data/mockData.js").cellData;
const { createCanvas } = require("canvas");

class MeasurementService {
  static drawContourToBase64(contour, padding = 5) {
    if (!contour || contour.length === 0) return null;

    // Tính bounding box nhỏ nhất từ contour để crop
    const xs = contour.map((p) => p.x);
    const ys = contour.map((p) => p.y);
    const minX = Math.min(...xs) - padding;
    const maxX = Math.max(...xs) + padding;
    const minY = Math.min(...ys) - padding;
    const maxY = Math.max(...ys) + padding;

    const width = maxX - minX + 1;
    const height = maxY - minY + 1;

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.beginPath();

    const [first, ...rest] = contour;
    ctx.moveTo(first.x - minX, first.y - minY);
    for (const point of rest) {
      ctx.lineTo(point.x - minX, point.y - minY);
    }
    ctx.closePath();
    ctx.stroke();

    // Trả về chỉ phần base64 (bỏ prefix)
    return canvas.toDataURL("image/png").split(",")[1];
  }

  static async createMeasurement(name, experimentId, images, time) {
    if (!name || !experimentId || !images) {
      throw new BadRequestError("Missing required fields");
    }
    // Check if the experiment exists
    const experiment = await ExperimentService.findById(experimentId);
    if (!experiment) {
      throw new NotFoundError("Experiment not found");
    }
    const measurement = await measurementModel.create({
      name,
      experimentId,
      time: new Date(time),
    });
    const savedImages = [];
    for (const image of images) {
      // 👉 Mock dữ liệu thay vì gọi axios đến server xử lý
      const mockMaskImage = image.buffer.toString("base64"); // Giả lập dùng ảnh gốc làm ảnh mask
      const bounding_boxes = cellData.bounding_boxes;
      const contoursList = cellData.contoursList;
      const contourMap = new Map();
      contoursList.forEach((item) => {
        contourMap.set(item.cell_id, item);
      });

      const bacteriaData = bounding_boxes.map((bbox) => {
        const contour = contourMap.get(bbox.cell_id);
        const imageBase64 = MeasurementService.drawContourToBase64(
          contour.contour
        );
        console.log(contour);

        return {
          cell_id: bbox.cell_id,
          x: bbox.x,
          y: bbox.y,
          width: bbox.width,
          height: bbox.height,
          type: bbox.type,
          area: contour.area,
          perimeter: contour.perimeter,
          circularity: contour.circularity,
          convexity: contour.convexity,
          CE_diameter: contour.CE_diameter,
          major_axis_length: contour.major_axis_length,
          minor_axis_length: contour.minor_axis_length,
          aspect_ratio: contour.aspect_ratio,
          max_distance: contour.max_distance,
          image: imageBase64,
        };
      });

      const imageDoc = await imageModel.create({
        originalImage: image.buffer.toString("base64"),
        maskImage: mockMaskImage,
        measurementId: measurement._id,
        bacteriaData,
      });

      savedImages.push(imageDoc._id);
    }

    measurement.images = savedImages;
    await measurement.save();

    return measurement;
  }

  static async getMeasurementByExperimentId(experimentId) {
    if (!experimentId) {
      throw new BadRequestError("Missing required fields");
    }
    const measurements = await measurementModel.find({
      experimentId,
    });
    if (!measurements) {
      throw new NotFoundError("Measurement not found");
    }
    return measurements;
  }

  static async getImagesByMeasurementId(measurementId) {
    if (!measurementId) {
      throw new BadRequestError("Missing required fields");
    }
    const images = await imageModel.find({ measurementId }).lean();
    if (!images) {
      throw new NotFoundError("Images not found");
    }
    return images;
  }
  static async getImageById(imageId) {
    if (!imageId) {
      throw new BadRequestError("Missing required fields");
    }
    const image = await imageModel.findById(imageId).lean();
    if (!image) {
      throw new NotFoundError("Image not found");
    }
    return image;
  }
}
module.exports = MeasurementService;
