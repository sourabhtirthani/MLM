const investment = require("../models/Investment");
const User = require("../models/User");
const withdraw = require("../models/totalwithdraw");
const levelIncome = require("../models/levelIncome");
const adminSettings = require("../models/adminSettings");
const calclulateRewardsForBigLag = require("./calclulateBiglagRewads");
const moment = require("moment");

const calclulateRewadsPerDay = async (userId) => {
  let userInfo = await investment.findOne({ userId });
  if (!userInfo) return 0;
  const currentDate = moment();
  let settings = await adminSettings.find();
  // Calculate the difference in days
  const dateDifference = currentDate.diff(moment(userInfo.createdAt));
  let totalRewards = 0;
  if (dateDifference >= 1) {
    totalRewards = userInfo.amount * (Number(settings[0].ROI) / 100 / 30);
  }
  return totalRewards;
};

const calclulateRewads = async (userId) => {
  let userInfo = await investment.findOne({ userId });
  if (!userInfo) return 0;
  let diffDays = await DateDiffer(userInfo.createdAt);
  // Calculate the difference in days
  let settings = await adminSettings.find();
  let previousRewards = userInfo.rewards;
  if (!previousRewards) previousRewards = 0;
  let totalRewards = 0;
  totalRewards =
    userInfo.amount * (Number(settings[0].ROI) / 100 / 30) * diffDays;
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
        if (memberInfo.isInvested) activeMember.push(member);
        else deactiveMember.push(member);
        for (let j = 0; j < memberInfo.refferedTo.length; j++) {
          member2 = memberInfo.refferedTo[j];
          memberInfo2 = await User.findOne({ userId: member2 });
          if (!memberInfo2) continue;
          totalMember.push(member2);
          if (memberInfo2) {
            if (memberInfo2.isInvested) activeMember.push(member2);
            else deactiveMember.push(member2);
            for (let k = 0; k < memberInfo2.refferedTo.length; k++) {
              member3 = memberInfo2.refferedTo[k];
              memberInfo3 = await User.findOne({ userId: member3 });
              if (!memberInfo3) continue;
              totalMember.push(member3);
              if (memberInfo3) {
                if (memberInfo3.isInvested) activeMember.push(member3);
                else deactiveMember.push(member3);
              }
            }
          }
        }
      }
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
        if (memberInfo.isInvested) activeMember.push(memberInfo);
        else deactiveMember.push(memberInfo);

        for (let j = 0; j < memberInfo.refferedTo.length; j++) {
          member2 = memberInfo.refferedTo[j];
          memberInfo2 = await User.findOne({ userId: member2 });
          if (!memberInfo2) continue;
          totalMember.push(memberInfo2);
          if (memberInfo2) {
            if (memberInfo2.isInvested) activeMember.push(memberInfo2);
            else deactiveMember.push(memberInfo2);
            for (let k = 0; k < memberInfo2.refferedTo.length; k++) {
              member3 = memberInfo2.refferedTo[k];
              memberInfo3 = await User.findOne({ userId: member3 });
              if (!memberInfo3) continue;
              totalMember.push(memberInfo3);
              if (memberInfo3) {
                if (memberInfo3.isInvested) activeMember.push(memberInfo3);
                else deactiveMember.push(memberInfo3);
              }
            }
          }
        }
      }
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

const totalROIForAdmin = async () => {
  const entries = await User.find({});
  let sum = 0;
  for (let i = 0; i < entries.length; i++) {
    sum += await calclulateRewads(entries[0].userId);
  }
  if (sum) return sum;
  else return 0;
};
const totalLEVELForAdmin = async () => {
  const entries = await User.find({});
  let sum = 0;
  for (let i = 0; i < entries.length; i++) {
    sum += await CalclulateLevelIncome(entries[0].userId);
  }
  if (sum) return sum;
  else return 0;
};
const totalInvestmentForAdmin = async () => {
  let total = await investment.aggregate([
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$amount" },
      },
    },
  ]);
  if (total) return total[0].totalAmount;
  else return 0;
};
const totalWithDrawForAdmin = async () => {
  let total = await withdraw.aggregate([
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$amount" },
      },
    },
  ]);
  if (total) return total[0].totalAmount;
  else return 0;
};

const totalROIOfALLUSERS = async () => {
  let allUser = await User.find({});

  let allData = [],
    memberInfo = {},
    totalROI = Number(0),
    levelIncome = Number(0),
    totalWithdawal = Number(0);
  for (let i = 0; i < allUser.length; i++) {
    memberInfo["userId"] = allUser[i].userId;
    totalROI = await calclulateRewads(allUser[i].userId);
    levelIncome = await CalclulateLevelIncome(allUser[i].userId);
    totalWithdawal = await WithDrawDetails(allUser[i].userId);
    memberInfo["totalROI"] = totalROI;
    memberInfo["levelIncome"] = levelIncome;
    memberInfo["totalIncome"] = Number(totalROI) + Number(levelIncome);
    memberInfo["rewardIncome"] = await calclulateRewardsForBigLag(
      allUser[i].userId
    );
    memberInfo["avaiBalance"] = await calclulateAvaiableBalance(
      totalROI,
      levelIncome,
      totalWithdawal,
      allUser[i].userId
    );
    memberInfo["totalWithdraw"] = totalWithdawal;
    allData.push(memberInfo);
    memberInfo = {};
  }
  // console.log("allData",allData);
  return allData;
};

const calclulateAvaiableBalance = async (
  totalRoI,
  levelIncome,
  withdrawDetail,
  userId
) => {
  let totalinvestment = await investment.findOne({ userId });
  let amount = 0;
  if (!totalinvestment) {
    amount = 0;
  } else {
    amount = totalinvestment.amount;
  }
  let newincome = Number(totalRoI) + Number(levelIncome);
  if (!(newincome < 2 * Number(amount)))
    newincome = 2 * Number(amount) - Number(withdrawDetail);
  else newincome = Number(newincome) - Number(withdrawDetail);

  return newincome;
};

const DateDiffer = async (datesting) => {
  let year, month, day, oldYear, oldMonth, OldDate;
  const date = moment(datesting);
  const currentDate = moment();
  // Get the year, month, and date
  oldYear = date.year();
  oldMonth = date.month() + 1;
  OldDate = date.date();
  year = currentDate.year();
  month = currentDate.month() + 1;
  day = currentDate.date();
  let sum =
    Number(year) -
    Number(oldYear) +
    (Number(month) - Number(oldMonth)) +
    (Number(day) - Number(OldDate));

    if(sum) return sum;
    else return 0
};
module.exports = {
  calclulateRewads,
  calclulateRewadsPerDay,
  CalclulateLevelIncome,
  calclulateMembers,
  WithDrawDetails,
  membersInformation,
  totalROIForAdmin,
  totalLEVELForAdmin,
  totalInvestmentForAdmin,
  totalWithDrawForAdmin,
  totalROIOfALLUSERS,
};
