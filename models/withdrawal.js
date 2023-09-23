const mongoose = require("mongoose");

const withdraw = mongoose.Schema(
  {
    userId: { type: String, required: true },
    username: { type: String, required: true },
    amount: { type: Number, required: true },
    address: { type: String, required: true },
    isAccpected: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const withdrawal = mongoose.model("withdraw", withdraw);

module.exports = withdrawal;
