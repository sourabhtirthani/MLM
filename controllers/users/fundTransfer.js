const Transfer = require("../../models/Transfer");
const User = require("../../models/User");

//users investment
exports.fundTransfer = async (req, res) => {
    try{
        let user = req.user.user;
        let {userId,amount} = req.body;
        if(!userId) return res.status(400).json({error:"PLeae provide a user id"});
        if(!amount || Number(amount) <= 0) return res.status(400).json({error:"Enter Valid Amount"});
        if(!user.userId) return res.status(400).json({error:"Please provide userId"});

        // USER EXISTS CHECK
        let isExists = await User.findOne({userId});
        if(!isExists) return res.status(400).json({error:"User not found!"});

        // LOGGED IN USER FIND
        let isUserExists = await User.findOne({userId:user.userId});
        if(!isUserExists) return res.status(400).json({error:"Sender User not found!"});

        if(user.role != 1) {

            let UserBalance = Number(isUserExists.mainWallet);
            if(Number(amount) > Number(UserBalance)) return res.status(400).json({error:"Insufficient Fund for transfer"});
        }

        let transferHisory = await Transfer({username:isUserExists.username,fromUserId:isUserExists.userId,toUserId:userId,amount});
        transferHisory = transferHisory.save();
        if(transferHisory){

            let updatedFromBalance = Number(isUserExists.mainWallet) - Number(amount);
            let updateFrom = await User.findOneAndUpdate({userId:user.userId},{$set:{"mainWallet":updatedFromBalance}});
            if(!updateFrom) return res.status(400).json({error:"Internel server error while update from userId Balance"});

            let updateBalance = Number(isExists.mainWallet) + Number(amount);
            let update = await User.findOneAndUpdate({userId},{$set:{"mainWallet":updateBalance}});
            if(update){
                return res.status(200).json({message:"Fund Transfer Successfully"});
            }else{
                return res.status(400).json({error:"Error while update balance"});
            }            
        }else{
            return res.status(400).json({error:"Internel Server Error"});
        }

    }catch(error){
        console.log(error);
        next(error);
    }
};

// return the investment history
exports.fundTransferHistory = async (req, res, next) => {
    try {
        let user = req.user.user;
        if(!user) return res.status(400).json({error:"Please provide a user id"});

        // USER EXISTS CHECK
        let isExists = await User.findOne({userId:user.userId});
        if(!isExists) return res.status(400).json({error:"User not found!"});
        let { startDate, endDate, keywords } = req.body;
        let result = await filterData(user.userId, startDate, endDate, keywords);
        
        if(!result){
            result = await Transfer.find({ $or: [{ fromUserId:user.userId }, { toUserId:user.userId }] }).sort({createdAt: 'desc'});
        }
        let array = Array();
        let j=1;
        for(let i=0;i<result.length;i++){    
            const createdAt = new Date(result[i].createdAt);            
            const formattedDate = createdAt.toLocaleDateString();
            const formattedTime = createdAt.toLocaleTimeString();               
            array.push({id:j+i,datetime:formattedDate+" "+formattedTime,type:result[i].fromUserId == user.userId ? 'Send' : result[i].toUserId == user.userId ? 'Received' : "",...result[i]._doc});
        }
        return res.status(200).json({result:array});
    } catch (error) {
        console.log(error);
        next(error);
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
          {fromUserId:userId},
          {$or : [{fromUserId:keywords},{toUserId:keywords},{username:keywords}]}          
        ],
      };
    } else if (keywords && !startDate && !endDate) {
      query = {
        $and: [
          {fromUserId:userId},
          {$or : [{fromUserId:keywords},{toUserId:keywords},{username:keywords}]}            
        ],
      };    
    } else if (!keywords && startDate && endDate) {
      const sdate = new Date(startDate);
  
      const edate = new Date(endDate);
      query = {
        $and: [
          { createdAt: { $gte: sdate, $lte: edate } },
          {fromUserId:userId},          
        ],
      };
    
    }
    if(!query){
      query = {$or: [{ fromUserId:userId }, { toUserId:userId }]}
    }
    console.log(query);
    let res = await Transfer.find(query);  
    return res;
  };