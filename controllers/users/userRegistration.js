
const jwt = require("jsonwebtoken");
const { encryptPassword, decryptPassword } = require("../../helpers/authentication");
const generateRandomID = require("../../helpers/generateRandomId");
const User = require("../../models/User");
const sendMail = require("../../helpers/sendMail");
const { validRegex } = require("../../constants");
const { findOneAndUpdate } = require("../../models/Transfer");
const OTP = require("../../models/Otp");

// user login logic comes here
exports.login = async (req, res,next) => {
    try {
        let {email,password,username} = req.body;
        if(!email) return res.status(400).json({error:"Please provide a email"});
        if(!password) return res.status(400).json({error:"Please provide a password"});
        let isExists = await User.findOne({$or:[{email},{username}]});
        if(!isExists) return res.status(400).json({error:"User Not Found"});    
        if(isExists.block == true) return res.status(400).json({error:"You are blocked please contact with admin"});
        const isAuthUser = await decryptPassword(password, isExists.password);
        if(isAuthUser){
            let { password, ...data } = isExists._doc;
            const jwtToken = jwt.sign({ user: data }, process.env.SECRET, { expiresIn: '24h' })
            return res.status(200).json({result: { user: data, token: jwtToken }});
        }else{
            return res.status(400).json({error:"Email and password is not valid"});
        }
    } catch (error) {
        next(error);
    }
};

// user login logic comes here
exports.adminLogin = async (req, res,next) => {
    try {
        let {email,password,username} = req.body;
        if(!email) return res.status(400).json({error:"Please provide a email"});
        if(!password) return res.status(400).json({error:"Please provide a password"});
        let isExists = await User.findOne({$or:[{email},{username}]});
        if(!isExists) return res.status(400).json({error:"User Not Found"});    
        if(isExists.block == true) return res.status(400).json({error:"You are blocked please contact with admin"});
        if(Number(isExists.role) != 1) return res.status(400).json({error:"Only Admin can access this panel"});
        const isAuthUser = await decryptPassword(password, isExists.password);
        if(isAuthUser){
            let { password, ...data } = isExists._doc;
            const jwtToken = jwt.sign({ user: data }, process.env.SECRET, { expiresIn: '24h' })
            return res.status(200).json({result: { user: data, token: jwtToken }});
        }else{
            return res.status(400).json({error:"Email and password is not valid"});
        }
    } catch (error) {
        next(error);
    }
};

// user signup logics comes here
exports.adminsignup = async (req, res, next) => {
    try {
      let { email, password: passwordd, mobileNo, username, role } = req.body;
      if (!email)
        return res.status(400).json({ error: "Please provide a Email" });
      if (!passwordd)
        return res.status(400).json({ error: "Please provide a Password" });
      if (!mobileNo)
        return res.status(400).json({ error: "Please provide a Mobile" });
        
      if(!validRegex.test(email)) return res.status(400).json({error:"Please provide a valid email address"});

  
      let isExists = await User.findOne({ $or: [{ email }, { username }] });
      if (isExists) return res.status(400).json({ error: "User already Exists" });
      let roleId = role; 
      if(!roleId) roleId = 0;
  
      let encrptPass = await encryptPassword(passwordd);
      let userId = generateRandomID();
      let UserSave = new User({
        email,
        password: encrptPass,
        mobileNo,
        userId,
        username,
        role:roleId     
      });
  
      let result = await UserSave.save();      
      const { password, ...data } = result._doc;
      return res.status(200).json({ message: "Registered successfully", data });
    } catch (error) {
      console.log(error, " errrrr");
      next(error);
    }
  };

