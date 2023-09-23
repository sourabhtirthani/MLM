const { json } = require("body-parser");
const levelIncome = require("../../models/levelIncome");
// Calclulate ROI Income
exports.claclulateROI = (req, res) => {};

// CalClualte LEVEL income
exports.claclulateLEVEL = async (req, res) => {
  let user = req.user.user;
  const userId = user.userId;
  let Income = await levelIncome.find({ userId: userId });
  res.status(200).json({ result: Income });
};
