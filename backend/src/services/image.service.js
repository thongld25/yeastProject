"use strict";

const { NotFoundError, BadRequestError } = require("../core/error.response");
const imageModel = require("../models/image.model");
const measurementModel = require("../models/measurement.model");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const imageProcessingQueue = require("../queue");
const cellData = require("../data/mockData.js").cellData;
const cellData2 = require("../data/mockData.js").dataMethylene;
const cellData3 = require("../data/mockData.js").dataLens;
const points = require("../data/mockData.js").points;

class ImageService {
  // add normal image with normal lens
  static async addNormalImage(measurementId, image) {
    if (!measurementId) throw new BadRequestError("Measurement ID is required");
    if (!image) throw new BadRequestError("Images are required");
    if (!image.mimetype.startsWith("image/")) {
      throw new BadRequestError("Uploaded file is not an image");
    }
    const measurement = await measurementModel.findById(measurementId);
    if (!measurement) throw new NotFoundError("Measurement not found");

    // Tải ảnh lên thư mục uploads
    const uploadDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const originalFilename = `${Date.now()}-${image.originalname}`;
    const originalPath = path.join(uploadDir, originalFilename);
    await fs.promises.writeFile(originalPath, image.buffer);

    // Thêm thông tin ảnh vào cơ sở dữ liệu
    const newImage = await imageModel.create({
      filename: originalFilename,
      originalImage: `/uploads/${originalFilename}`,
      imageType: "thường",
      lensType: "thường",
      measurementId: measurementId,
      bacteriaData: null,
      status: "pending",
    });

    // Thêm job vào hàng đợi xử lý
    const job = await imageProcessingQueue.add({ imageId: newImage._id });
    console.log("Job added to queue:", job.id);
    return {
      image: newImage,
      jobId: job.id,
    };
  }

  // add methylene image with normal lens
  static async addMethyleneImage(measurementId, image) {
    if (!measurementId) throw new BadRequestError("Measurement ID is required");
    if (!image) throw new BadRequestError("Images are required");
    if (!image.mimetype.startsWith("image/")) {
      throw new BadRequestError("Uploaded file is not an image");
    }
    const measurement = await measurementModel.findById(measurementId);
    if (!measurement) throw new NotFoundError("Measurement not found");

    // Tải ảnh lên thư mục uploads
    const uploadDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const originalFilename = `${Date.now()}-${image.originalname}`;
    const originalPath = path.join(uploadDir, originalFilename);
    await fs.promises.writeFile(originalPath, image.buffer);

    // Thêm thông tin ảnh vào cơ sở dữ liệu
    const newImage = await imageModel.create({
      filename: originalFilename,
      originalImage: `/uploads/${originalFilename}`,
      imageType: "methylene",
      lensType: "thường",
      measurementId: measurementId,
      bacteriaData: null,
      status: "pending",
    });

    // Thêm job vào hàng đợi xử lý
    const job = await imageProcessingQueue.add({ imageId: newImage._id });
    console.log("Job added to queue:", job.id);
    return {
      image: newImage,
      jobId: job.id,
    };
  }

  // add image with counting lens
  static async addCountingImage(measurementId, image) {
    if (!measurementId) throw new BadRequestError("Measurement ID is required");
    if (!image) throw new BadRequestError("Images are required");
    if (!image.mimetype.startsWith("image/")) {
      throw new BadRequestError("Uploaded file is not an image");
    }
    const measurement = await measurementModel.findById(measurementId);
    if (!measurement) throw new NotFoundError("Measurement not found");

    // Tải ảnh lên thư mục uploads
    const uploadDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const originalFilename = `${Date.now()}-${image.originalname}`;
    const originalPath = path.join(uploadDir, originalFilename);
    await fs.promises.writeFile(originalPath, image.buffer);

    // Thêm thông tin ảnh vào cơ sở dữ liệu
    const newImage = await imageModel.create({
      filename: originalFilename,
      originalImage: `/uploads/${originalFilename}`,
      imageType: "thường",
      lensType: "buồng đếm",
      measurementId: measurementId,
      bacteriaData: null,
      status: "pending",
    });

    // Thêm job vào hàng đợi xử lý
    const job = await imageProcessingQueue.add({ imageId: newImage._id });
    console.log("Job added to queue:", job.id);
    return {
      image: newImage,
      jobId: job.id,
    };
  }

  static async processImage(imageId) {
    if (!imageId) throw new BadRequestError("Image ID is required");
    const image = await imageModel.findById(imageId);
    if (!image) throw new NotFoundError("Image not found");
    if (image.status === "pending") {
      await new Promise((resolve) => setTimeout(resolve, 15000));
      if (image.lensType === "thường") {
        let bounding_boxes;
        if (image.imageType === "thường") {
          bounding_boxes = cellData.bounding_boxes;
        } else if (image.imageType === "methylene") {
          bounding_boxes = cellData2;
        }

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
        image.bacteriaData = bacteriaData;
        image.status = "completed";
        await image.save();
        return image;
      } else if (image.lensType === "buồng đếm") {
        let bounding_boxes = cellData3;
        const bacteriaData = bounding_boxes.map((bbox) => {
          return {
            cell_id: bbox.cell_id,
            x: bbox.x,
            y: bbox.y,
            width: bbox.width,
            height: bbox.height,
          };
        });
        image.points = points;
        image.bacteriaData = bacteriaData;
        image.status = "completed";
        await image.save();
        return image;
      }
    }
  }

  static async getImageById(imageId) {
    if (!imageId) throw new BadRequestError("Image ID is required");
    const image = await imageModel.findById(imageId);
    if (!image) throw new NotFoundError("Image not found");
    return image;
  }

  static async deleteImageById(imageId) {
    if (!imageId) throw new BadRequestError("Image ID is required");
    const image = await imageModel.findById(imageId);
    if (!image) throw new NotFoundError("Image not found");

    // Xóa ảnh khỏi thư mục uploads
    const uploadDir = path.join(__dirname, "../uploads");
    const originalPath = path.join(uploadDir, image.filename);
    if (fs.existsSync(originalPath)) {
      await fs.promises.unlink(originalPath);
    }

    // Xóa ảnh khỏi cơ sở dữ liệu
    await imageModel.findByIdAndDelete(imageId);
    return { message: "Image deleted successfully" };
  }

  // vẽ ảnh coutour
  static async drawContourToBase64(imageBuffer, bbox, contour, padding = 5) {
    if (!imageBuffer || !bbox || !contour?.length) return null;

    const { Image, createCanvas } = require("canvas");
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
      const ctx = fullCanvas.getContext("2d");

      // 3. Vẽ toàn bộ ảnh gốc
      ctx.drawImage(img, 0, 0);

      // 4. Vẽ contour cho từng nấm men (cell)
      ctx.strokeStyle = "rgba(255, 0, 0, 0.8)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(contour[0].x, contour[0].y);
      contour.slice(1).forEach((p) => ctx.lineTo(p.x, p.y));
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
      const croppedCtx = croppedCanvas.getContext("2d");

      // 7. Copy vùng đã vẽ contour
      croppedCtx.drawImage(
        fullCanvas,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight
      );

      // 8. Trả về ảnh đã được cắt và vẽ contour
      return croppedCanvas.toDataURL().split(",")[1];
    } catch (error) {
      console.error("Error processing image buffer:", error);
      return null;
    }
  }
}

module.exports = ImageService;
