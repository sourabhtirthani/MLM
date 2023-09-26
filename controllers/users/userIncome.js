const { json } = require("body-parser");
const levelIncome = require("../../models/levelIncome");
// Calclulate ROI Income
exports.claclulateROI = (req, res) => {};

// CalClualte LEVEL income
exports.claclulateLEVEL = async (req, res, next) => {
  try {
    let user = req.user.user;
    const userId = user.userId;
    let Income = await levelIncome.find({ userId: userId });
    if (!Income) res.status(400).json({ error: "User Not Found" });
    res.status(200).json({ result: Income });
  } catch (err) {
    console.log("err", err);
    next(err);
  }
};
