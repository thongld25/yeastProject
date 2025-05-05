const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Tạo thư mục nếu chưa có
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.memoryStorage(); // Giữ buffer để xử lý & ghi tay bằng fs.writeFileSync

const upload = multer({ storage });

module.exports = upload;
