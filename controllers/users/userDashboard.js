const Withdraw = require("../../models/withdrawal");
const {
  calclulateRewads,
  calclulateRewadsPerDay,
  CalclulateLevelIncome,
  calclulateMembers,
  WithDrawDetails,
} = require("../../helpers/calclulateRewards");
exports.userDashboard = async (req, res) => {
  let user = req.user.user;
  const userId = user.userId;
  let dashboardInfo = {};
  const memberDeatils = await calclulateMembers(userId);
  const todayROI = await calclulateRewadsPerDay(userId);
  const totalRoI = await calclulateRewads(userId);
  const levelIncome = await CalclulateLevelIncome(userId);
  const withdrawDetail = await WithDrawDetails(userId);
  dashboardInfo["memberDeatils"] = memberDeatils;
  dashboardInfo["todayROI"] = todayROI;
  dashboardInfo["totalRoI"] = totalRoI;
  dashboardInfo["levelIncome"] = levelIncome;
  dashboardInfo["withdrawDetail"] = withdrawDetail;

  res.status(200).json({ result: dashboardInfo });
};
