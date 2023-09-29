const { json } = require("body-parser");
const User = require("../../models/User");
const Deposit = require("../../models/Deposits");

const filterData = async (userId, startDate, endDate, status) => {
  let query;  
  if (startDate && endDate && status) {
    const sdate = new Date(startDate);
    const edate = new Date(endDate);
    query = {
      $and: [
        { createdAt: { $gte: sdate, $lte: edate } },
        { userId: userId },
        { status: status }
      ],
    };
  } else if (status && !startDate && !endDate) {
    query = {
      $and: [
        { userId: userId},
        { status:  Number(status) }        
      ],
    };    
  } else if (!status && startDate && endDate) {
    const sdate = new Date(startDate);

    const edate = new Date(endDate);
    query = {
      $and: [
        { createdAt: { $gte: sdate, $lte: edate } },
        { userId: userId },
      ],
    };
  
  }
  if(!query){
    query = {userId}
  }
  let res = await Deposit.find(query);  
  return res;
};

//all deposite comes here
exports.allDeposite = async (req, res, next) => {
  try {
    let user = req.user.user;
    if (!user) return res.status(400).json({ error: "Please provide a token" });
    let { startDate, endDate, status } = req.body;
    let result = await filterData(user.userId, startDate, endDate, status);
    console.log(result, " results ");
    if(!result){
      result = await Deposit.find({ userId: user.userId }).sort({createdAt: 'desc'});
    }
    let array = Array();
    let j = 1;
    for (let i = 0; i < result.length; i++) {
      array.push({ ...result[i]._doc, id: j + i });
    }
    return res.status(200).json({ result: array });
  } catch (error) {
    console.log(error);
    next(error);
  }
};



// GET ALL USER DEPOSITS
exports.allUserDetails = async (req,res, next) => {
  try {
    let { startDate, endDate, status } = req.body;
    let result = await filterData("", startDate, endDate, status);
    if(!result){
    result = await Deposit.find().sort({createdAt: 'desc'});
    }
    let array = Array();
    let j = 1;
    for (let i = 0; i < result.length; i++) {
      array.push({ ...result[i]._doc, id: j + i });
    }
    return res.status(200).json({ result: array });
  } catch (err) {
    next(err);
  }
};

// user deposit request
exports.requestDeposit = async (req, res, next) => {
  try {
    let user = req.user.user;
    if (!user)
      return res.status(400).json({ error: "Please provide user data" });
    let { amount, message } = req.body;
    if (!amount)
      return res.status(400).json({ error: "Please provide amount" });
    if (Number(amount) <= 0)
      return res.status(400).json({ error: "Please provide a valid amount" });

    if (Object.keys(req.files).length == 0) {
      return res.status(400).json({ message: "Please provide a document" });
    }

    if (
      !req.files.attachment[0].originalname.match(/\.(jpg|jpeg|png|doc|exl)$/)
    ) {
      return res
        .status(400)
        .json({
          message:
            "Invalid file type. Only jpeg, jpg and png images are allowed in attachment",
        });
    }
    let file1URL = `${"uploads/" + req.files.attachment[0].filename}`;

    let isExists = await User.findOne({ userId: user.userId });
    if (!isExists) return res.status(400).json({ error: "User Not Found" });

    let deposit = new Deposit({
      userId: user.userId,
      amount,
      message,
      image: file1URL,
    });
    let result = deposit.save();
    if (result) {
      return res
        .status(200)
        .json({ message: "Request Submitted Successfully" });
    } else {
      return res.status(400).json({ error: "Internel Server Error" });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//approve deposite comes here
exports.approveDeposite = async (req, res, next) => {
  try {
    let { depositId } = req.body;
    if (!depositId)
      return res.status(400).json({ error: "Please provide deposit id" });
    let user = req.user.user;
    if (user.role != 1)
      return res
        .status(400)
        .json({ error: "Only admin can perform this action" });
    let request = await Deposit.findOne({ _id: depositId });
    if (request) {
      if (request.status > 0)
        return res.status(400).json({ error: "Request already processed" });

      let userData = await User.findOne({ userId: request.userId });
      let amount = Number(userData.mainWallet) + request.amount;
      let updateRequest = await Deposit.findOneAndUpdate(
        { _id: { $eq: depositId } },
        { $set: { status: 1 } }
      );
      if (!updateRequest)
        return res
          .status(400)
          .json({ error: "Internel server error update request" });
      let update = await User.findOneAndUpdate(
        { userId: { $eq: request.userId } },
        { $set: { mainWallet: amount } }
      );
      if (update) {
        return res
          .status(200)
          .json({ message: "Request Accepted Successfully" });
      } else {
        return res.status(400).json({ error: "Internel Server Error" });
      }
    } else {
      return res.status(400).json({ error: "Request Not Found" });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//pending deposite comes here
exports.pendingDeposite = (req, res) => {};

//rejected deposite comes here
exports.rejectDeposite = async (req, res, next) => {
  try {
    let { depositId } = req.body;
    if (!depositId)
      return res.status(400).json({ error: "Please provide deposit id" });
    let user = req.user.user;
    if (user.role != 1)
      return res
        .status(400)
        .json({ error: "Only admin can perform this action" });
    let request = await Deposit.findOne({ _id: depositId });

    if (request) {
      if (request.status > 0)
        return res.status(400).json({ error: "Request already processed" });
      let updateRequest = await Deposit.findOneAndUpdate(
        { _id: { $eq: depositId } },
        { $set: { status: 2 } }
      );
      if (updateRequest) {
        return res.status(200).json({ message: "Request Rejected" });
      } else {
        return res.status(400).json({ error: "Internel Server Error" });
      }
    } else {
      return res.status(400).json({ error: "Request Not Found" });
    }
  } catch (error) {
    next(error);
  }
};
