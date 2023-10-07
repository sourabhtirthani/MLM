const {
  calclulateRewads,
  calclulateRewadsPerDay,
  CalclulateLevelIncome,
  calclulateMembers,
  WithDrawDetails,
  totalROIForAdmin,
  totalLEVELForAdmin,
} = require("../../helpers/calclulateRewards");
const calclulateRewardsForBigLag = require("../../helpers/calclulateBiglagRewads");
const investment = require("../../models/Investment");
const User = require("../../models/User");
const { allusers } = require("./usersSection");
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
  let income = Number(totalRoI) + Number(levelIncome) + Number(withdrawDetail);
  if (!(income < Number(2) * Number(amount))) {
    income = Number(2) * Number(amount);
  }

  //===============================================
  let newincome = Number(totalRoI) + Number(levelIncome);
  if (!(newincome < 2 * Number(amount)))
    newincome = 2 * Number(amount) - Number(withdrawDetail);
  else newincome = Number(newincome) - Number(withdrawDetail);
  //====================================================

  let allUser = await User.find({});
  console.log(allUser.length);
  let allActiveMembers = Number(0);
  let allDeactiveMembers = Number(0);
  for (let i = 0; i < allusers.length; i++) {
    //console.log(allusers[i]);
    // if (allusers[i].isInvested) allActiveMembers += 1;
    // else allDeactiveMembers += 1;
  }
  console.log("allDeactiveMembers", allDeactiveMembers);
  console.log("allActiveMembers", allActiveMembers);
  let totalROIAdmin = await totalROIForAdmin();
  let totalLEVELAdmin = await totalLEVELForAdmin();
  totalinvestment = amount;
  dashboardInfo["memberDeatils"] = memberDeatils;
  dashboardInfo["todayROI"] = todayROI;
  dashboardInfo["totalRoI"] = totalRoI;
  dashboardInfo["levelIncome"] = levelIncome;
  dashboardInfo["withdrawDetail"] = withdrawDetail;
  dashboardInfo["totalIncome"] = income;
  dashboardInfo["totalinvestment"] = totalinvestment;
  dashboardInfo["rewardIncome"] = rewardIncome;
  dashboardInfo["totalROIAdmin"] = totalROIAdmin;
  dashboardInfo["totalLEVELAdmin"] = totalLEVELAdmin;
  dashboardInfo["avaibalance"] = newincome;
  dashboardInfo["totalmembersInfoForadmin"] = allUser.length;
  res.status(200).json({ result: dashboardInfo });
};
