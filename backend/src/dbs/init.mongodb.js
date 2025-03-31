"use strict";

const mongoose = require("mongoose");
const Grid = require("gridfs-stream");
require("dotenv").config();

const connectString = process.env.ATLAS_URI;
const connectStringLocal = `mongodb://127.0.0.1:27017/labdb`;

class Database {
  constructor() {
    this.connect();
  }

  connect() {
    mongoose.set("debug", true);
    mongoose.set("debug", { color: true });

    // console.log(`Attempting to connect to MongoDB at ${connectString}`);

    mongoose
      .connect(connectString)
      .then((conn) => {
        console.log("✅ Database connection successful");

        // Khởi tạo GridFS
        this.gfs = Grid(conn.connection.db, mongoose.mongo);
        this.gfs.collection("uploads"); // Tạo collection để lưu ảnh
      })
      .catch((err) => console.error("❌ Database connection error", err));
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;
