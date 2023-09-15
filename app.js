const express = require("express");
const bodyParser = require("body-parser");
const userRouter = require("./routes/user.js");
const app = express();

//defining port number
const PORT = 3001;

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/users", userRouter);

app.listen(PORT, () => {
  console.log(`Server is listing on ${PORT}`);
});
