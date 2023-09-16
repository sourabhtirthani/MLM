const { json } = require("body-parser");
const User = require("../../models/User");
const Deposit = require("../../models/Deposits");


//all deposite comes here
exports.allDeposite = async (req, res) => {
    try{
        let user = req.user.user;
        if(!user) return res.status(400).json({error:"Please provide a token"});
        let result = await Deposit.find({userId:user.userId});
        return res.status(200).json({result});
    }catch(error){
        console.log(error);
        next(error);
    }
};

// user deposit request
exports.requestDeposit = async (req,res,next) => {
    try{
        let user = req.user.user;
        if(!user) return res.status(400).json({error:"Please provide user data"});
        let {amount,message} = req.body;
        if(!amount) return res.status(400).json({error:"Please provide amount"});        
        if(Number(amount) <= 0) return res.status(400).json({error:"Please provide a valid amount"});

        if(Object.keys(req.files).length == 0){
            return res.status(400).json({ message: "Please provide a document" });
        }

        if(!req.files.attachment[0].originalname.match(/\.(jpg|jpeg|png|doc|exl)$/)){
            return res.status(400).json({ message: "Invalid file type. Only jpeg, jpg and png images are allowed in attachment" });
        }
        let file1URL = `${"uploads/" + req.files.attachment[0].filename}`;

        let isExists = await User.findOne({ userId:user.userId });
        if (!isExists) return res.status(400).json({ error: "User Not Found" });

        let deposit = new Deposit({
            userId:user.userId,
            amount,
            message,
            image:file1URL
        })
        let result = deposit.save();
        if(result){
            return res.status(200).json({message:"Request Submitted Successfully"});
        }else{
            return res.status(400).json({error:"Internel Server Error"});
        }
    }catch(error){
        console.log(error);
        next(error)
    }
}

//approve deposite comes here
exports.approveDeposite = async (req, res,next) => {
    try{
        let {depositId} = req.body;
        if(!depositId) return res.status(400).json({error:"Please provide deposit id"});
        let user = req.user.user;
        if(user.role != 1) return res.status(400).json({error:"Only admin can perform this action"});
        let request = await Deposit.findOne({_id:depositId});
        if(request){
            if(request.status != 0) return res.status(400).json({error:"Request already accepted"});

            let userData = await User.findOne({userId:request.userId});
            let amount = Number(userData.mainWallet) + request.amount;
            let updateRequest = await Deposit.findOneAndUpdate({_id:{$eq:depositId}},{$set : {status:1}});
            if(!updateRequest) return res.status(400).json({error:"Internel server error update request"});
            let update = await User.findOneAndUpdate(
                { userId: { $eq: request.userId } },
                { $set: { mainWallet: amount } }
            )
            if(update){                
                return res.status(200).json({message:"Request Accepted Successfully"});
            }else{
                return res.status(400).json({error:"Internel Server Error"});
            }            
        }else{
            return res.status(400).json({error:"Request Not Found"});
        }
    }catch(error){
        console.log(error);
        next(error);
    }
};

//pending deposite comes here
exports.pendingDeposite = (req, res) => {};

//rejected deposite comes here
exports.rejectDeposite = (req, res) => {};
