const mongoose = require("mongoose");

const withdraw = new mongoose.Schema(
  {
    userId: { type: String, require: true },
    amount: { type: Number, require: true },
  },
  { timestamps: true }
);

const totalwithdraww = mongoose.model("totalWithdraw", withdraw);

module.exports = totalwithdraww;
