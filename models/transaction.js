const mongoose = require("mongoose");

const trans = new mongoose.Schema(
  {
    userId: { type: String, require: true },
    amount: { type: Number, require: true },
    username: { type: String, require: true },
    Details: { type: String, require: true },
    fromName: { type: String, require: true },
  },
  { timestamps: true }
);

const transactions = mongoose.model("transactions", trans);

module.exports = transactions;
