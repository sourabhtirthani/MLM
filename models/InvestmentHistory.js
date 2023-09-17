const mongoose = require("mongoose");

const investments = new mongoose.Schema(
  {
    userId: { type: String, require: true },
    investerId: { type: String, require: true },
    amount: { type: Number, require: true },
    fromUsername: { type: String, require: true },
    toUsername: { type: String, require: true },
  },
  { timestamps: true }
);

const investment = mongoose.model("investment", investments);

module.exports = investment;
