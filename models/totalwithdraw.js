const mongoose = require("mongoose");

const withdraw = new mongoose.Schema(
  {
    userId: { type: String, require: true },
    amount: { type: Number, require: true },
  },
  { timestamps: true }
);

const Totalwithdraw = mongoose.model("totalWithdraw", withdraw);

module.exports = Totalwithdraw;
