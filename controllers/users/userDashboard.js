
const {
  calclulateRewads,
  calclulateRewadsPerDay,
  CalclulateLevelIncome,
  calclulateMembers,
  WithDrawDetails,
} = require("../../helpers/calclulateRewards");
const calclulateRewardsForBigLag = require("../../helpers/calclulateBiglagRewads");
const investment = require("../../models/Investment");
exports.userDashboard = async (req, res) => {
  let user = req.user.user;
  const userId = user.userId;
  let dashboardInfo = {};
  const memberDeatils = await calclulateMembers(userId);
  const todayROI = (await calclulateRewadsPerDay(userId))
    ? await calclulateRewadsPerDay(userId)
    : 0;
  const totalRoI = (await calclulateRewads(userId))
    ? await calclulateRewads(userId)
    : 0;
  const levelIncome = await CalclulateLevelIncome(userId);
  const withdrawDetail = await WithDrawDetails(userId);
  let totalinvestment = await investment.findOne({ userId });
  let rewardIncome = await calclulateRewardsForBigLag(userId);
  let amount = 0;
  if (!totalinvestment) {
    amount = 0;
  } else {
    amount = totalinvestment.amount;
  }

  totalinvestment = amount;
  dashboardInfo["memberDeatils"] = memberDeatils;
  dashboardInfo["todayROI"] = todayROI;
  dashboardInfo["totalRoI"] = totalRoI;
  dashboardInfo["levelIncome"] = levelIncome;
  dashboardInfo["withdrawDetail"] = withdrawDetail;
  dashboardInfo["totalIncome"] = Number(totalRoI) + Number(levelIncome);
  dashboardInfo["totalinvestment"] = totalinvestment;
  dashboardInfo["rewardIncome"] = rewardIncome;

  res.status(200).json({ result: dashboardInfo });
};
