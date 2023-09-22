const { json } = require("body-parser");
const User = require("../../models/User");
const Withdraw = require("../../models/withdrawal");
const { calclulateRewads } = require("../../helpers/calclulateRewards");
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
    let rewards = await calclulateRewads(userId);
    console.log("rewards", rewards);
    if (rewards < amount)
      return res.status(400).json({
        error: "Can not withdraw more than rewards",
      });

    const newWithdraw = new Withdraw({
      userId,
      username,
      amount,
      address,
    });

    let result = await newWithdraw.save();
    res
      .status(201)
      .json({ messgae: "Withdraw request send successfully", result });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// withdraw history
exports.withdrwalHistory = async (req, res) => {
  let user = req.user.user;
  let userId = user.userId;
  let result = await Withdraw.find({ userId });
  res.status(200).json({ result });
};
