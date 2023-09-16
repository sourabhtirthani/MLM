const { json } = require("body-parser");

//all deposite comes here
exports.allDeposite = (req, res) => {};

// user deposit request
exports.requestDeposit = (req,res,next) => {
    try{
        console.log(req);
    }catch(error){
        console.log(error);
        next(error)
    }
}

//approve deposite comes here
exports.approveDeposite = (req, res) => {};

//pending deposite comes here
exports.pendingDeposite = (req, res) => {};

//rejected deposite comes here
exports.rejectDeposite = (req, res) => {};
