const { json } = require("body-parser");
const User = require("../../models/User");
const investment = require("../../models/Investment");

//users investment
exports.investment = async (req, res, next) => {
  try {
    let { userId, amount } = req.body;
    let investerId = req.user.user;
    investerId = investerId.userId;
    if (!userId)
      return res.status(404).json({ error: "Please Provide User id" });
    if (!investerId)
      return res.status(404).json({ error: "Please Provide Invester id" });
    if (amount < 100)
      return res
        .status(400)
        .json({ error: "Investment Amount Must be Grater than zero" });

    let isExistsUserId = await User.findOne({ userId });
    let isExistsInvesterId = await User.findOne({ userId: investerId });

    if (!isExistsUserId)
      return res.status(400).json({ error: "UserId Not Found" });
    if (!isExistsInvesterId)
      return res.status(400).json({ error: "invester Id Not Found" });

    const invest = new investment({
      userId,
      investerId,
      amount,
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
