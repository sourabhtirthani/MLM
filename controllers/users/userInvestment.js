const { json } = require("body-parser");
const User = require("../../models/User");

//users investment
exports.investment = async (req, res, next) => {
  try {
    let { userId, amount, investerId } = req.body;
    if (!userId)
      return res.status(404).json({ error: "Please Provide User id" });
    if (!investerId)
      return res.status(404).json({ error: "Please Provide Invester id" });
    if (amount < 100)
      return res
        .status(400)
        .json({ error: "Investment Amount Must be Grater than zero" });

    let isExistsUserId = await User.findOne({userId});
    if (!isExistsUserId)
      return res.status(400).json({ error: "UserId Not Found" });
    
    let isExistsInvesterId = await User.findOne({ investerId });
    if (!isExistsInvesterId)
      return res.status(400).json({ error: "invester Id Not Found" });
    
  } catch (error) {
    console.log(error, " errrrr");
    next(error);
  }
};

// return the investment history
exports.investmentHistory = (req, res) => {};
