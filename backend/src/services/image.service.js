"use strict";

const { NotFoundError, BadRequestError } = require("../core/error.response");
const imageModel = require("../models/image.model");
const measurementModel = require("../models/measurement.model");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const imageProcessingQueue = require("../queue");
const userModel = require("../models/user.model.js");
const experimentModel = require("../models/experiment.model.js");
const cellData2 = require("../data/mockData.js").dataMethylene;
const cellData3 = require("../data/mockData.js").dataLens;
const axios = require("axios");

class ImageService {
  // add normal image with normal lens
  static async addImage(measurementId, image, name) {
    if (!measurementId) throw new BadRequestError("Measurement ID is required");
    if (!image) throw new BadRequestError("Images are required");
    if (!image.mimetype.startsWith("image/")) {
      throw new BadRequestError("Uploaded file is not an image");
    }

    const measurement = await measurementModel.findById(measurementId);
    if (!measurement) throw new NotFoundError("Measurement not found");

    // Tạo trước document ảnh với status "initial"
    const tempImage = await imageModel.create({
      name: name,
      filename: "", // tạm thời chưa có
      originalImage: "",
      measurementId: measurementId,
      bacteriaData: null,
      status: "initial",
    });

    try {
      // Tải ảnh lên thư mục uploads
      const uploadDir = path.join(__dirname, "../uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const originalFilename = `${Date.now()}-${image.originalname}`;
      const originalPath = path.join(uploadDir, originalFilename);
      await fs.promises.writeFile(originalPath, image.buffer);

      // Gửi ảnh + imageId cho API AI
      const imageBase64 = image.buffer.toString("base64");

      const response = await axios.post(
        "http://45.117.177.126:7000/submit_image",
        {
          image_id: tempImage._id.toString(),
          base64_image: imageBase64,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Response from AI API:", response.data);

      // Nếu API xử lý thành công và trả về trạng thái processing
      if (response.status === 200 && response.data.status === "processing") {
        // Cập nhật thông tin ảnh đã đầy đủ
        tempImage.filename = originalFilename;
        tempImage.originalImage = `/uploads/${originalFilename}`;
        tempImage.status = "pending";
        await tempImage.save();

        // Đưa vào hàng đợi xử lý
        const job = await imageProcessingQueue.add({ imageId: tempImage._id });
        console.log("Job added to queue:", job.id);

        return {
          image: tempImage,
          jobId: job.id,
        };
      } else {
        // Xóa document ảnh tạm nếu API không chấp nhận
        await imageModel.findByIdAndDelete(tempImage._id);
        throw new Error(
          "Image submission to AI API failed or returned unexpected status."
        );
      }
    } catch (err) {
      // Nếu có lỗi trong quá trình xử lý, cũng xoá ảnh tạm
      await imageModel.findByIdAndDelete(tempImage._id);
      throw err;
    }
  }

  static async processImage2(imageId) {
    if (!imageId) throw new BadRequestError("Image ID is required");

    const image = await imageModel.findById(imageId);
    if (!image) throw new NotFoundError("Image not found");

    const measurement = await measurementModel.findById(image.measurementId);
    if (!measurement) throw new NotFoundError("Measurement not found");

    if (image.status !== "pending") return image;

    try {
      if (measurement.lensType === "thường") {
        if (measurement.imageType === "thường") {
          // Gọi API để polling kết quả AI
          let result = null;
          const maxRetries = 20;
          const delay = 5000;

          for (let attempt = 0; attempt < maxRetries; attempt++) {
            const response = await axios.post(
              "http://45.117.177.126:7000/request_image_id",
              { image_id: imageId }
            );

            if (response.status === 200 && response.data.status === "done") {
              result = response.data.result;
              break;
            }

            if (response.data.status === "processing") {
              await new Promise((resolve) => setTimeout(resolve, delay));
            } else {
              throw new Error(
                "Unexpected AI response status: " + response.data.status
              );
            }
          }

          if (!result || !Array.isArray(result.bounding_boxes)) {
            throw new BadRequestError("Invalid result from AI processing");
          }

          const bacteriaData = result.bounding_boxes.map((box) => {
            const [x1, y1, x2, y2] = box.bbox;
            return {
              cell_id: box.id,
              x: x1,
              y: y1,
              width: x2 - x1,
              height: y2 - y1,
              type: box.type,
            };
          });
          // Tạo thư mục uploads nếu chưa có (nếu chưa thực hiện)
          const uploadDir = path.join(__dirname, "../uploads");
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }

          // Giải mã và lưu ảnh mask
          if (result.mask_img) {
            const base64Data = result.mask_img.replace(
              /^data:image\/\w+;base64,/,
              ""
            );
            const buffer = Buffer.from(base64Data, "base64");

            const maskFilename = `${Date.now()}-${image._id}-mask.png`;
            const maskPath = path.join(uploadDir, maskFilename);
            await fs.promises.writeFile(maskPath, buffer);

            // Lưu đường dẫn vào DB (đường dẫn public từ client có thể truy cập được)
            image.maskImage = `/uploads/${maskFilename}`;
          }

          image.bacteriaData = bacteriaData;
          image.status = "completed";
          await image.save();
          return image;
        }

        // Các trường hợp imageType khác, vẫn xử lý bình thường
        let bounding_boxes;
        if (measurement.imageType === "methylene") {
          bounding_boxes = cellData2;
        } else {
          throw new BadRequestError("Unsupported image type");
        }

        if (!bounding_boxes) {
          throw new BadRequestError(
            "Bounding boxes data not found for the given image type"
          );
        }

        const bacteriaData = bounding_boxes.map((bbox) => ({
          cell_id: bbox.cell_id,
          x: bbox.x,
          y: bbox.y,
          width: bbox.width,
          height: bbox.height,
          type: bbox.type,
        }));

        image.bacteriaData = bacteriaData;
        image.status = "completed";
        await image.save();
        return image;
      }

      if (measurement.lensType === "buồng đếm") {
        const bounding_boxes = cellData3;

        if (!bounding_boxes) {
          throw new BadRequestError(
            "Bounding boxes data not found for counting chamber"
          );
        }

        const bacteriaData = bounding_boxes.map((bbox) => ({
          cell_id: bbox.cell_id,
          x: bbox.x,
          y: bbox.y,
          width: bbox.width,
          height: bbox.height,
        }));

        image.points = points || [];
        image.bacteriaData = bacteriaData;
        image.status = "completed";
        await image.save();
        return image;
      }

      throw new BadRequestError("Unsupported lens type");
    } catch (error) {
      image.status = "failed";
      await image.save();
      throw error;
    }
  }
  static async processImage(imageId) {
    if (!imageId) throw new BadRequestError("Image ID is required");

    const image = await imageModel.findById(imageId);
    if (!image) throw new NotFoundError("Image not found");

    const measurement = await measurementModel.findById(image.measurementId);
    if (!measurement) throw new NotFoundError("Measurement not found");

    if (image.status !== "pending") return image;

    try {
      if (measurement.imageType === "thường") {
        let result = null;
        const maxRetries = 20;
        const delay = 5000;

        for (let attempt = 0; attempt < maxRetries; attempt++) {
          const response = await axios.post(
            "http://45.117.177.126:7000/request_image_id",
            { image_id: imageId }
          );

          if (response.status === 200 && response.data.status === "done") {
            result = response.data.result;
            break;
          }

          if (response.data.status === "processing") {
            await new Promise((resolve) => setTimeout(resolve, delay));
          } else {
            throw new Error(
              "Unexpected AI response status: " + response.data.status
            );
          }
        }

        if (!result || !Array.isArray(result.bounding_boxes)) {
          throw new BadRequestError("Invalid result from AI processing");
        }

        const bacteriaData = result.bounding_boxes.map((box) => {
          const [x1, y1, x2, y2] = box.bbox;
          return {
            cell_id: box.id,
            x: x1,
            y: y1,
            width: x2 - x1,
            height: y2 - y1,
            type: box.type,
          };
        });
        // Tạo thư mục uploads nếu chưa có (nếu chưa thực hiện)
        const uploadDir = path.join(__dirname, "../uploads");
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Giải mã và lưu ảnh mask
        if (result.mask_img) {
          const base64Data = result.mask_img.replace(
            /^data:image\/\w+;base64,/,
            ""
          );
          const buffer = Buffer.from(base64Data, "base64");

          const maskFilename = `${Date.now()}-${image._id}-mask.png`;
          const maskPath = path.join(uploadDir, maskFilename);
          await fs.promises.writeFile(maskPath, buffer);

          // Lưu đường dẫn vào DB (đường dẫn public từ client có thể truy cập được)
          image.maskImage = `/uploads/${maskFilename}`;
        }

        if (measurement.lensType === "buồng đếm") {
          const imagePath = path.join(__dirname, "..", image.originalImage);

          if (!fs.existsSync(imagePath)) {
            throw new NotFoundError("Original image file not found");
          }

          const imageBuffer = await fs.promises.readFile(imagePath);
          const imageBase64 = imageBuffer.toString("base64");
          const response = await axios.post(
            "http://45.117.177.126:8003/upload_image/yeast_count",
            {
              image_id: image._id.toString(),
              base64_image: imageBase64,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          console.log("Response from yeast count API:", response.data);
          if (
            response.status === 200 &&
            response.data &&
            Array.isArray(response.data.squares)
          ) {
            const squares = response.data.squares;
            const rows = 4;
            const cols = 4;

            const pointGrid = Array.from({ length: rows + 1 }, () =>
              Array(cols + 1).fill(null)
            );

            for (let row = 0; row < rows; row++) {
              for (let col = 0; col < cols; col++) {
                const index = row * cols + col;
                const square = squares[index];
                if (!square || square.coordinates.length !== 4) continue;

                const [p0, p1, p2, p3] = square.coordinates;

                pointGrid[row][col] = pointGrid[row][col] || p0;
                pointGrid[row][col + 1] = pointGrid[row][col + 1] || p1;
                pointGrid[row + 1][col + 1] = pointGrid[row + 1][col + 1] || p2;
                pointGrid[row + 1][col] = pointGrid[row + 1][col] || p3;
              }
            }

            const points = [];
            for (let row = 0; row <= rows; row++) {
              for (let col = 0; col <= cols; col++) {
                const pt = pointGrid[row][col];
                if (pt) points.push({ x: pt.x, y: pt.y });
              }
            }

            image.points = points;
          }
        }

        image.bacteriaData = bacteriaData;
        image.status = "completed";
        await image.save();
        return image;
      }
      if (measurement.imageType === "methylene") {
        const bounding_boxes = cellData2;
        bacteriaData = bounding_boxes.map((bbox) => ({
          cell_id: bbox.cell_id,
          x: bbox.x,
          y: bbox.y,
          width: bbox.width,
          height: bbox.height,
          type: bbox.type,
        }));
        image.bacteriaData = bacteriaData;
        image.status = "completed";
        await image.save();
        return image;
      }

      // ===== LOẠI ẢNH KHÔNG HỖ TRỢ =====
      else {
        throw new BadRequestError("Unsupported image type");
      }
    } catch (error) {
      image.status = "failed";
      await image.save();
      throw error;
    }
  }

  static async getImageById(imageId) {
    if (!imageId) throw new BadRequestError("Image ID is required");
    const image = await imageModel
      .findById(imageId)
      .populate({
        path: "measurementId",
        select: "name imageType lensType experimentId",
        populate: {
          path: "experimentId",
          select: "title",
        },
      })
      .lean();
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

  static async findImagesByUserIdPage(userId, { page = 1, limit = 10 }) {
    if (!userId) throw new BadRequestError("User ID is required");
    const foundUser = await userModel.findById(userId);
    if (!foundUser) throw new NotFoundError("User not found");
    const experiment = await experimentModel
      .find({ userId: userId })
      .select("_id")
      .lean();
    if (!experiment || experiment.length === 0)
      throw new NotFoundError("Experiment not found");
    const experimentIds = experiment.map((e) => e._id);
    const measurement = await measurementModel
      .find({ experimentId: { $in: experimentIds } })
      .select("_id")
      .lean();
    if (!measurement || measurement.length === 0)
      throw new NotFoundError("Measurement not found");
    const measurementIds = measurement.map((m) => m._id);
    const [images, total] = await Promise.all([
      imageModel
        .find({ measurementId: { $in: measurementIds } })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate({
          path: "measurementId",
          select: "name experimentId", // lấy name và khóa ngoại
          populate: {
            path: "experimentId",
            select: "title", // lấy title của experiment
          },
        })
        .lean(),
      imageModel
        .find({ measurementId: { $in: measurementIds } })
        .countDocuments(),
    ]);
    if (!images || images.length === 0)
      throw new NotFoundError("Images not found");
    return {
      images,
      total,
      page,
      limit,
    };
  }

  static async findImagesOfUser(
    userId,
    { name, experimentId, measurementId, page = 1, limit = 10 }
  ) {
    if (!userId) throw new BadRequestError("User ID is required");

    const foundUser = await userModel.findById(userId);
    if (!foundUser) throw new NotFoundError("User not found");

    const experiment = await experimentModel
      .find({ userId })
      .select("_id")
      .lean();

    if (!experiment || experiment.length === 0)
      throw new NotFoundError("Experiment not found");

    const experimentIds = experiment.map((e) => e._id);

    let filteredExperimentIds = experimentIds;
    if (experimentId) {
      const experimentIdStr = experimentId.toString();
      const experimentIdsStr = experimentIds.map((id) => id.toString());
      if (!experimentIdsStr.includes(experimentIdStr)) {
        throw new BadRequestError("Invalid experiment ID for this user");
      }
      filteredExperimentIds = [experimentId];
    }

    const measurement = await measurementModel
      .find({ experimentId: { $in: filteredExperimentIds } })
      .select("_id")
      .lean();

    if (!measurement || measurement.length === 0)
      throw new NotFoundError("Measurement not found");
    const measurementIds = measurement.map((m) => m._id);

    let filteredMeasurementIds = measurementIds;
    if (measurementId) {
      const measurementIdStr = measurementId.toString();
      const measurementIdsStr = measurementIds.map((id) => id.toString());
      if (!measurementIdsStr.includes(measurementIdStr)) {
        throw new BadRequestError("Invalid measurement ID for this experiment");
      }
      filteredMeasurementIds = [measurementId];
    }
    const query = {
      measurementId: { $in: filteredMeasurementIds },
    };

    const escapeRegex = (text) => {
      return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    };

    if (name && name.trim()) {
      const safeName = escapeRegex(name.trim());
      query.name = { $regex: safeName, $options: "i" };
    }

    const skip = (page - 1) * limit;

    const [images, total] = await Promise.all([
      imageModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .populate({
          path: "measurementId",
          select: "name experimentId",
          populate: {
            path: "experimentId",
            select: "title",
          },
        })
        .lean(),
      imageModel.find(query).countDocuments(),
    ]);

    if (!images) throw new NotFoundError("Images not found");

    return {
      images,
      total,
      page,
      limit,
    };
  }

  static async getImagesInFactoryOfManager(userId, { page = 1, limit = 10 }) {
    if (!userId) throw new BadRequestError("User ID is required");
    const foundUser = await userModel.findById(userId);
    if (!foundUser) throw new NotFoundError("User not found");
    const users = await userModel
      .find({ factoryId: foundUser.factoryId, role: "employee" })
      .select("_id")
      .lean();
    if (!users) throw new NotFoundError("Users not found");
    const userIds = users.map((user) => user._id);
    const experiment = await experimentModel
      .find({ userId: { $in: userIds } })
      .select("_id")
      .lean();
    if (!experiment) throw new NotFoundError("Experiment not found");
    const experimentIds = experiment.map((e) => e._id);
    const measurement = await measurementModel
      .find({ experimentId: { $in: experimentIds } })
      .select("_id")
      .lean();
    if (!measurement) throw new NotFoundError("Measurement not found");
    const measurementIds = measurement.map((m) => m._id);
    const [images, total] = await Promise.all([
      imageModel
        .find({ measurementId: { $in: measurementIds } })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate({
          path: "measurementId",
          select: "name experimentId",
          populate: {
            path: "experimentId",
            select: "title",
            populate: {
              path: "userId",
              select: "name",
            },
          },
        })
        .lean(),
      imageModel
        .find({ measurementId: { $in: measurementIds } })
        .countDocuments(),
    ]);
    if (!images) throw new NotFoundError("Images not found");
    return {
      images,
      total,
      page,
      limit,
    };
  }

  static async searchImagesInFactoryOfManager(
    userId,
    { name, employeeId, experimentId, measurementId, page = 1, limit = 10 }
  ) {
    if (!userId) throw new BadRequestError("User ID is required");

    const foundUser = await userModel.findById(userId);
    if (!foundUser) throw new NotFoundError("User not found");

    let experimentUserIds = [];

    // Nếu có employeeId → kiểm tra hợp lệ và sử dụng
    if (employeeId) {
      const employee = await userModel
        .findOne({
          _id: employeeId,
          factoryId: foundUser.factoryId,
          role: "employee",
        })
        .lean();

      if (!employee) {
        throw new BadRequestError(
          "Employee không hợp lệ hoặc không cùng nhà máy"
        );
      }

      experimentUserIds = [employeeId];
    } else {
      // Lấy tất cả user là employee trong cùng nhà máy
      const employees = await userModel
        .find({
          factoryId: foundUser.factoryId,
          role: "employee",
        })
        .select("_id")
        .lean();

      experimentUserIds = employees.map((u) => u._id);
    }

    const experiment = await experimentModel
      .find({ userId: { $in: experimentUserIds } })
      .select("_id")
      .lean();

    if (!experiment || experiment.length === 0)
      throw new NotFoundError("Experiment not found");

    const experimentIds = experiment.map((e) => e._id);

    let filteredExperimentIds = experimentIds;
    if (experimentId) {
      const experimentIdStr = experimentId.toString();
      const experimentIdsStr = experimentIds.map((id) => id.toString());
      if (!experimentIdsStr.includes(experimentIdStr)) {
        throw new BadRequestError("Invalid experiment ID for this user");
      }
      filteredExperimentIds = [experimentId];
    }

    const measurement = await measurementModel
      .find({ experimentId: { $in: filteredExperimentIds } })
      .select("_id")
      .lean();

    if (!measurement || measurement.length === 0)
      throw new NotFoundError("Measurement not found");
    const measurementIds = measurement.map((m) => m._id);

    let filteredMeasurementIds = measurementIds;
    if (measurementId) {
      const measurementIdStr = measurementId.toString();
      const measurementIdsStr = measurementIds.map((id) => id.toString());
      if (!measurementIdsStr.includes(measurementIdStr)) {
        throw new BadRequestError("Invalid measurement ID for this experiment");
      }
      filteredMeasurementIds = [measurementId];
    }
    const query = {
      measurementId: { $in: filteredMeasurementIds },
    };

    const escapeRegex = (text) => {
      return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    };

    if (name && name.trim()) {
      const safeName = escapeRegex(name.trim());
      query.name = { $regex: safeName, $options: "i" };
    }

    const skip = (page - 1) * limit;

    const [images, total] = await Promise.all([
      imageModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .populate({
          path: "measurementId",
          select: "name experimentId",
          populate: {
            path: "experimentId",
            select: "title",
            populate: {
              path: "userId",
              select: "name",
            },
          },
        })
        .lean(),
      imageModel.find(query).countDocuments(),
    ]);

    if (!images || images.length === 0)
      throw new NotFoundError("Images not found");

    return {
      images,
      total,
      page,
      limit,
    };
  }

  static async editTypeBacteria(imageId, cell_id, type) {
    if (!imageId) throw new BadRequestError("Image ID is required");
    if (!cell_id) throw new BadRequestError("Cell ID is required");
    if (!type) throw new BadRequestError("Type is required");

    const image = await imageModel.updateOne(
      { _id: imageId, "bacteriaData.cell_id": cell_id },
      { $set: { "bacteriaData.$.editType": type } }
    );
    if (image.modifiedCount === 0) {
      throw new NotFoundError("Image or cell not found");
    }
    return { message: "Type updated successfully" };
  }

  static async reportBacteria(imageId, cell_id, wrongType, wrongBox) {
    if (!imageId) throw new BadRequestError("Image ID is required");
    if (!cell_id) throw new BadRequestError("Cell ID is required");

    const image = await imageModel.updateOne(
      { _id: imageId, "bacteriaData.cell_id": cell_id },
      {
        $set: {
          "bacteriaData.$.wrongType": wrongType,
          "bacteriaData.$.wrongBox": wrongBox,
        },
      }
    );
    if (image.modifiedCount === 0) {
      throw new NotFoundError("Image or cell not found");
    }
    return { message: "Report successfully" };
  }
  static async updateInfoBacteria(imageId, cell_id) {
    if (!imageId) throw new BadRequestError("Image ID is required");
    if (!cell_id) throw new BadRequestError("Cell ID is required");

    const image = await imageModel.findById(imageId);
    if (!image) throw new NotFoundError("Image not found");

    const existingCell = image.bacteriaData.find(
      (cell) => cell.cell_id === cell_id
    );
    if (!existingCell) throw new NotFoundError("Cell not found in image");

    // ⚠️ Nếu đã cập nhật thì bỏ qua
    if (existingCell.statusCell === "updated") {
      return existingCell; // hoặc trả về existingCell nếu bạn muốn
    }

    const response = await axios.post(
      "http://45.117.177.126:7000/compute_features",
      { image_id: imageId, cell_id: cell_id }
    );

    if (response.status !== 200 || !response.data) {
      throw new BadRequestError("Failed to compute features for the cell");
    }

    const cellData = response.data.cell_info;

    const bbox = {
      x: existingCell.x,
      y: existingCell.y,
      width: existingCell.width,
      height: existingCell.height,
    };

    const imagePath = path.join(
      __dirname,
      "..",
      image.originalImage.replace(/^\/+/, "")
    );
    const sizeInKB = fs.statSync(imagePath).size / 1024;
    console.log(">>> Image file size (KB):", sizeInKB);

    console.log(">>> Reading from imagePath:", imagePath);

    if (!fs.existsSync(imagePath)) {
      throw new Error("Image file does not exist: " + imagePath);
    }

    const base64Image = await this.drawContourToBase64(
      imagePath,
      bbox,
      cellData.contour
    );
    console.log(">>> base64Image length:", base64Image?.length);
    console.log(">>> bbox:", bbox);
    console.log(">>> First 3 contour points:", cellData.contour.slice(0, 3));

    const updateFields = {
      "bacteriaData.$[cell].area": cellData.area,
      "bacteriaData.$[cell].perimeter": cellData.perimeter,
      "bacteriaData.$[cell].circularity": cellData.circularity,
      "bacteriaData.$[cell].convexity": cellData.convexity,
      "bacteriaData.$[cell].CE_diameter": cellData.CE_diameter,
      "bacteriaData.$[cell].major_axis_length": cellData.major_axis_length,
      "bacteriaData.$[cell].minor_axis_length": cellData.minor_axis_length,
      "bacteriaData.$[cell].aspect_ratio": cellData.aspect_ratio,
      "bacteriaData.$[cell].max_distance": cellData.max_distance,
      "bacteriaData.$[cell].image": base64Image,
      "bacteriaData.$[cell].statusCell": "updated",
    };

    const updatedImage = await imageModel.findByIdAndUpdate(
      imageId,
      { $set: updateFields },
      {
        arrayFilters: [{ "cell.cell_id": existingCell.cell_id }],
        new: true,
      }
    );

    if (!updatedImage) {
      throw new NotFoundError("Failed to update cell information");
    }

    const updateCell = updatedImage.bacteriaData.find(
      (cell) => cell.cell_id === cell_id
    );

    return updateCell;
  }

  static async drawContourToBase64(imagePath, bbox, contour) {
    if (!imagePath || !bbox || !contour?.length) return null;

    const { createCanvas, loadImage } = require("canvas");

    try {
      const img = await loadImage(imagePath); // Load ảnh gốc

      // Tạo canvas full size theo ảnh gốc
      const fullCanvas = createCanvas(img.width, img.height);
      const fullCtx = fullCanvas.getContext("2d");

      // Vẽ ảnh gốc
      fullCtx.drawImage(img, 0, 0);

      // Vẽ contour lên ảnh gốc với màu đen nhạt
      fullCtx.strokeStyle = "rgba(0, 0, 0, 0.5)";
      fullCtx.lineWidth = 2;
      fullCtx.beginPath();
      fullCtx.moveTo(contour[0].x, contour[0].y);
      contour.slice(1).forEach((pt) => {
        fullCtx.lineTo(pt.x, pt.y);
      });
      fullCtx.closePath();
      fullCtx.stroke();

      const debugPath = path.join(__dirname, "debug_full_with_contour.png");
      const out = fs.createWriteStream(debugPath);
      const stream = fullCanvas.createPNGStream();
      stream.pipe(out);
      out.on("finish", () =>
        console.log("🖼️ Full image with contour saved:", debugPath)
      );

      // Cắt ảnh từ canvas gốc sau khi đã vẽ contour
      const { x, y, width, height } = bbox;
      const croppedCanvas = createCanvas(width, height);
      const croppedCtx = croppedCanvas.getContext("2d");

      croppedCtx.drawImage(
        fullCanvas,
        x,
        y,
        width,
        height,
        0,
        0,
        width,
        height
      );

      // Xuất ra base64
      const base64 = croppedCanvas.toDataURL().split(",")[1];
      console.log("✅ Image with contour cropped, length:", base64.length);
      return base64;
    } catch (error) {
      console.error("❌ Error drawing contour:", error.message);
      return null;
    }
  }

  static async drawContourToBase642(imagePath, bbox, contour) {
    if (!imagePath || !bbox || !contour?.length) return null;

    const { createCanvas, loadImage } = require("canvas");

    try {
      const img = await loadImage(imagePath); // Load ảnh gốc

      const { x, y, width, height } = bbox;

      const croppedCanvas = createCanvas(width, height);
      const croppedCtx = croppedCanvas.getContext("2d");

      // Cắt đúng theo bbox (không padding)
      croppedCtx.drawImage(img, x, y, width, height, 0, 0, width, height);

      // Vẽ contour trực tiếp với màu đen nhạt
      croppedCtx.strokeStyle = "rgba(0, 0, 0, 0.5)";
      croppedCtx.lineWidth = 2;
      croppedCtx.beginPath();
      croppedCtx.moveTo(contour[0].x, contour[0].y);
      contour.slice(1).forEach((pt) => {
        croppedCtx.lineTo(pt.x, pt.y);
      });
      croppedCtx.closePath();
      croppedCtx.stroke();

      const base64 = croppedCanvas.toDataURL().split(",")[1];
      console.log("✅ Image generated, length:", base64.length);
      return base64;
    } catch (error) {
      console.error("❌ Error drawing contour:", error.message);
      return null;
    }
  }
}

module.exports = ImageService;
