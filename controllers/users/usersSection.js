const {
  membersInformation,
  totalROIOfALLUSERS,
} = require("../../helpers/calclulateRewards");

//fetch all users
const User = require("../../models/User");

exports.allusers = async (req, res) => {
  let user = req.user.user;
  const userId = user.userId;
  let members = await membersInformation(userId);
  res.status(200).json({ result: members.totalMembers });
};

// fetch active users
exports.activeUsers = async (req, res) => {
  let user = req.user.user;
  const userId = user.userId;
  let members = await membersInformation(userId);
  res.status(200).json({ result: members.activeMembers });
};

// fetch inactive users
exports.inActiveUsers = async (req, res) => {
  let user = req.user.user;
  const userId = user.userId;
  let members = await membersInformation(userId);
  res.status(200).json({ result: members.deactiveMembers });
};

exports.directTeam = async (req, res) => {
  let user = req.user.user;
  const userId = user.userId;
  let members = await membersInformation(userId);
  res.status(200).json({ result: members.directTeam });
};

exports.roiTableForAllUsers = async (req, res) => {
  let members = await totalROIOfALLUSERS();
  res.status(200).json({ result: members });
};

exports.allusersForAdmin = async (req, res) => {
  let Users = await User.find({});
  res.status(200).json({ result: Users });
};
