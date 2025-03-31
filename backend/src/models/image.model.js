'use strict'

const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
    filename: { type: String, required: true }, // Tên file
    file_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "fs.files" }, // Liên kết với GridFS
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Ai đã tải lên
    measurementId: { type: mongoose.Schema.Types.ObjectId, ref: "Measurement", required: true }, // Thuộc về lần đođo nào
    uploadedAt: { type: Date, default: Date.now }, // Ngày tải lên
    bacteriaData: [ // Dữ liệu vi khuẩn phân tích từ API
        {
            x: Number,
            y: Number,
            width: Number,
            height: Number,
            status: { type: String, enum: ["normal", "dead", "cluster"] } // Trạng thái vi khuẩn
        }
    ]
});

module.exports = mongoose.model("Image", ImageSchema);
