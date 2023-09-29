const User = require("../models/User");
const investment = require("../models/Investment");
const calclulateRewardsForBigLag = async (userId) => {
  let user = await User.findOne({ userId });
  let member,
    allmembers = [],
    sum = 0,
    users,
    totalAmount = [],
    memberInfo;
  if (user) {
    let i = 0;
    while (i < user.refferedTo.length) {
      member = user.refferedTo[i];
      memberInfo = await investment.findOne({ userId: member });
      allmembers = await membersInformation(member);
      let j = 0;
      while (j < allmembers.length) {
        users = await investment.findOne({ userId: allmembers[j] });
        if (users) {
          if (users.amount) sum += users.amount;
        }
        j++;
      }
      sum += memberInfo.amount;
      totalAmount.push(sum);
      sum = 0;

      i++;
    }
    let newAmount = totalAmount.sort((a, b) => b - a);
    let highest = -Infinity;
    let secondHighest = -Infinity;
    let sumAll = 0;

    for (let i = 0; i < newAmount.length; i++) {
      const currentValue = newAmount[i];
      sumAll += currentValue;

      if (currentValue > highest) {
        secondHighest = highest;
        highest = currentValue;
      } else if (currentValue > secondHighest && currentValue !== highest) {
        secondHighest = currentValue;
      }
    }
    let Totalrewards =
      highest * 0.6 +
      secondHighest * 0.2 +
      (sumAll - highest - secondHighest) * 0.2;
    if (Totalrewards) return Totalrewards;
    else return 0;
  } else return 0;
};

const membersInformation = async (userId) => {
  let userInfo = await User.findOne({ userId });
  if (!userInfo) return 0;
  if (userInfo.isInvested) {
    let member, member2, member3;
    let memberInfo, memberInfo2, memberInfo3;
    let totalMember = [];
    // Level 1

    for (let i = 0; i < userInfo.refferedTo.length; i++) {
      member = userInfo.refferedTo[i];
      memberInfo = await User.findOne({ userId: member });
      if (memberInfo) {
        if (memberInfo.isInvested) {
          totalMember.push(member);
          for (let j = 0; j < memberInfo.refferedTo.length; j++) {
            member2 = memberInfo.refferedTo[j];
            memberInfo2 = await User.findOne({ userId: member2 });
            if (memberInfo2) {
              totalMember.push(member2);
              if (memberInfo2.isInvested) {
                for (let k = 0; k < memberInfo2.refferedTo.length; k++) {
                  member3 = memberInfo2.refferedTo[k];
                  memberInfo3 = await User.findOne({ userId: member3 });
                  if (memberInfo3) totalMember.push(member3);
                }
              }
            }
          }
        }
      }
    }
    if (totalMember) return totalMember;
    else return 0;
  }
};

module.exports = calclulateRewardsForBigLag;
