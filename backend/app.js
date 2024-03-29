const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cookieParser());

// Route imports 
const product = require("./routes/productRoute.js");
const user = require("./routes/userRoutes.js");

app.use("/api/v1", product);
app.use("/api/v1", user);

// middleware for error messages

const errorMiddleware = require('./middlewares/error.js');

app.use(errorMiddleware)

module.exports = app;