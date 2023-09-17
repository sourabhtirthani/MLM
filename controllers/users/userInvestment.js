const { json } = require("body-parser");
const User = require("../../models/User");
const investmentHistory = require("../../models/InvestmentHistory");
const investment = require("../../models/Investment");
const calclulateRewads = require("../../helpers/calclulateRewards");
//users investment
exports.investment = async (req, res, next) => {
  try {
    let { userId, amount } = req.body;
    let invester = req.user.user;
    investerId = invester.userId;
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

    if (amount < 100 && isExistsInvesterId.investmentWallet >= amount)
      return res.status(400).json({
        error:
          "Investment Amount Must be Grater than 100 And less than equal to investment amount",
      });

    let isAlreadyInvested = await investment.findOne({ userId });
    if (isAlreadyInvested) {
      let rewards = await calclulateRewads(userId);
      const updatedDATA = {
        amount: isAlreadyInvested.amount + amount,
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

    const invest = new investmentHistory({
      userId,
      investerId,
      amount,
      fromUsername: invester.username,
      toUsername: isExistsUserId.username,
    });
    let result = await invest.save();

    return res.status(200).json({ message: "invested successfully", result });
  } catch (error) {
    console.log(error, " errrrr");
    next(error);
  }
};

// return the investment history
exports.investmentHistory = async (req, res) => {
  let userId = req.user.user;
  userId = user.userId;
  let result = await investment.find({ userId });
  res.status(200).json({ result });
};
