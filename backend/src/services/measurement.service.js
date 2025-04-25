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

  static async addImage(measurementId, images, imageType) {
    if (imageType == "thường") {
      if (!measurementId || !images) {
        throw new BadRequestError("Missing required fields");
      }
      const measurement = await measurementModel.findById(measurementId);
      if (!measurement) {
        throw new NotFoundError("Measurement not found");
      }
      const savedImages = [];
      for (const image of images) {
        // 👉 Mock dữ liệu thay vì gọi axios đến server xử lý
        const mockMaskImage = "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"; // Giả lập dùng ảnh gốc làm ảnh mask
        const bounding_boxes = cellData.bounding_boxes;
        const contoursList = cellData.contoursList;
        const contourMap = new Map();
        contoursList.forEach((item) => {
          contourMap.set(item.cell_id, item);
        });

        const bacteriaData = bounding_boxes.map((bbox) => {
          const contour = contourMap.get(bbox.cell_id);
          if (!contour) {
            console.warn("⚠️ No contour found for cell_id:", bbox.cell_id);
            return {
              cell_id: bbox.cell_id,
              x: bbox.x,
              y: bbox.y,
              width: bbox.width,
              height: bbox.height,
              type: bbox.type,
            }; // hoặc continue nếu dùng for-loop
          }
          const imageBase64 = MeasurementService.drawContourToBase64(
            contour.contour
          );
          // console.log(contour);

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

        try {
          const imageDoc = await imageModel.create({
            originalImage: image.buffer.toString("base64"),
            imageType: imageType,
            maskImage: mockMaskImage,
            measurementId: measurement._id,
            bacteriaData,
          });
          savedImages.push(imageDoc._id);
        } catch (err) {
          console.error("❌ Error creating imageDoc:", err);
        }
      }

      measurement.images.push(...savedImages);
      await measurement.save();

      return measurement;
    } else {
      if (!measurementId || !images) {
        throw new BadRequestError("Missing required fields");
      }
      const measurement = await measurementModel.findById(measurementId);
      if (!measurement) {
        throw new NotFoundError("Measurement not found");
      }
      const savedImages = [];
      for (const image of images) {
        // 👉 Mock dữ liệu thay vì gọi axios đến server xử lý
        const bounding_boxes = cellData.bounding_boxes;

        const bacteriaData = bounding_boxes.map((bbox) => {
          return {
            cell_id: bbox.cell_id,
            x: bbox.x,
            y: bbox.y,
            width: bbox.width,
            height: bbox.height,
            type: bbox.type,
          };
        });

        try {
          const imageDoc = await imageModel.create({
            originalImage: image.buffer.toString("base64"),
            imageType: imageType,
            measurementId: measurement._id,
            bacteriaData,
          });
          savedImages.push(imageDoc._id);
        } catch (err) {
          console.error("❌ Error creating imageDoc:", err);
        }
      }

      measurement.images.push(...savedImages);
      await measurement.save();

      return measurement;
    }
  }

  static async createMeasurement(name, experimentId, images, time, imageType) {
    if (imageType == "thường") {
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
          if (!contour) {
            console.warn("⚠️ No contour found for cell_id:", bbox.cell_id);
            return {
              cell_id: bbox.cell_id,
              x: bbox.x,
              y: bbox.y,
              width: bbox.width,
              height: bbox.height,
              type: bbox.type,
            }; // hoặc continue nếu dùng for-loop
          }
          const imageBase64 = MeasurementService.drawContourToBase64(
            contour.contour
          );
          // console.log(contour);

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

        try {
          const imageDoc = await imageModel.create({
            originalImage: image.buffer.toString("base64"),
            imageType: imageType,
            maskImage: mockMaskImage,
            measurementId: measurement._id,
            bacteriaData,
          });
          savedImages.push(imageDoc._id);
        } catch (err) {
          console.error("❌ Error creating imageDoc:", err);
        }
      }

      measurement.images = savedImages;
      await measurement.save();

      return measurement;
    } else {
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
        const bounding_boxes = cellData.bounding_boxes;

        const bacteriaData = bounding_boxes.map((bbox) => {
          return {
            cell_id: bbox.cell_id,
            x: bbox.x,
            y: bbox.y,
            width: bbox.width,
            height: bbox.height,
            type: bbox.type,
          };
        });

        try {
          const imageDoc = await imageModel.create({
            originalImage: image.buffer.toString("base64"),
            imageType: imageType,
            measurementId: measurement._id,
            bacteriaData,
          });
          savedImages.push(imageDoc._id);
        } catch (err) {
          console.error("❌ Error creating imageDoc:", err);
        }
      }

      measurement.images = savedImages;
      await measurement.save();

      return measurement;
    }
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
  static async deleteImageById(imageId) {
    if (!imageId) {
      throw new BadRequestError("Missing required fields");
    }

    const image = await imageModel.findById(imageId);
    if (!image) {
      throw new NotFoundError("Image not found");
    }

    // Nếu ảnh này có measurementId thì mới tìm và xóa khỏi mảng images
    if (image.measurementId) {
      const measurement = await measurementModel.findById(image.measurementId);
      if (measurement) {
        const index = measurement.images.indexOf(imageId);
        if (index > -1) {
          measurement.images.splice(index, 1);
          await measurement.save();
        }
      }
    }

    await imageModel.findByIdAndDelete(imageId);
    return "Image deleted successfully";
  }
}
module.exports = MeasurementService;
