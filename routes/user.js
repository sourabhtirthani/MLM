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

// forgot password
router.post("/forgot", errorHandler, userRegistration.forgotPassword);

// reset password
router.post("/reset", errorHandler, userRegistration.reset);

// reset user password
router.post("/resetPassword", errorHandler, userRegistration.resetPassword);

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

// logout
router.post("/logout", userRegistration.logout);

//============================================== USERS DEPOSITE ==========================================
// all deposite
router.get("/all", [errorHandler,verifyToken], userDeposite.allDeposite);

// user deposite request
router.post("/requestDesposit",[upload.fields([{ name: 'attachment', maxCount: 1 }]),verifyToken,errorHandler], userDeposite.requestDeposit);

// approve Deposite
router.get("/approveDeposite",[verifyToken,errorHandler], userDeposite.approveDeposite);

// pending Deposite
router.get("/pendingDeposite", [verifyToken,errorHandler], userDeposite.pendingDeposite);

// reject Deposite
router.post("/rejectDeposite", [verifyToken,errorHandler], userDeposite.rejectDeposite);

//=========================================== USERS Investment ===========================================

// investment
router.post("/investment", [verifyToken,errorHandler], userInvestment.investment);

// investment History
router.get("/investmentHistory", [verifyToken,errorHandler], userInvestment.investmentHistory);

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
router.get("/level-Income", userIncome.claclulateLEVEL);

//=========================================== USERS Withdraw ===========================================

//withdraw request
router.post("/withdraw", [verifyToken,errorHandler]  ,userWithdraw.withdrawal);

// withdraw history
router.get("/withdrawHistory", [verifyToken,errorHandler]  ,userWithdraw.withdrwalHistory);

//=========================================== USERS trnasactions ===========================================

router.get("/trnasactions", userTransactions.transactions);

//============================================User DashBoard===============================================

router.get("/dashboard",[verifyToken,errorHandler],dashboard.userDashboard);

module.exports = router;
