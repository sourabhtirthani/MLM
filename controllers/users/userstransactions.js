const { json } = require("body-parser");

const investmentHistory = require("../../models/InvestmentHistory");
const withdraw = require("../../models/withdrawal");

exports.transactions = async (req, res) => {
  let user = req.user.user;
  const userId = user.userId;
  let data =await investmentHistory.aggregate([
    {
      $lookup: {
        from: investmentHistory, // The name of the collection you want to join with
        localField: "_id", // The field from the "users" collection
        foreignField: userId, // The field from the "orders" collection
        as: withdraw, // The name for the field that will store the joined data
      },
    },
  ]);
  console.log("data",data);
};
