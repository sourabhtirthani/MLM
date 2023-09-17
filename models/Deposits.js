const mongoose = require("mongoose");

const Deposits = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    message: {type:String,default:""},
    image : {type:String},
    amount:{type:Number},
    status:{type:Number,default:0}
  },
  { timestamps: true }
);

const Deposit = mongoose.model("Deposit", Deposits);

module.exports = Deposit;
