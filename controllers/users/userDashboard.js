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
  const memberDeatils = await calclulateMembers(userId);
  //console.log("memberDeatils", memberDeatils);
  const todayROI = await calclulateRewadsPerDay(userId);
  //   console.log("todayROI", todayROI);
  const totalRoI = await calclulateRewads(userId);
  //   console.log("totalRoI", totalRoI);
  const levelIncome = await CalclulateLevelIncome(userId);
  //   console.log("levelIncome", levelIncome);
  const withdrawDetail = await WithDrawDetails(userId);
  //   console.log("withdrawDetail", withdrawDetail);
};
