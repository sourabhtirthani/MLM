const investment = require("../models/Investment");

const calclulateRewads = async (userId) => {
  let userInfo = await investment.findOne({ userId });
  console.log(userInfo, "userInfo");

  let timedifference =
    Math.floor(Date.now() / 1000) - new Date(userInfo.timestamps);
  console.log(timedifference, "timedifference");
  let totalRewards = userInfo.amount * ((8 / 30) * 86400) * timedifference;
  console.log("totalRewards", totalRewards);
  totalRewards += userInfo.rewards;
};

module.exports = calclulateRewads;