// user signup logics comes here
exports.signup = async (req, res, next) => {
  try {
    let { email, password: passwordd, mobileNo, username, refferalCode,role } = req.body;
    if (!email)
      return res.status(400).json({ error: "Please provide a Email" });
    if (!passwordd)
      return res.status(400).json({ error: "Please provide a Password" });
    if (!mobileNo)
      return res.status(400).json({ error: "Please provide a Mobile" });
      if (!refferalCode)
      return res.status(400).json({ error: "Please provide a Refferal Code" });
    if(!validRegex.test(email)) return res.status(400).json({error:"Please provide a valid email address"});

    // CHECK REFFERAL CODE EXISTS
    let isRefferalExists = await User.findOne({userId:refferalCode});
    if(!isRefferalExists)  return res.status(400).json({error:"Refferal Code invalid"});

    let isExists = await User.findOne({ $or: [{ email }, { username }] });
    if (isExists) return res.status(400).json({ error: "User already Exists" });
    let roleId = role; 
    if(!roleId) roleId = 0;

    let encrptPass = await encryptPassword(passwordd);
    let userId = "TA"+generateRandom4DigitNumber();
    console.log("userId",userId);
    let UserSave = new User({
      email,
      password: encrptPass,
      mobileNo,
      userId,
      username,
      role:roleId,
      refferBy:refferalCode
    });

    let result = await UserSave.save();
    let addRefferalTo = await User.findOneAndUpdate({userId:refferalCode},{$push:{"refferedTo":userId}});
    const { password, ...data } = result._doc;
    return res.status(200).json({ message: "Registered successfully", data });
  } catch (error) {
    console.log(error, " errrrr");
    next(error);
  }
};
function generateRandom4DigitNumber() {
    // Generate a random number between 1000 and 9999
    const min = 100000;
    const max = 999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
//user forgot password comes here
exports.forgotPassword = async (req, res,next) => {
    try{
        let {email} = req.body;
        if(!email) return res.status(400).json({error:"Please provide a email"});
        let isExists = await User.findOne({email});
        if(!isExists) return res.status(400).json({error:"User Not Found"});
        let token = Math.random().toString(36).substr(2);
        let update = await User.updateOne({"email":{$eq:email}},{$set:{"token":token}});
        if(update){
            let { message } = require("../../templates/forgotpassword");
            await sendMail('Forget password mail', message(isExists, token), email);
            return res.status(200).json({message:"Please check your mail to change your password"})
        }else{
            return res.status(400).json({error:"Something went wrong"});
        }
    }catch(error){
        console.log(error," error");
        next(error);
    }
};

//users reset password comes here
exports.reset = async (req, res) => {
    try{
        const { userId, token, password,oldPassword } = req.body;
        if (!token) return res.status(400).json({ error: 'Please provide token' });
        if (!password) return res.status(400).json({ error: 'Please provide password' });
        let isExists = await User.findOne({userId});
        if(!isExists) return res.status(400).json({error:"User Not Found"});

        // CHECK VALID REQUEST
        let isValidRequest = await User.findOne({userId,token});
        if(!isValidRequest) return res.status(400).json({error:"Invalid Reset password request"});

        // CHECK OLD PASSWORD
        const isAuthUser = await decryptPassword(password, isExists.password);
        if (isAuthUser) return res.status(400).json({ error: "Password should be different from old password" });

        // UPDATE NEW PASSWORD
        let encPass = await encryptPassword(password);
        let oldPass = await encryptPassword(oldPassword);
        if (oldPass!=isExists.password) return res.status(400).json({ error: "Old Password Must be same" });

        let update = await User.updateOne({"userId":{$eq:userId}},{$set:{"password":encPass,"token":""}});

        if(update){
            return res.status(200).json({message:"Passoword reset successfully"});
        }else{
            return res.status(400).json({error:"Something went wrong"});
        }
    }catch(error){
        console.log(error," error");
        next(error);
    }
};

//users reset password comes here
exports.resetPassword = async (req, res,next) => {
    try{
        let userId = req.user.user.userId;
        const { password } = req.body;
        if (!userId) return res.status(400).json({ error: 'Please provide userId' });
        if (!password) return res.status(400).json({ error: 'Please provide password' });
        let isExists = await User.findOne({userId});
        if(!isExists) return res.status(400).json({error:"User Not Found"});

        // CHECK VALID REQUEST
        let isValidRequest = await User.findOne({userId});
        if(!isValidRequest) return res.status(400).json({error:"Invalid Reset password request"});

        // CHECK OLD PASSWORD
        const isAuthUser = await decryptPassword(password, isExists.password);
        if (isAuthUser) return res.status(400).json({ error: "Password should be different from old password" });

        // UPDATE NEW PASSWORD
        let encPass = await encryptPassword(password);
        let update = await User.updateOne({"userId":{$eq:userId}},{$set:{"password":encPass}});

        if(update){
            return res.status(200).json({message:"Passoword reset successfully"});
        }else{
            return res.status(400).json({error:"Something went wrong"});
        }
    }catch(error){
        console.log(error," error");
        next(error);
    }
};

// users logout comes here
exports.logout = (req, res) => {};

// block user
exports.blockUser = async (req,res,next) => {
    try{
        let {userId,isBlock} = req.body;
        let user = req.user.user;
        if(!user) return res.status(400).json({error:"Please provide a authenticate token"});
        if(!userId) return res.status(400).json({error:"Please provide a userId"});
        if(!isBlock) return res.status(400).json({error:"Please provide a block status"});
        let isExists = await User.findOne({userId});
        if(!isExists) return res.status(400).json({error:"User Not Found"});

        if(user.role != 1) return res.status(400).json({error:"Only admin can perform this action"});

        let block = await User.findOneAndUpdate({userId},{block:true});
        if(block){
            return res.status(200).json({message:"Block status updated"});
        }else{
            return res.status(400).json({error:"Internel Server Error"});
        }
    }catch(error){
        console.log(error);
        next(error);
    }
}

// edit user
exports.editUser = async(req,res,next) => {
    try{
        let user = req.user.user;
        let {bankName,accounttype,accountNumber,IFSCCode,UsdtAddress} = req.body;        
console.log(req.files)
        if (Object.keys(req.files).length == 0) {
            return res.status(400).json({ message: "Please provide a document" });
          }
      
          if (
            !req.files.photo[0].originalname.match(/\.(jpg|jpeg|png|doc|exl)$/)
          ) {
            return res
              .status(400)
              .json({
                message:
                  "Invalid file type. Only jpeg, jpg and png images are allowed in attachment",
              });
          }          


        let isExists = await User.findOne({userId:user.userId});
        if(!isExists) return res.status(400).json({error:"User Not Found"});
        let file1URL = `${"uploads/" + req.files.photo[0].filename}`;
        
        const updateData={
            bankName:bankName,
            accounttype:accounttype,
            accountNumber:accountNumber,
            IFSCCode:IFSCCode,
            UsdtAddress: UsdtAddress,
            photo:file1URL
        }        
        //  await User.updateOne({"userId":{$eq:user.userId}},{$set:{updateData}});
         let update =await User.updateMany({ userId :user.userId}, { $set: updateData });
         console.log("update",update);
        if(update){
            return res.status(200).json({message:"Profile updated successfully"});
        }else{
            return res.status(400).json({error:"Internel Server Error"});
        }
    }catch(error){
        next(error);
    }
}

// user details
exports.userDetail = async (req,res,next) => {
    try{
        let user = req.user.user;        
        let result = await User.findOne({userId:user.userId});
        if(!result) return res.status(400).json({error:"User Not Found"});
        return res.status(200).json({result});
    }catch(error){
        next(error);
    }
}

// user detail by id
exports.userDetailById = async (req,res,next) => {
    try{        
        let {userId} = req.body;
        if(!userId) return res.status(400).json({error:"Please provide a user Id"});
        let result = await User.findOne({userId});
        if(!result) return res.status(400).json({error:"User Not Found"});
        let {username,...data} = result;
        return res.status(200).json({result:username});
    }catch(error){
        next(error);
    }
}

// send otp
exports.sendOtp = async (req,res,next) => {
    try{
        let {email} = req.body;
        let result = await User.findOne({email});
        if(!result) return res.status(400).json({error:"User Not Registered"});
        const otp = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
        let update = await User.updateOne({"email":{$eq:email}},{$set:{"otp":otp}});
        let { message } = require("../../templates/otp.js");
        await sendMail('verification Mail', message(otp), email);
        if(update){
            return res.status(200).json({message:"Please check your mail"});
        }else{
            return res.status(400).json({error:"Internel Server Error"});
        }
    }catch(err){
     next(err);
    }
}

exports.verifyOtp = async (req,res,next) => {
    try{
        let {otp,email} = req.body;
        if(!otp) return res.status(400).json({error:"Please provide OTP"});
        if(!email) return res.status(400).json({error:"Please provide email"});
        let result = await User.findOne({email,otp});
        if(!result) return res.status(400).json({error:"Invalid OTP"});
        let update = await User.updateOne({"email":{$eq:email}},{$set:{"otp":""}});
        if(update){
            return res.status(200).json({message:"Verified OTP"});
        }else{
            return res.status(400).json({error:"Internel Server Error"});
        }
    }catch(err){
        next(err);
    }
}

const filterData = async (startDate, endDate, keywords) => {
    let query;
    if (startDate && endDate && keywords) {
        keywords = keywords === "true1" ? true : keywords
        keywords = keywords === "true2" ? true : keywords
      const sdate = new Date(startDate);  
      const edate = new Date(endDate);
      query = {
        $and: [
          { createdAt: { $gte: sdate, $lte: edate } },
          { isInvested: keywords },
          { block: keywords },          
        ],
      };
    } else if (keywords && !startDate && !endDate) {
        keywords = keywords === "true1" ? true : keywords
        keywords = keywords === "true2" ? true : keywords
      query = {
        $or: [
          { block: {$eq:keywords} },
          { isInvested: {$eq : keywords} },          
        ],
      };
    } else if (!keywords && startDate && endDate) {
      const sdate = new Date(startDate);  
      const edate = new Date(endDate);
      query = {
        $and: [
          { createdAt: { $gte: sdate, $lte: edate } }
        ],
      };
    }
    console.log(query);
    let res = await User.find(query);  
    return res;
  };

// get all user information
exports.totalUsers = async (req,res,next) => {
    try{
        let { startDate, endDate, keywords } = req.body;
        let result = await filterData(startDate, endDate, keywords);
        if (!result) {
            result = await User.find({});
        }        
        let array = Array();
        let j = 1;
        for (let i = 0; i < result.length; i++) {
          const createdAt = new Date(result[i].createdAt);
          const formattedDate = createdAt.toLocaleDateString();
          const formattedTime = createdAt.toLocaleTimeString();
          array.push({
            ...result[i]._doc,
            id: j + i,
            datetime: formattedDate + " " + formattedTime            
          });
        }
        return res.status(200).json({result:array});
    }catch(error){
        next(error);
    }
}

// send otp on email
exports.sendMailOtp = async (req,res,next) => {
    try{
        let {email} = req.body;
        if(!email) return res.status(400).json({error:"Please provide a valid email address"});
        const otp = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
        let isExists = await OTP.findOne({email});
        if(isExists){
            
            let update = await OTP.updateOne({"email":{$eq:email}},{$set:{"otp":otp}});
            let { message } = require("../../templates/otp.js");
            await sendMail('verification Mail', message(otp), email);
            if(update){
                return res.status(200).json({message:"Please check your mail"});
            }else{
                return res.status(400).json({error:"Internel Server Error"});
            }
        }else{
            let insert = new OTP({email,otp});
            let datasave = insert.save();
            if(datasave){
                let update = await OTP.updateOne({"email":{$eq:email}},{$set:{"otp":otp}});
                let { message } = require("../../templates/otp.js");
                if(update){
                    return res.status(200).json({message:"Please check your mail"});
                }else{
                    return res.status(400).json({error:"Internel Server Error"});
                }
            }else{
                return res.status(400).json({error:"Internel Server Error"});
            }            
        }

        
    }catch(err){
     next(err);
    }
}

exports.verifyEmailOtp = async (req,res,next) => {
    try{
        let {otp,email} = req.body;
        if(!otp) return res.status(400).json({error:"Please provide OTP"});
        if(!email) return res.status(400).json({error:"Please provide email"});
        let result = await OTP.findOne({email,otp});
        if(!result) return res.status(400).json({error:"Invalid OTP"});
        let update = await OTP.updateOne({"email":{$eq:email}},{$set:{"otp":""}});
        if(update){
            return res.status(200).json({message:"Verified OTP"});
        }else{
            return res.status(400).json({error:"Internel Server Error"});
        }        
    }catch(error){
        next(error);
    }
}
