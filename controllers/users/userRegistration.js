
const jwt = require("jsonwebtoken");
const { encryptPassword, decryptPassword } = require("../../helpers/authentication");
const generateRandomID = require("../../helpers/generateRandomId");
const User = require("../../models/User");
const sendMail = require("../../helpers/sendMail");
const { validRegex } = require("../../constants");

// user login logic comes here
exports.login = async (req, res,next) => {
    try {
        let {email,password,username} = req.body;
        if(!email) return res.status(400).json({error:"Please provide a email"});
        if(!password) return res.status(400).json({error:"Please provide a password"});
        let isExists = await User.findOne({$or:[{email},{username}]});
        if(!isExists) return res.status(400).json({error:"User Not Found"});        
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

// users logout comes here
exports.logout = (req, res) => {};
