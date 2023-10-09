const { json } = require("body-parser");
const User = require("../../models/User");
const Withdraw = require("../../models/withdrawal");
const investment = require("../../models/Investment");
const totalWithdraww = require("../../models/totalwithdraw");
const {
  calclulateRewads,
  CalclulateLevelIncome,
  WithDrawDetails,
} = require("../../helpers/calclulateRewards");
const transactions = require("../../models/transaction");
const levelIncome = require("../../models/levelIncome");
// post request for withdraw amout
exports.withdrawal = async (req, res, next) => {
  try {
    let { amount } = req.body;
    let user = req.user.user;
    const userId = user.userId;
    const username = user.username;
    if (!userId)
      return res.status(404).json({ error: "Please Provide User id" });

    let isExistsUserId = await User.findOne({ userId });
    if (!isExistsUserId)
      return res.status(400).json({ error: "UserId Not Found" });
    if (!isExistsUserId.UsdtAddress)
      return res.status(400).json({
        error:
          "Before Withdraw Please update add your Usdt address in profile section",
      });
    let isInvested = await investment.findOne({ userId });
    if (!isInvested)
      return res.status(400).json({ error: "Investment Not found " });

    let rewards = await calclulateRewads(userId);
    let LevelRewards = await CalclulateLevelIncome(userId);
    let totalWithdraw = await WithDrawDetails(userId);
    let income = Number(rewards) + Number(LevelRewards);
    console.log("income",income);
    if (!(income < 2 * Number(isInvested.amount))) income = 2 * Number(isInvested.amount)-Number(totalWithdraw);
    else income= Number(income)-Number(totalWithdraw);
    if (income < amount)
      return res.status(400).json({
        error: "Can not withdraw more than rewards",
      });
      // let avaiBalance=Number(income)-Number(totalWithdraw);
      // if(avaiBalance<amount){
      //   return res.status(400).json({
      //     error: "Can not withdraw more than rewards",
      //   });
      // }
    let tWithdraw = await totalWithdraww.findOne({ userId });
    console.log("tWithdraw", tWithdraw);
    if (tWithdraw) {
      let newAmount = Number(0);
      if (Number(tWithdraw.amount)) newAmount = Number(tWithdraw.amount);
      const updatedDATA = {
        amount: Number(newAmount) + Number(amount),
      };
      await totalWithdraww.updateOne({ userId }, { $set: updatedDATA });
    } else {

      const newWith = new totalWithdraww({
        userId,
        amount,
      });
      await newWith.save();
    }
    const newWithdraw = new Withdraw({
      userId,
      username,
      amount,
      address: isExistsUserId.UsdtAddress,
    });

    let result = await newWithdraw.save();
    const alltransaction = new transactions({
      userId,
      Details: "Withdraw",
      amount,
      fromName: isExistsUserId.username,
      username: isExistsUserId.username,
    });
    await alltransaction.save();
    res
      .status(201)
      .json({ message: "Withdraw request send successfully", result });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// withdraw history
exports.withdrwalHistory = async (req, res, next) => {
  let user = req.user.user;
  let userId = user.userId;
  try {
    let { startDate, endDate, keywords } = req.body;
    let result = await filterData(user.userId, startDate, endDate, keywords);
    if (!result) {
      result = await Withdraw.find({ userId }).sort({ createdAt: "desc" });
    }
    let array = Array();
    let j = 1;
    for (let i = 0; i < result.length; i++) {
      const createdAt = new Date(result[i].createdAt);
      const formattedDate = createdAt.toLocaleDateString();
      const formattedTime = createdAt.toLocaleTimeString();
      array.push({
        ...result[i]._doc,
        id: j + i,
        datetime: formattedDate + " " + formattedTime,
        type:
          result[i].isAccpected == 2
            ? "Rejected"
            : result[i].isAccpected == 1
            ? "Accepted"
            : result[i].isAccpected == 0
            ? "Pending"
            : "",
      });
    }
    return res.status(200).json({ result: array });
  } catch (error) {
    next(error);
  }
};

exports.AllWithdrawRequests = async (req, res, next) => {
  try {
    let { startDate, endDate, keywords } = req.body;
    let result = await filterAdminData(startDate, endDate, keywords);
    if (!result) {
      result = await Withdraw.find({});
    }
    let array = Array();
    let j = 1;
    for (let i = 0; i < result.length; i++) {
      const createdAt = new Date(result[i].createdAt);
      const formattedDate = createdAt.toLocaleDateString();
      const formattedTime = createdAt.toLocaleTimeString();
      array.push({
        ...result[i]._doc,
        id: j + i,
        datetime: formattedDate + " " + formattedTime,
        type: result[i].isAccpected,
      });
    }
    return res.status(200).json({ result: array });
  } catch (error) {
    next(error);
  }
};

exports.approvewithdraw = async (req, res, next) => {
  try {
    let { withdrawId } = req.body;
    let user = req.user.user;
    if (user.role != 1)
      return res
        .status(400)
        .json({ error: "Only admin can perform this action" });

    let withdawData = await Withdraw.findOne({ _id: withdrawId });
    if (withdawData) {
      let updateRequest = await Withdraw.findOneAndUpdate(
        { _id: { $eq: withdrawId } },
        { $set: { isAccpected: 1 } }
      );
      if (updateRequest) {
        return res.status(200).json({ message: "Request Accpected" });
      } else {
        return res.status(400).json({ error: "Internel Server Error" });
      }
    } else res.status(400).json({ message: "Request not found" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.rejectwithdraw = async (req, res, next) => {
  try {
    let { withdrawId } = req.body;
    let user = req.user.user;
    if (user.role != 1)
      return res
        .status(400)
        .json({ error: "Only admin can perform this action" });

    let withdawData = await Withdraw.findOne({ _id: withdrawId });
    console.log("withdawData", withdawData);
    if (withdawData) {
      let updateRequest = await Withdraw.findOneAndUpdate(
        { _id: { $eq: withdrawId } },
        { $set: { isAccpected: 2 } }
      );
      if (updateRequest) {
        
        return res.status(200).json({ message: "Request Rejected" });
      } else {
        return res.status(400).json({ error: "Internel Server Error" });
      }
    } else res.status(400).json({ message: "Request not found" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const filterData = async (userId, startDate, endDate, keywords) => {
  let query;
  if (startDate && endDate && keywords) {
    const sdate = new Date(startDate);
    const edate = new Date(endDate);
    query = {
      $and: [
        { createdAt: { $gte: sdate, $lte: edate } },
        { userId: userId },
        { $or: [{ username: keywords }, { address: keywords }] },
      ],
    };
  } else if (keywords && !startDate && !endDate) {
    query = {
      $and: [
        { userId: userId },
        { $or: [{ username: keywords }, { address: keywords }] },
      ],
    };
  } else if (!keywords && startDate && endDate) {
    const sdate = new Date(startDate);

    const edate = new Date(endDate);
    query = {
      $and: [{ createdAt: { $gte: sdate, $lte: edate } }, { userId: userId }],
    };
  }
  if (!query) {
    query = { userId: userId };
  }

  let res = await Withdraw.find(query).sort({ createdAt: "desc" });
  return res;
};

const filterAdminData = async (startDate, endDate, keywords) => {
  let query;
  if (startDate && endDate && keywords) {
    const sdate = new Date(startDate);
    const edate = new Date(endDate);
    query = {
      $and: [
        { createdAt: { $gte: sdate, $lte: edate } },
        {
          $or: [
            { username: keywords },
            { userId: keywords },
            { address: keywords },
          ],
        },
      ],
    };
  } else if (keywords && !startDate && !endDate) {
    query = {
      $and: [
        {
          $or: [
            { username: keywords },
            { address: keywords },
            { userId: keywords },
          ],
        },
      ],
    };
  } else if (!keywords && startDate && endDate) {
    const sdate = new Date(startDate);

    const edate = new Date(endDate);
    query = {
      $and: [{ createdAt: { $gte: sdate, $lte: edate } }],
    };
  }
  if (!query) {
    query = {};
  }
  console.log(query);
  let res = await Withdraw.find(query).sort({ createdAt: "desc" });
  return res;
};
