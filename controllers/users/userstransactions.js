const { json } = require("body-parser");

const investmentHistory = require("../../models/InvestmentHistory");
const withdraw = require("../../models/withdrawal");

exports.transactions = async (req, res) => {
  let user = req.user.user;
  const userId = user.userId;
  let data = await investmentHistory.aggregate("withdraw", "investment", [
    {
      $lookup: {
        from: "investment",
        localField: "userId",
        foreignField: "userId",
        as: "investmentDocs",
      },
    },
    {
      $project: {
        _id: 0,
        prodId: userId,
      },
    },
  ]);
  console.log("data", data);
};
