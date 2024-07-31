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
  const response = await userSignUpService(fullName, email, password);
  return res.status(response.statusCode).json(response);
};

// EMAIL VERIFICATION
const verifyEmail = async (req, res) => {
  const { id, token } = req.params;
  const response = await verifyEmailService(token, id);
  return res.status(response.statusCode).json(response);
};

// USER LOGIN
const login = async (req, res) => {
  const { email, password } = req.body;
  const response = await userLoginService(email, password);
  return res.status(response.statusCode).json(response);
};

//USER FORGOT PASSWORD
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const response = await userForgotPassword(email, password);
  return res.status(response.statusCode).json(response);
};

//USER RESET PASSWORD
const resetPassword = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;
  const response = await resetPasswordService(id, token, password);
  return res.status(response.statusCode).json(response);
};

//GET ALL USERS
getAllUsers = async (req, res) => {
  const response = await allUsersService();
  return res.status(response.statusCode).json(response);
};

//GET USER BY ID
getUserById = async (req, res) => {
  const id = req.params.id;
  const response = await userByIdService(id);
  return res.status(response.statusCode).json(response);
};

//UPDATE USER
updateUser = async (req, res) => {
  const id = req.params.id;
  const { fullName, email, password, avatar } = req.body;
  const response = await updateUserService(
    id,
    email,
    fullName,
    password,
    avatar
  );
  return res.status(response.statusCode).json(response);
};

//DELETE USER
deleteUser = async (req, res) => {
  const id = req.params.id;
  const response = await deleteUserService(id);
  return res.status(response.statusCode).json(response);
};

userLogout = async (req, res) => {
  const id = req.params.id;
  const response = await userLogoutService(id);
  return res.status(response.statusCode).json(response);
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
