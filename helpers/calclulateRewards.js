const investment = require("../models/Investment");

const calclulateRewads = async (userId) => {
  let userInfo = await investment.findOne({ userId });

  let timedifference =Math.floor(Date.now() / 1000) - Math.floor(Date.parse(userInfo.createdAt) / 1000);
  let totalRewards = userInfo.amount * (8 / (30 * 86400)) * timedifference;
  totalRewards += userInfo.rewards;
  return totalRewards;
};

const calclulateRewadsPerDay = async (userId) => {
    let userInfo = await investment.findOne({ userId });
  
    let timedifference =Math.floor(Date.now() / 1000) - Math.floor(Date.parse(userInfo.createdAt) / 1000);
    let totalRewards = userInfo.amount * (8 / ( 86400)) * timedifference;
    totalRewards += userInfo.rewards;
    return totalRewards;
};

module.exports = calclulateRewads;
