"use strict";

const { NotFoundError, BadRequestError } = require("../core/error.response");
const measurementModel = require("../models/measurement.model");
const ExperimentService = require("./experiment.service");
const imageModel = require("../models/image.model");
const cellData = require("../data/mockData.js").cellData;
const { createCanvas } = require("canvas");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");

class MeasurementService {
  static async drawContourToBase64(imageBuffer, bbox, contour, padding = 5) {
    if (!imageBuffer || !bbox || !contour?.length) return null;

    const { Image } = require('canvas');
    try {
        // 1. Tải ảnh từ buffer
        const img = await new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = () => resolve(image);
            image.onerror = reject;
            image.src = imageBuffer;
        });

        // 2. Tạo canvas cùng kích thước ảnh gốc
        const fullCanvas = createCanvas(img.width, img.height);
        const ctx = fullCanvas.getContext('2d');

        // 3. Vẽ toàn bộ ảnh gốc
        ctx.drawImage(img, 0, 0);

        // 4. Vẽ contour cho từng nấm men (cell)
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(contour[0].x, contour[0].y);
        contour.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.stroke();

        // 5. Tính toán vùng cắt với padding
        const { x, y, width, height } = bbox;
        const cropX = Math.max(x - padding, 0);
        const cropY = Math.max(y - padding, 0);
        const cropWidth = Math.min(x + width + padding, img.width) - cropX;
        const cropHeight = Math.min(y + height + padding, img.height) - cropY;

        // 6. Tạo canvas mới cho vùng cắt
        const croppedCanvas = createCanvas(cropWidth, cropHeight);
        const croppedCtx = croppedCanvas.getContext('2d');

        // 7. Copy vùng đã vẽ contour
        croppedCtx.drawImage(
            fullCanvas,
            cropX, cropY, cropWidth, cropHeight,
            0, 0, cropWidth, cropHeight
        );

        // 8. Trả về ảnh đã được cắt và vẽ contour
        return croppedCanvas.toDataURL().split(',')[1];

    } catch (error) {
        console.error('Error processing image buffer:', error);
        return null;
    }
}


  static async addImage(measurementId, images, imageType, lensType) {
    if (imageType == "thường" && lensType == "thường") {
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
            contour.contour,
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
            lensType: lensType,
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
    } else if (imageType == "methylene" && lensType == "thường") {
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
            lensType: lensType,
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

  static async createMeasurement(
    name,
    experimentId,
    images,
    time,
    imageType,
    lensType
  ) {
    if (!name || !experimentId || !images) {
      throw new BadRequestError("Missing required fields");
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const experiment = await ExperimentService.findById(experimentId);
      if (!experiment) {
        throw new NotFoundError("Experiment not found");
      }

      const measurement = await measurementModel.create(
        [
          {
            name,
            experimentId,
            time: new Date(time),
          },
        ],
        { session }
      );

      const measurementDoc = measurement[0]; // do create([]) trả về mảng

      const savedImages = [];
      const uploadDir = path.join(__dirname, "../uploads");

      for (const image of images) {
        const originalFilename = `${uuidv4()}-${image.originalname}`;
        const originalPath = path.join(uploadDir, originalFilename);
        fs.writeFileSync(originalPath, image.buffer); // lưu ảnh

        let bacteriaData = [];
        let maskPath = null;

        if (imageType === "thường" && lensType === "thường") {
          const maskFilename = `mask-${originalFilename}`;
          maskPath = path.join(uploadDir, maskFilename);
          fs.writeFileSync(maskPath, image.buffer);

          const bounding_boxes = cellData.bounding_boxes;
          const contoursList = cellData.contoursList;
          const contourMap = new Map();
          contoursList.forEach((item) => {
            contourMap.set(item.cell_id, item);
          });

          bacteriaData = await Promise.all(bounding_boxes.map(async (bbox) => {
            const contour = contourMap.get(bbox.cell_id);
            const cellDataObj = {
              cell_id: bbox.cell_id,
              x: bbox.x,
              y: bbox.y,
              width: bbox.width,
              height: bbox.height,
              type: bbox.type,
            };
            if (contour) {
              Object.assign(cellDataObj, {
                area: contour.area,
                perimeter: contour.perimeter,
                circularity: contour.circularity,
                convexity: contour.convexity,
                CE_diameter: contour.CE_diameter,
                major_axis_length: contour.major_axis_length,
                minor_axis_length: contour.minor_axis_length,
                aspect_ratio: contour.aspect_ratio,
                max_distance: contour.max_distance,
                image: await MeasurementService.drawContourToBase64(
                  image.buffer,
                  {
                    x: bbox.x,
                    y: bbox.y,
                    width: bbox.width,
                    height: bbox.height,
                  },
                  contour.contour,
                  5
                ),
              });
            }
            return cellDataObj;
          }));
        } else if (imageType === "methylene" && lensType === "thường") {
          const bounding_boxes = cellData.bounding_boxes;
          bacteriaData = bounding_boxes.map((bbox) => ({
            cell_id: bbox.cell_id,
            x: bbox.x,
            y: bbox.y,
            width: bbox.width,
            height: bbox.height,
            type: bbox.type,
          }));
        }

        const imageDoc = await imageModel.create(
          [
            {
              originalImage: `/uploads/${originalFilename}`,
              imageType: imageType,
              lensType: lensType,
              maskImage: maskPath
                ? `/uploads/${path.basename(maskPath)}`
                : undefined,
              measurementId: measurementDoc._id,
              bacteriaData,
            },
          ],
          { session }
        );

        savedImages.push(imageDoc[0]._id);
      }

      measurementDoc.images = savedImages;
      await measurementDoc.save({ session });

      await session.commitTransaction();
      session.endSession();

      return measurementDoc;
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      console.error("❌ Transaction failed:", err);
      throw new Error("Create measurement failed");
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
