const investment = require("../models/Investment");
const User = require("../models/User");
const withdraw = require("../models/totalwithdraw");
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
  let totalWithdraw = await WithDrawDetails(userId);
  if (totalRewards)
    return totalRewards + Number(previousRewards) - Number(totalWithdraw);
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
  if (userInfo) {
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
      if (memberInfo) {
        activeMember.push(member);

        for (let j = 0; j < memberInfo.refferedTo.length; j++) {
          member2 = memberInfo.refferedTo[j];
          memberInfo2 = await User.findOne({ userId: member2 });
          if (!memberInfo2) continue;
          totalMember.push(member2);
          if (memberInfo2) {
            activeMember.push(member2);
            for (let k = 0; k < memberInfo2.refferedTo.length; k++) {
              member3 = memberInfo2.refferedTo[k];
              memberInfo3 = await User.findOne({ userId: member3 });
              if (!memberInfo3) continue;
              totalMember.push(member3);
              if (memberInfo3) {
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
  if (userInfo) {
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
      directTeam.push(array[0]);
      if (memberInfo) {
        activeMember.push(memberInfo);

        for (let j = 0; j < memberInfo.refferedTo.length; j++) {
          member2 = memberInfo.refferedTo[j];
          memberInfo2 = await User.findOne({ userId: member2 });
          if (!memberInfo2) continue;
          totalMember.push(memberInfo2);
          if (memberInfo2) {
            activeMember.push(memberInfo2);
            for (let k = 0; k < memberInfo2.refferedTo.length; k++) {
              member3 = memberInfo2.refferedTo[k];
              memberInfo3 = await User.findOne({ userId: member3 });
              if (!memberInfo3) continue;
              totalMember.push(memberInfo3);
              if (memberInfo3) {
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
  let userInfo = await withdraw.findOne({ userId });

  if (!userInfo) return 0;
  if (userInfo) {
    if (userInfo.amount) return userInfo.amount;
    else return 0;
  } else return 0;
};

const totalROIForAdmin=async()=>{
  const entries = await User.find({});
  console.log("entries",entries[0].userId);
  let sum=0;
  for(let i=0;i<entries.length;i++){
    sum+=await calclulateRewads(entries[0].userId);
  }
  if(sum) return sum;
  else return 0;
}
const totalLEVELForAdmin=async()=>{
  const entries = await User.find({});
  console.log("entries",entries[0].userId);
  let sum=0;
  for(let i=0;i<entries.length;i++){
    sum+=await CalclulateLevelIncome(entries[0].userId);
  }
  if(sum) return sum;
  else return 0;
}
module.exports = {
  calclulateRewads,
  calclulateRewadsPerDay,
  CalclulateLevelIncome,
  calclulateMembers,
  WithDrawDetails,
  membersInformation,
  totalROIForAdmin,
  totalLEVELForAdmin
};
