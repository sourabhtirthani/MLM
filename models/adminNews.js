const mongoose = require("mongoose");

const adminNotice = new mongoose.Schema(
  {
    timer: { type: String, default: "" },
    notice : { type: String,default: "" }
  },
  { timestamps: true }
);

const notice = mongoose.model("Notice", adminNotice);

module.exports = notice;
