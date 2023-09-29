const { json } = require("body-parser");

const investmentHistory = require("../../models/InvestmentHistory");
const withdraw = require("../../models/withdrawal");

exports.transactions = async (req, res, next) => {
  try {
    let user = req.user.user;
    const userId = user.userId;
    if (!userId) res.status(404).json({ message: "User Not Found" });
    let data = await withdraw.aggregate([
      {
        $lookup: {
          from: "investment",
          localField: userId,
          foreignField: userId,
          as: "transactions",
        },
      },
    ]);

    if (data) res.status(200).json({ result: data });
    else res.status(404).json({ message: "Data not found" });
    
  } catch (err) {
    console.log(err);
    next(err);
  }
};
