const mongoose = require("mongoose");

const investments = new mongoose.Schema(
  {
    id: { type: Number, unique: true, require: true },
    userId: { type: String, require: true },
    investedWallet: { type: String, require: true },
    investerWallet: { type: String, require: true },
    amount: { type: Number, require: true },
  },
  { timestamps: true }
);

const investment = mongoose.model("investment", investments);

module.exports = investment;
