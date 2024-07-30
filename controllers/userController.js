const {
  userSignUpService,
  verifyEmailService,
  userLoginService,
  userForgotPassword,
  resetPasswordService,
  allUsersService,
  userByIdService,
  updateUserService,
  deleteUserService,
  userLogoutService,
} = require("../services/userServices");

// USER SIGNUP
const signUp = async (req, res) => {
  const { email, fullName, password } = req.body;
  const result = await userSignUpService(fullName, email, password);
  return res.status(result.statusCode).json(result);
};

// EMAIL VERIFICATION
const verifyEmail = async (req, res) => {
  const { id, token } = req.params;
  const result = await verifyEmailService(token, id);
  return res.status(result.statusCode).json(result);
};

// USER LOGIN
const login = async (req, res) => {
  const { email, password } = req.body;
  const result = await userLoginService(email, password);
  return res.status(result.statusCode).json(result);
};

//USER FORGOT PASSWORD
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const result = await userForgotPassword(email, password);
  return res.status(result.statusCode).json(result);
};

//USER RESET PASSWORD
const resetPassword = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;
  const result = await resetPasswordService(id, token, password);
  return res.status(result.statusCode).json(result);
};

//GET ALL USERS
getAllUsers = async (req, res) => {
  const result = await allUsersService();
  return res.status(result.statusCode).json(result);
};

//GET USER BY ID
getUserById = async (req, res) => {
  const id = req.params.id;
  const result = await userByIdService(id);
  return res.status(result.statusCode).json(result);
};

//UPDATE USER
updateUser = async (req, res) => {
  const id = req.params.id;
  const { fullName, email, password, avatar } = req.body;
  const result = await updateUserService(id, email, fullName, password, avatar);
  return res.status(result.statusCode).json(result);
};

//DELETE USER
deleteUser = async (req, res) => {
  const id = req.params.id;
  const result = await deleteUserService(id);
  return res.status(result.statusCode).json(result);
};

userLogout = async (req, res) => {
  const id = req.params.id;
  const result = await userLogoutService(id);
  return res.status(result.statusCode).json(result);
};

module.exports = {
  signUp,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  userLogout,
};
