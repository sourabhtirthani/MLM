const mongoose = require("mongoose");

const OTPs = new mongoose.Schema(
  {
    email: { type: String, required: true },
    otp:{type:Number,require:true}
  },
  { timestamps: true }
);

const OTP = mongoose.model("OTP", OTPs);

module.exports = OTP;
