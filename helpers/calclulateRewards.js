const investment = require("../models/Investment");
const User = require("../models/User");
const calclulateRewads = async (userId) => {
  let userInfo = await investment.findOne({ userId });

  let timedifference =
    Math.floor(Date.now() / 1000) -
    Math.floor(Date.parse(userInfo.createdAt) / 1000);
  let totalRewards = userInfo.amount * (8 / (30 * 86400)) * timedifference;
  totalRewards += userInfo.rewards;
  return totalRewards;
};

const calclulateRewadsPerDay = async (userId) => {
  let userInfo = await investment.findOne({ userId });

  let timedifference =
    Math.floor(Date.now() / 1000) -
    Math.floor(Date.parse(userInfo.createdAt) / 1000);
  let totalRewards = userInfo.amount * (8 / 86400) * timedifference;
  totalRewards += userInfo.rewards;
  return totalRewards;
};

const CalclulateLevelIncome = async (userId) => {
  let userInfo = await User.findOne({ userId });
  if (userInfo.isInvested) {
    let rewardPerceantege = [5, 2, 1];
    let member, member2, member3;
    let memberInfo, memberInfo2, memberInfo3;
    let memberInvestedAmount, memberInvestedAmount2, memberInvestedAmount3;
    let totalRewards;
    // Level 1
    for (let i = 0; i <= userInfo.refferedTo.length; i++) {
      member = userInfo.refferedTo[i];
      memberInfo = await User.findOne({ member });
      if (memberInfo.isInvested) {
        memberInvestedAmount = await investment.findOne({ userId: member });
        memberInvestedAmount = memberInvestedAmount.amount;
        totalRewards = (memberInvestedAmount * rewardPerceantege[0]) / 100;
        for (let j = 0; j < memberInfo.refferedTo.length; j++) {
          member2 = memberInfo.refferedTo[j];
          memberInfo2 = await User.findOne({ member2 });
          if (memberInfo2.isInvested) {
            memberInvestedAmount2 = await investment.findOne({
              userId: member2,
            });
            memberInvestedAmount2 = memberInvestedAmount2.amount;
            totalRewards = (memberInvestedAmount2 * rewardPerceantege[1]) / 100;
            for (let k = 0; k < memberInfo2.refferedTo.length; k++) {
              member3 = memberInfo2.refferedTo[k];
              memberInfo3 = await User.findOne({ member3 });
              if (memberInfo2.isInvested) {
                memberInvestedAmount3 = await investment.findOne({
                  userId: member3,
                });
                memberInvestedAmount3 = memberInvestedAmount3.amount;
                totalRewards =
                  (memberInvestedAmount3 * rewardPerceantege[2]) / 100;
              }
            }
          }
        }
      }
    }
  } else return 0;
};

const calclulateMembers = async (userId) => {
  let members = {};
  let userInfo = await User.findOne({ userId });
  if (userInfo.isInvested) {
    for(let i=0;i<userInfo.refferedTo.length;i++){
      
    }
  } else return members;
};
module.exports = calclulateRewads;
