const adminSettings = require("../../models/adminSettings");
exports.settings = async (req, res, next) => {
  try {
    let { withdrawCommission, level1, level2, level3, ROI } = req.body;
    
    let user = req.user.user;
    if (user.role != 1)
      return res
        .status(400)
        .json({ error: "Only admin can perform this action" });

    let settings = await adminSettings.find();
    if (!withdrawCommission) withdrawCommission = settings.withdrawCommission;
    if (!level1) level1 = settings.level1;
    if (!level2) level2 = settings.level2;
    if (!level3) level3 = settings.level3;
    if (!ROI) ROI = settings.ROI;
    if (settings) {
      let update = await adminSettings.findOneAndUpdate({
        $set: { withdrawCommission, level1, level2, level3, ROI },
      });
      if (update) {
        return res.status(200).json({ message: "Data Updated" });
      } else {
        return res.status(400).json({ error: "Internel Server Error" });
      }
    } else res.status(400).json({ message: "Request not found" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.fetchSetting = async (req, res, next) => {
  try {
    let user = req.user.user;
    if (!user) return res.status(404).json({ error: "User Not Found" });

    let settings = await adminSettings.find();
    if (settings) res.status(200).json({ result: settings });
    else res.status(404).json({ result: "Data not Found" });
  } catch (err) {
    next(err);
    console.log("err", err);
  }
};
