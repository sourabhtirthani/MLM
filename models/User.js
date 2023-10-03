const mongoose = require("mongoose");

const Users = new mongoose.Schema(
  {
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    mobileNo: { type: String, require: true },
    username: { type: String, required: true, unique: true },
    userId: { type: String, required: true, unique: true },
    refferBy: { type: String, required: false },
    refferedTo: [{ type: String }],
    isInvested: { type: Boolean, default: false },
    mainWallet: { type: Number, default: 0 },
    otp: { type: String, require: false },
    investmentWallet: { type: Number, default: 0 },
    isEmailVerified: { type: Boolean, default: false },
    token: { type: String, required: false },
    role: { type: Number, default: 0 },
    block: { type: Boolean, default: false },
    bankName: { type: String, default: "" },
    accounttype: { type: String, default: "" },
    accountNumber: { type: String, default: "" },
    IFSCCode: { type: String, default: "" },
    UsdtAddress: { type: String, default: "" },
    photo: { type: String, default: "" },
  },
  { timestamps: true }
);

const User = mongoose.model("User", Users);

module.exports = User;
