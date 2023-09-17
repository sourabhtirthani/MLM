const mongoose = require("mongoose");

const Transfers = new mongoose.Schema(
  {
    username: { type: String, required: true },
    fromUserId: { type: String, required: true },
    toUserId: { type: String, required: true },
    amount: { type: Number, required: true },
  },
  { timestamps: true }
);

const Transfer = mongoose.model("Transfer", Transfers);

module.exports = Transfer;
