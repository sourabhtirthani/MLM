const mongoose = require("mongoose");

const adminSettings = new mongoose.Schema(
  {
    withdrawCommission: { type: Number, require: true, default: 0 },
    level1: { type: Number, require: true, default: 0 },
    level2: { type: Number, require: true, default: 0 },
    level3: { type: Number, require: true, default: 0 },
    ROI: { type: Number, require: true, default: 0 },
  },
  { timestamps: true }
);

const Settings = mongoose.model("settings", adminSettings);

module.exports = Settings;
