const { json } = require("body-parser");
const User = require("../../models/User");
const Withdraw = require("../../models/withdrawal");
const investment = require("../../models/Investment");
const totalWithdraw = require("../../models/totalwithdraw");
const { calclulateRewads } = require("../../helpers/calclulateRewards");
const transactions = require("../../models/transaction");
// post request for withdraw amout
exports.withdrawal = async (req, res, next) => {
  try {
    let { address, amount } = req.body;
    let user = req.user.user;
    const userId = user.userId;
    const username = user.username;
    if (!userId)
      return res.status(404).json({ error: "Please Provide User id" });

    let isExistsUserId = await User.findOne({ userId });
    if (!isExistsUserId)
      return res.status(400).json({ error: "UserId Not Found" });
    let isInvested = await investment.findOne({ userId });
    if (!isInvested)
      return res.status(400).json({ error: "Investment Not found " });

    let rewards = await calclulateRewads(userId);
    if (rewards < amount)
      return res.status(400).json({
        error: "Can not withdraw more than rewards",
      });
    let tWithdraw = await totalWithdraw.findOne({ userId });
    if (tWithdraw) {
      const updatedDATA = {
        amount: Number(tWithdraw.amount) + Number(amount),
      };
      await totalWithdraw.updateOne({ userId }, { $set: updatedDATA });
    } else {
      const newWith = new totalWithdraw({
        userId,
        amount,
      });
      await newWith.save();
    }
    const newWithdraw = new Withdraw({
      userId,
      username,
      amount,
      address,
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
    let result = await Withdraw.find({ userId }).sort({ createdAt: "desc" });
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
    let result = await Withdraw.find({});
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
