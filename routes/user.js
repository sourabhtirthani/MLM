const router = require("express").Router();
const userRegistration = require("../controllers/users/userRegistration");
const userDeposite = require("../controllers/users/userDeposite");
const userInvestment = require("../controllers/users/userInvestment");
const userFundTransfer = require("../controllers/users/fundTransfer");
const userSection = require("../controllers/users/usersSection");
const userIncome = require("../controllers/users/userIncome");
const userWithdraw = require("../controllers/users/userWithdraw");
const userTransactions = require("../controllers/users/userstransactions");
const errorHandler = require("../middlewares/errorHandler");
const verifyToken = require("../middlewares/verifyToken");
const dashboard=require('../controllers/users/userDashboard');
const admin=require("../controllers/users/settings");
const path = require('path');
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, callback) => callback(null, './public/uploads'),
    filename: (req, file, callback) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        callback(null, uniqueName);
    }
});

let upload = multer({
    storage,
    limit: {
        fileSize: 1000000 * 100
    }
});

// Sign-up for user
router.post("/signup", errorHandler, userRegistration.signup);

// sign in for user
router.post("/signin", errorHandler, userRegistration.login);

// sign in for user
router.post("/adminsignin", errorHandler, userRegistration.adminLogin);

// Sign-up for user
router.post("/adminsignup", errorHandler, userRegistration.adminsignup);

// forgot password
router.post("/forgot", errorHandler, userRegistration.forgotPassword);

// reset password
router.post("/reset", errorHandler, userRegistration.reset);

// reset user password
router.post("/resetPassword", [errorHandler,verifyToken], userRegistration.resetPassword);

// block user
router.post("/block",[errorHandler,verifyToken], userRegistration.blockUser)

// edit user
router.post("/editUser",[errorHandler,verifyToken], userRegistration.editUser)

// user detail
router.get("/userDetail",[errorHandler,verifyToken], userRegistration.userDetail);

// user detai by id
router.post("/userDetailById",errorHandler, userRegistration.userDetailById);

// send otp
router.post("/sendotp",errorHandler, userRegistration.sendOtp);

// verify otp
router.post("/verifyotp",errorHandler,userRegistration.verifyOtp);

// send otp to mail
router.post("/sendOtpMail",errorHandler,userRegistration.sendMailOtp);

// verify mail otp
router.post("/verifyMailOtp",errorHandler,userRegistration.verifyEmailOtp);

// logout
router.get("/totalUsers",errorHandler, userRegistration.totalUsers);

// logout
router.post("/logout", userRegistration.logout);

//============================================== USERS DEPOSITE ==========================================
// all deposite
router.post("/all", [errorHandler,verifyToken], userDeposite.allDeposite);

// all user deposits
router.post("/allUserDeposit", [errorHandler], userDeposite.allUserDetails);

// user deposite request
router.post("/requestDesposit",[upload.fields([{ name: 'attachment', maxCount: 1 }]),verifyToken,errorHandler], userDeposite.requestDeposit);

// approve Deposite
router.post("/approveDeposite",[verifyToken,errorHandler], userDeposite.approveDeposite);

// pending Deposite
router.get("/pendingDeposite", [verifyToken,errorHandler], userDeposite.pendingDeposite);

// reject Deposite
router.post("/rejectDeposite", [verifyToken,errorHandler], userDeposite.rejectDeposite);

//=========================================== USERS Investment ===========================================

// investment
router.post("/investment", [verifyToken,errorHandler], userInvestment.investment);

// investment History
router.post("/investmentHistory", [verifyToken,errorHandler], userInvestment.investmentHistory);

//=========================================== USERS Fund Trnasfer ===========================================

// Fund Trnasfer
router.post("/fundTrnasfer", [verifyToken,errorHandler] ,userFundTransfer.fundTransfer);

// fund Trnasfer History
router.get("/fundTrnasferHistory",[verifyToken,errorHandler] , userFundTransfer.fundTransferHistory);

//=========================================== USERS SECTION ===========================================

//all users
router.get("/allUsers",[verifyToken,errorHandler] , userSection.allusers);

// active users
router.get("/activeUsers", [verifyToken,errorHandler] ,userSection.activeUsers);

// Inactive users
router.get("/inactiveUsers",[verifyToken,errorHandler] , userSection.inActiveUsers);

// direct Team
router.get("/directTeam",[verifyToken,errorHandler] , userSection.directTeam);
//=========================================== USERS INCOME ===========================================

//ROI income
router.get("/roi-Income", userIncome.claclulateROI);

// Level income
router.get("/level-Income", [verifyToken,errorHandler],userIncome.claclulateLEVEL);

//=========================================== USERS Withdraw ===========================================

//withdraw request
router.post("/withdraw", [verifyToken,errorHandler]  ,userWithdraw.withdrawal);

// withdraw history
router.get("/withdrawHistory", [verifyToken,errorHandler]  ,userWithdraw.withdrwalHistory);

// All withdraw history
router.get("/allWithdrawHistory", [verifyToken,errorHandler]  ,userWithdraw.AllWithdrawRequests);

// withdraw history
router.post("/approveWithdraw", [verifyToken,errorHandler]  ,userWithdraw.approvewithdraw);

// withdraw history
router.post("/rejectWithdraw", [verifyToken,errorHandler]  ,userWithdraw.rejectwithdraw);

//=========================================== USERS trnasactions ===========================================

router.post("/trnasactions",[verifyToken,errorHandler], userTransactions.transactions);

//============================================User DashBoard===============================================

router.get("/dashboard",[verifyToken,errorHandler],dashboard.userDashboard);


//===========================================admin Settings============================================

router.post("/adminSettings",[verifyToken,errorHandler],admin.settings);

router.get("/fetchSettings",[verifyToken,errorHandler],admin.fetchSetting)

module.exports = router;
