const { json } = require("body-parser");
const levelIncome = require("../../models/levelIncome");
// Calclulate ROI Income
exports.claclulateROI = (req, res) => {};

// CalClualte LEVEL income
exports.claclulateLEVEL = async (req, res, next) => {
  try {
    let user = req.user.user;
    const userId = user.userId;
    let { startDate, endDate, keywords } = req.body;
    let Income = await filterData(user.userId, startDate, endDate, keywords);        
    if(!Income){
      Income = await levelIncome.find({ userId: userId });        
    }
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

const filterData = async (userId, startDate, endDate, keywords) => {
  let query;  
  if (startDate && endDate && keywords) {
    const sdate = new Date(startDate);
    const edate = new Date(endDate);
    query = {
      $and: [
        { createdAt: { $gte: sdate, $lte: edate } },
        {userId:userId},
        {$or : [{username:keywords},{receiveFrom:keywords},{Level:Number(keywords) ? Number(keywords) : 0}]}                   
      ],
    };
  } else if (keywords && !startDate && !endDate) {
    query = {
      $and: [
        {userId:userId},
        {$or : [{username:keywords},{receiveFrom:keywords},{Level:Number(keywords) ? Number(keywords) : 0}]}            
      ],
    };    
  } else if (!keywords && startDate && endDate) {
    const sdate = new Date(startDate);

    const edate = new Date(endDate);
    query = {
      $and: [
        { createdAt: { $gte: sdate, $lte: edate } },
        {userId:userId},          
      ],
    };
  
  }
  if(!query){
    query = { userId: userId }
  }
  
  let res = await levelIncome.find(query);  
  return res;
};
