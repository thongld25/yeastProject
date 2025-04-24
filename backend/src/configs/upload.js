const multer = require("multer");

const storage = multer.memoryStorage(); // dùng bộ nhớ RAM, không lưu ra disk
const upload = multer({ storage });

module.exports = upload;