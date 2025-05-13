const Bull = require('bull');
const { REDIS_URL } = process.env;

const imageProcessingQueue = new Bull('image-processing', {
  redis: REDIS_URL || 'redis://redis:6379',
  settings: {
    stalledInterval: 30000, // 30s
    maxStalledCount: 2
  }
});

// Event monitoring
imageProcessingQueue
  .on('active', (job) => console.log(`Job ${job.id} started`))
  .on('completed', (job) => console.log(`Job ${job.id} completed`))
  .on('failed', (job, err) => console.error(`Job ${job.id} failed:`, err));

module.exports = imageProcessingQueue;