const express = require('express');
const app = express();

app.use(express.json());

// Route imports 
const product = require("./routes/productRoute.js");
app.use("/api/v1", product);

// middleware for error messages

const errorMiddleware = require('./middlewares/error.js')
app.use(errorMiddleware)

module.exports = app;