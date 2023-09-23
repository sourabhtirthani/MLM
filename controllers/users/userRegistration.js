
const jwt = require("jsonwebtoken");
const { encryptPassword, decryptPassword } = require("../../helpers/authentication");
const generateRandomID = require("../../helpers/generateRandomId");
const User = require("../../models/User");
const sendMail = require("../../helpers/sendMail");
const { validRegex } = require("../../constants");
const { findOneAndUpdate } = require("../../models/Transfer");

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
    let userId = generateRandomID();
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
        const { userId, token, password } = req.body;
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
exports.resetPassword = async (req, res) => {
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
        let {username} = req.body;
        if(!username) return res.status(400).json({error:"Please provide a username"});
        let isExists = await User.findOne({userId:user.userId});
        if(!isExists) return res.status(400).json({error:"User Not Found"});
        let isUserNameExist = await User.find({"username":{$eq:username,$ne:isExists.username}});
        if(isUserNameExist.length > 0) return res.status(400).json({error:"Username Already Exists"});
        let update = await User.updateOne({"userId":{$eq:user.userId}},{$set:{"username":username}});
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
