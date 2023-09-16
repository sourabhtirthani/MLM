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
const verifyToken = require("../helpers/verifyToken");

// Sign-up for user
router.post("/signup", errorHandler,userRegistration.signup);

// sign in for user
router.post("/signin", errorHandler,userRegistration.login);

// forgot password
router.post("/forgot", errorHandler,userRegistration.forgotPassword);

// reset password
router.post("/reset", errorHandler,userRegistration.reset);

// logout
router.post("/logout", userRegistration.logout);

//============================================== USERS DEPOSITE ==========================================
// all deposite
router.get("/all",verifyToken, userDeposite.allDeposite);

// user deposite request
router.post("/requestDesposit",verifyToken, userDeposite.requestDeposit);

// approve Deposite
router.get("/approveDeposite",verifyToken, userDeposite.approveDeposite);

// pending Deposite
router.get("/pendingDeposite",verifyToken, userDeposite.pendingDeposite);

// reject Deposite
router.get("/rejectDeposite",verifyToken, userDeposite.rejectDeposite);

//=========================================== USERS Investment ===========================================

// investment
router.post("/investment",verifyToken, userInvestment.investment);

// investment History
router.get("/investmentHistory",verifyToken, userInvestment.investmentHistory);

//=========================================== USERS Fund Trnasfer ===========================================

// Fund Trnasfer
router.post("/fundTrnasfer", userFundTransfer.fundTransfer);

// fund Trnasfer History
router.get("/fundTrnasferHistory", userFundTransfer.fundTransferHistory);

//=========================================== USERS SECTION ===========================================

//all users
router.get("/allUsers", userSection.allusers);

// active users
router.get("/activeUsers", userSection.activeUsers);

// Inactive users
router.get("inactiveUsers", userSection.inActiveUsers);

//=========================================== USERS INCOME ===========================================

//ROI income
router.get("/roi-Income", userIncome.claclulateROI);

// Level income
router.get("/level-Income", userIncome.claclulateLEVEL);

//=========================================== USERS Withdraw ===========================================

//withdraw request
router.post("/withdraw", userWithdraw.withdrawal);

// withdraw history
router.get("/withdrawHistory", userWithdraw.withdrwalHistory);

//=========================================== USERS trnasactions ===========================================

router.get("/trnasactions", userTransactions.transactions);

module.exports = router;
