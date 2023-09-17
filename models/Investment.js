const mongoose = require("mongoose");

const newinvestments = new mongoose.Schema(
  {
    userId: { type: String, require: true },
    amount: { type: Number, require: true },
    rewards: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const newinvest = mongoose.model("newinvestment", newinvestments);

module.exports = newinvest;
