const express = require("express");
const bodyParser = require("body-parser");
const userRouter = require("./routes/user.js");
const app = express();
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler.js");
const connectDB = require("./dbconnection");

require("dotenv").config();

//defining port number
const PORT = 3001;

app.use(express.json());
app.use(express.static('public'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));



// CORS POLICIES
let corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  exposedHeaders: ["x-auth-token"],
};
app.use(cors(corsOptions));

// ERROR HANDLER MIDDLEWARE
app.use(errorHandler);
// Handling Errors
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";
  res.status(err.statusCode).json({
    message: err.message,
  });
});

// Routes
app.use("/api/users", userRouter);

app.listen(PORT, () => {
  console.log(`Server is listing on ${PORT}`);
});

// connect database
connectDB();