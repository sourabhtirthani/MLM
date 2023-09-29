const investment = require("../models/Investment");
const User = require("../models/User");
const withdraw = require("../models/withdrawal");
const levelIncome = require("../models/levelIncome");
const adminSettings = require("../models/adminSettings");
const moment = require("moment");

const calclulateRewadsPerDay = async (userId) => {
  let userInfo = await investment.findOne({ userId });
  if (!userInfo) return 0;
  const currentDate = moment();
  let settings = await adminSettings.find();
  // Calculate the difference in days
  const dateDifference = currentDate.diff(moment(userInfo.updatedAt), "days");
  let totalRewards = 0;
  if (dateDifference >= 1) {
    totalRewards = userInfo.amount * (Number(settings[0].ROI) / 100 / 30);
  }
  return totalRewards;
};

const calclulateRewads = async (userId) => {
  let userInfo = await investment.findOne({ userId });
  if (!userInfo) return 0;
  const currentDate = moment();
  // Calculate the difference in days
  let settings = await adminSettings.find();
  let previousRewards = userInfo.rewards;
  if (!previousRewards) previousRewards = 0;
  const dateDifference = currentDate.diff(moment(userInfo.updatedAt), "days");
  let totalRewards = 0;
  totalRewards =
    userInfo.amount * (Number(settings[0].ROI) / 100 / 30) * dateDifference;
  if (totalRewards) return totalRewards + Number(previousRewards);
  else return 0;
};

const CalclulateLevelIncome = async (userId) => {
  let totalRewards = await levelIncome.aggregate([
    {
      $match: {
        userId: userId,
      },
    },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$amount" },
      },
    },
  ]);

  if (totalRewards.length == 0) return 0;
  if (totalRewards) return totalRewards[0].totalAmount;
  else return 0;
};

const calclulateMembers = async (userId) => {
  let members = {};
  let userInfo = await User.findOne({ userId });
  if (userInfo.isInvested) {
    let member, member2, member3;
    let memberInfo, memberInfo2, memberInfo3;
    let totalMember = [],
      activeMember = [],
      deactiveMember = [],
      directTeam = [];
    // Level 1
    for (let i = 0; i < userInfo.refferedTo.length; i++) {
      member = userInfo.refferedTo[i];
      memberInfo = await User.findOne({ userId: member });
      if (!memberInfo) continue;
      let array = Array();
      let j = i + 1;
      for (let key in memberInfo) {
        if (memberInfo.hasOwnProperty(key)) {
          if (key == "_doc") {
            result = memberInfo[key];
            const createdAt = new Date(result.createdAt);
            const formattedDate = createdAt.toLocaleDateString();
            const formattedTime = createdAt.toLocaleTimeString();
            array.push({
              id: j++,
              datetime: formattedDate + " " + formattedTime,
              isblocked:
                result.block == true
                  ? "Block"
                  : result.block == false
                  ? "Unblock"
                  : "",
              isActive: result.isInvested == true ? "Active" : "Inactive",
              totalMembers: result.refferedTo.length,
              ...result,
            });
          }
        }
      }
      totalMember.push(array[0]);
      directTeam.push(memberInfo);
      if (memberInfo.isInvested) {
        activeMember.push(member);

        for (let j = 0; j < memberInfo.refferedTo.length; j++) {
          member2 = memberInfo.refferedTo[j];
          memberInfo2 = await User.findOne({ userId: member2 });
          if (!memberInfo2) continue;
          totalMember.push(member2);
          if (memberInfo2.isInvested) {
            activeMember.push(member2);
            for (let k = 0; k < memberInfo2.refferedTo.length; k++) {
              member3 = memberInfo2.refferedTo[k];
              memberInfo3 = await User.findOne({ userId: member3 });
              if (!memberInfo3) continue;
              totalMember.push(member3);
              if (memberInfo3.isInvested) {
                activeMember.push(member3);
              } else deactiveMember.push(member3);
            }
          } else deactiveMember.push(member2);
        }
      } else deactiveMember.push(member);
    }
    members["totalMembers"] = totalMember;
    members["activeMembers"] = activeMember;
    members["deactiveMembers"] = deactiveMember;
    members["directTeam"] = directTeam;

    return members;
  } else return 0;
};

const membersInformation = async (userId) => {
  let members = {};
  let userInfo = await User.findOne({ userId });
  if (userInfo.isInvested) {
    let member, member2, member3;
    let memberInfo, memberInfo2, memberInfo3;
    let totalMember = [],
      activeMember = [],
      deactiveMember = [],
      directTeam = [];
    // Level 1

    for (let i = 0; i < userInfo.refferedTo.length; i++) {
      member = userInfo.refferedTo[i];
      memberInfo = await User.findOne({ userId: member });
      // console.log(memberInfo);
      if (!memberInfo) continue;
      let array = Array();
      let j = i + 1;
      for (let key in memberInfo) {
        if (memberInfo.hasOwnProperty(key)) {
          if (key == "_doc") {
            result = memberInfo[key];
            const createdAt = new Date(result.createdAt);
            const formattedDate = createdAt.toLocaleDateString();
            const formattedTime = createdAt.toLocaleTimeString();
            array.push({
              id: j++,
              datetime: formattedDate + " " + formattedTime,
              isblocked:
                result.block == true
                  ? "Block"
                  : result.block == false
                  ? "Unblock"
                  : "",
              isActive: result.isInvested == true ? "Active" : "Inactive",
              totalMembers: result.refferedTo.length,
              ...result,
            });
          }
        }
      }
      console.log(array[0]);
      totalMember.push(array[0]);
      directTeam.push(memberInfo);
      if (memberInfo.isInvested) {
        activeMember.push(memberInfo);

        for (let j = 0; j < memberInfo.refferedTo.length; j++) {
          member2 = memberInfo.refferedTo[j];
          memberInfo2 = await User.findOne({ userId: member2 });
          if (!memberInfo2) continue;
          totalMember.push(memberInfo2);
          if (memberInfo2.isInvested) {
            activeMember.push(memberInfo2);
            for (let k = 0; k < memberInfo2.refferedTo.length; k++) {
              member3 = memberInfo2.refferedTo[k];
              memberInfo3 = await User.findOne({ userId: member3 });
              if (!memberInfo3) continue;
              totalMember.push(memberInfo3);
              if (memberInfo3.isInvested) {
                activeMember.push(memberInfo3);
              } else deactiveMember.push(memberInfo3);
            }
          } else deactiveMember.push(memberInfo2);
        }
      } else deactiveMember.push(memberInfo);
    }
    members["totalMembers"] = totalMember;
    members["activeMembers"] = activeMember;
    members["deactiveMembers"] = deactiveMember;
    members["directTeam"] = directTeam;

    return members;
  } else return 0;
};

const WithDrawDetails = async (userId) => {
  let userInfo = await withdraw.find({ userId });
  if (!userInfo) return 0;
  if (userInfo) {
    let totalwithdraw = 0;
    for (let i = 0; i < userInfo.length; i++) {
      if (userInfo[i].isAccpected) totalwithdraw += userInfo[i].amount;
    }
    return totalwithdraw;
  } else return 0;
};

module.exports = {
  calclulateRewads,
  calclulateRewadsPerDay,
  CalclulateLevelIncome,
  calclulateMembers,
  WithDrawDetails,
  membersInformation,
};
