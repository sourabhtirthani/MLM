const { json } = require("body-parser");

const transactions = require("../../models/transaction");
exports.transactions = async (req, res, next) => {
  try {
    let user = req.user.user;
    const userId = user.userId;
    if (!userId) res.status(404).json({ message: "User Not Found" });
    let { startDate, endDate, keywords } = req.body;
    let result = await filterData(userId, startDate, endDate, keywords);
    if (!result) {
      result = await transactions.find({ userId }).sort({ createdAt: "desc" });
    }
    let array = Array();
    let j = 1;
    for (let i = 0; i < result.length; i++) {
      const createdAt = new Date(result[i].createdAt);
      const formattedDate = createdAt.toLocaleDateString();
      const formattedTime = createdAt.toLocaleTimeString();
      array.push({ id: j + i,datetime: formattedDate + " " + formattedTime, ...result[i]._doc });
    }
    res.status(200).json({ result: array });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const filterData = async (userId, startDate, endDate, keywords) => {
  let query;
  console.log(userId, startDate, endDate, keywords)
  if (startDate && endDate && keywords) {
    const sdate = new Date(startDate);

    const edate = new Date(endDate);
    query = {
      $and: [
        { createdAt: { $gte: sdate, $lte: edate } },
        { userId: userId },
        {$or :[{ fromName:  keywords  },{ username: keywords },{Details:keywords}]},      
      ],
    };
  } else if (keywords && !startDate && !endDate) {
    query = {
      $and: [
        { userId: { $eq: userId } },
        {$or :[{ fromName:  keywords  },{ username: keywords },{Details:keywords}]},      
      ],
    };
  } else if (!keywords && startDate && endDate) {
    const sdate = new Date(startDate);

    const edate = new Date(endDate);
    query = {
      $and: [{ createdAt: { $gte: sdate, $lte: edate } }, { userId: userId }],
    };
  }
  if(!query){
    query  = { userId };
  }
  let res = await transactions.find(query).sort({ createdAt: "desc" });
  return res;
};
