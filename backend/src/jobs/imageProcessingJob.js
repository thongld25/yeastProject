const imageProcessingQueue = require('../queue');
const Measurement = require('../models/measurement.model');
const MeasurementService = require('../services/measurement.service');
const ImageService = require('../services/image.service');

// Cấu hình Bull để xử lý job
imageProcessingQueue.process(async (job) => {
  const { imageId } = job.data;
  try {
    // 1. Gọi API bên ngoài để xử lý hình ảnh
    await ImageService.processImage(imageId);
    console.log('Image processing completed');
  } catch (error) {
    console.error('Error processing image:', error);
    throw new Error('Image processing failed');
  }
});

module.exports = imageProcessingQueue;
