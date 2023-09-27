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
    let array = Array();
        let j=1;
        for(let i=0;i<Income.length;i++){    
            const createdAt = new Date(Income[i].createdAt);            
            const formattedDate = createdAt.toLocaleDateString();
            const formattedTime = createdAt.toLocaleTimeString();               
            array.push({id:j+i,datetime:formattedDate+" "+formattedTime,...Income[i]._doc});
        }
    res.status(200).json({ result: array });
  } catch (err) {
    console.log("err", err);
    next(err);
  }
};
