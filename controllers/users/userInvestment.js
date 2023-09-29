const { json } = require("body-parser");
const User = require("../../models/User");
const investmentHistory = require("../../models/InvestmentHistory");
const investment = require("../../models/Investment");
const levelIncome = require("../../models/levelIncome");
const { calclulateRewads } = require("../../helpers/calclulateRewards");
const adminSettings = require("../../models/adminSettings");
const transactions = require("../../models/transaction");
//users investment
exports.investment = async (req, res, next) => {
  try {
    let { userId, amount } = req.body;
    let invester = req.user.user;
    let investerId = invester.userId;
    if (!userId)
      return res.status(404).json({ error: "Please Provide User id" });
    if (!investerId)
      return res.status(404).json({ error: "Please Provide Invester id" });

    let isExistsUserId = await User.findOne({ userId });
    let isExistsInvesterId = await User.findOne({ userId: investerId });

    if (!isExistsUserId)
      return res.status(400).json({ error: "UserId Not Found" });
    if (!isExistsInvesterId)
      return res.status(400).json({ error: "invester Id Not Found" });
    if (
      Number(amount) > 100 &&
      Number(isExistsInvesterId.mainWallet) <= Number(amount)
    ) {
      return res.status(400).json({
        error:
          "Investment Amount Must be Grater than 100 And less than equal to investment amount",
      });
    }

    let isAlreadyInvested = await investment.findOne({ userId });
    if (isAlreadyInvested) {
      let rewards = await calclulateRewads(userId);
      const updatedDATA = {
        amount: Number(isAlreadyInvested.amount) + Number(amount),
        rewards: rewards,
      };
      await investment.updateOne({ userId }, { $set: updatedDATA });
    } else {
      // insert code
      const newInvestment = new investment({
        userId,
        amount,
      });
      await newInvestment.save();
      const updatedDATA = {
        isInvested: true,
      };
      await User.updateOne({ userId }, { $set: updatedDATA });
    }
    await levelIncomecalclulator(userId, amount);
    const alltransaction = new transactions({
      userId,
      Details:"Investment",
      amount,
      fromName: invester.username,
      username: isExistsUserId.username,
    });
     await alltransaction.save();
    const invest = new investmentHistory({
      userId,
      investerId,
      amount,
      fromUsername: invester.username,
      toUsername: isExistsUserId.username,
    });
    let result = await invest.save();

    const updateUserData = {
      investmentWallet:
        Number(isExistsUserId.investmentWallet) + Number(amount),
    };
    await User.updateOne({ userId }, { $set: updateUserData });
    const updateInverterData = {
      mainWallet: Number(isExistsInvesterId.mainWallet) - Number(amount),
    };
    await User.updateOne({ userId: investerId }, { $set: updateInverterData });

    return res.status(200).json({ message: "invested successfully", result });
  } catch (error) {
    console.log(error, " errrrr");
    next(error);
  }
};

const levelIncomecalclulator = async (userId, amount) => {
  let userInfo = await User.findOne({ userId });
  let settings = await adminSettings.find();
  let rewardPerceantege = [
    settings[0].level1,
    settings[0].level2,
    settings[0].level3,
  ];
  if (userInfo) {
    if (userInfo.refferBy) {
      let userInfo2 = await User.findOne({ userId: userInfo.refferBy });
      const income = new levelIncome({
        userId: userInfo.refferBy,
        username: userInfo2.username,
        receiveFrom: userId,
        amount: Number((amount * rewardPerceantege[0]) / 100),
        Level: 1,
      });
      await income.save();
      if (userInfo2.refferBy) {
        let userInfo3 = await User.findOne({ userId: userInfo2.refferBy });
        const income2 = new levelIncome({
          userId: userInfo2.refferBy,
          username: userInfo3.username,
          receiveFrom: userId,
          amount: Number((amount * rewardPerceantege[1]) / 100),
          Level: 2,
        });
        await income2.save();

        if (userInfo3.refferBy) {
          let userInfo4 = await User.findOne({ userId: userInfo3.refferBy });
          const income3 = new levelIncome({
            userId: userInfo3.refferBy,
            username: userInfo4.username,
            receiveFrom: userId,
            amount: Number((amount * rewardPerceantege[2]) / 100),
            Level: 3,
          });
          await income3.save();
        }
      }
    }
  }
};
// return the investment history
exports.investmentHistory = async (req, res) => {
  let user = req.user.user;
  let userId = user.userId;
  let { startDate, endDate, keywords } = req.body;
  console.log(startDate, endDate, keywords)
  let result = await filterData(userId, startDate, endDate, keywords);
  if (!result) {
    result = await investmentHistory
      .find({ userId })
      .sort({ createdAt: "desc" });
  }
  let array = Array();
  let j = 1;
  for (let i = 0; i < result.length; i++) {
    array.push({ id: j + i, ...result[i]._doc });
  }
  res.status(200).json({ result: array });
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
        { fromUsername: keywords },
        { toUsername: keywords },
      ],
    };
  } else if (keywords && !startDate && !endDate) {
    query = {
      $or: [
        { userId: {$eq:userId} },
        { fromUsername: {$eq : keywords} },
        { toUsername: {$eq:keywords} },
      ],
    };
  } else if (!keywords && startDate && endDate) {
    const sdate = new Date(startDate);

    const edate = new Date(endDate);
    query = {
      $and: [
        { createdAt: { $gte: sdate, $lte: edate } },
        { userId: userId },
      ],
    };
  }
  let res = await investmentHistory.find(query);  
  return res;
};
