const express = require("express");
const morgan = require("morgan");
const { default: helmet } = require("helmet");
const compression = require("compression");
const cors = require("cors");
const path = require("path");

const app = express();

// init cors
app.use(cors());

// init middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}))

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// init db
require('./dbs/init.mongodb');
require('./jobs/imageProcessingJob')

// init routes
app.use("/", require('./routes'));

// error handler
app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        stack: error.stack,
        message: error.message || 'Internal Server Error'
    })
})


module.exports = app;
