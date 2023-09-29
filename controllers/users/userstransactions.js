const { json } = require("body-parser");

const transactions = require("../../models/transaction");
exports.transactions = async (req, res, next) => {
  try {
    let user = req.user.user;
    const userId = user.userId;
    if (!userId) res.status(404).json({ message: "User Not Found" });
    let data = await transactions.find({userId});
    if (data) res.status(200).json({ result: data });
    else res.status(404).json({ message: "Data not found" });

  } catch (err) {
    console.log(err);
    next(err);
  }
};
