const { User } = require("../../models/user");

const checkExistingUser = (email) => {
  return User.findOne({ email });
};

const createUser = (newUser) => {
  return newUser.save();
};

const findUser = (userId) => {
  return User.findById(userId);
};

module.exports = {
  checkExistingUser,
  createUser,
  findUser,
};
