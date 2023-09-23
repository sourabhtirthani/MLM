const Withdraw = require("../../models/withdrawal");
const {
  calclulateRewads,
  calclulateRewadsPerDay,
  CalclulateLevelIncome,
  calclulateMembers,
  WithDrawDetails,
} = require("../../helpers/calclulateRewards");
const investment = require("../../models/Investment");
exports.userDashboard = async (req, res) => {
  let user = req.user.user;
  const userId = user.userId;
  let dashboardInfo = {};
  const memberDeatils = await calclulateMembers(userId);
  const todayROI = await calclulateRewadsPerDay(userId);
  const totalRoI = await calclulateRewads(userId);
  const levelIncome = await CalclulateLevelIncome(userId);
  const withdrawDetail = await WithDrawDetails(userId);
  let totalinvestment = await investment.findOne({ userId });
  totalinvestment = totalinvestment.amount;
  dashboardInfo["memberDeatils"] = memberDeatils;
  dashboardInfo["todayROI"] = todayROI;
  dashboardInfo["totalRoI"] = totalRoI;
  dashboardInfo["levelIncome"] = levelIncome;
  dashboardInfo["withdrawDetail"] = withdrawDetail;
  dashboardInfo["totalIncome"] = Number(totalRoI) + Number(levelIncome);
  dashboardInfo["totalinvestment"] = totalinvestment;

  res.status(200).json({ result: dashboardInfo });
};
