const mongoose = require("mongoose");

const Income = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    username: { type: String, default: "" },
    receiveFrom: { type: String },
    amount: { type: Number },
    Level: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const levelIncome = mongoose.model("levelIncome", Income);

module.exports = levelIncome;
