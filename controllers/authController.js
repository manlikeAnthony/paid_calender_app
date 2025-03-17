const CustomError = require("../errors");
const User = require("../models/User");
const crypto = require("crypto");
const {
  attachCookiesToResponse,
  createTokenUser,
  checkPermissions,
  sendVerificationEmail,
  sendResetPasswordEmail,
  createHash,
} = require("../utils");
const Token = require("../models/Token");
const { StatusCodes } = require("http-status-codes");

const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !password || !email) {
    throw new CustomError.BadRequestError(
      "must provide all the required values"
    );
  }
  const alreadyHasAccount = await User.findOne({ email });
  if (alreadyHasAccount) {
    throw new CustomError.BadRequestError(
      "You already have an account here try to login instead"
    );
  }
  const verificationToken = crypto.randomBytes(40).toString("hex");
  const user = await User.create({
    name,
    email,
    password,
    verificationToken,
  });
  const origin = "http://localhost:3000"; //incase a frontend is created make sure you match this with the name
  await sendVerificationEmail({
    name: user.name,
    email: user.email,
    verificationToken: user.verificationToken,
    origin,
  });
  res.status(StatusCodes.CREATED).json({
    msg: "Success , please check your email to verify account",
  });
};
const verifyEmail = async (req, res) => {
  const { verificationToken, email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.UnauthenticatedError("verification failed");
  }
  if (user.verificationToken !== verificationToken) {
    throw new CustomError.UnauthenticatedError("verification failed");
  }
  user.isVerified = true;
  user.verificationToken = "";
  user.verified = Date.now();
  await user.save();

  res.status(StatusCodes.OK).json({ msg: "Email successfully Verified" });
};
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError.BadRequestError("must provide all values");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.UnauthenticatedError("invalid credentials");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("invalid credentials");
  }
  if (!user.isVerified) {
    throw new CustomError.UnauthenticatedError("Account not verified");
  }
  let message = "";
  if (!user.isPaid) {
    message =
      "Dear user , you are not a premium user ,no broke users  are allowed access to premium features,thank you";
  }else{
    message = "welcome premium user"
  }
  const tokenUser = createTokenUser(user);

  let refreshToken = "";
  const existingToken = await Token.findOne({ user: user._id });
  if (existingToken) {
    const { isValid } = existingToken;
    if (!isValid) {
      throw new CustomError.UnauthenticatedError("invalid credentials");
    }
    refreshToken = existingToken.refreshToken;
    attachCookiesToResponse({ res, user: tokenUser, refreshToken });
    res.status(StatusCodes.OK).json({ tokenUser, msg: message });
    return;
  }
  refreshToken = crypto.randomBytes(40).toString("hex");
  const userAgent = req.headers["user-agent"];
  const ip = req.ip;
  const userToken = { refreshToken, userAgent, ip, user: user._id };
  await Token.create(userToken);

  attachCookiesToResponse({ res, user: tokenUser, refreshToken });
  res.status(StatusCodes.OK).json({ user: tokenUser, msg: message });
};


const logout = async (req, res) => {
  await Token.findOneAndDelete({ user: req.user.userId });

  res.cookie("accessToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.cookie("refreshToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "user logged out " });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new CustomError.BadRequestError(
      "must provide all the required vlues"
    );
  }
  const user = await User.findOne({ email });
  if (user) {
    const passwordToken = crypto.randomBytes(70).toString("hex");
    const origin = "http://localhost:3000";

    await sendResetPasswordEmail({
      name: user.name,
      email: user.email,
      token: passwordToken,
      origin,
    });
    const tenMinutes = 1000 * 60 * 10;
    const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);
    user.passwordToken = createHash(passwordToken);
    user.passwordTokenExpirationDate = passwordTokenExpirationDate;
    await user.save();
  }

  res
    .status(StatusCodes.OK)
    .json({ msg: "please check your email for reset password link" });
};

const resetPassword = async (req, res) => {
  const { token, email, password } = req.body;
  if (!token || !email || !password) {
    throw new CustomError.BadRequestError("provide all the values");
  }
  const user = await User.findOne({ email });
  if (user) {
    const currentDate = new Date();
    if (
      user.passwordToken === createHash(token) ||
      user.passwordTokenExpirationDate > currentDate
    ) {
      user.password = password;
      user.passwordToken = null;
      user.passwordTokenExpirationDate = null;
      await user.save();
    }
  }
  res.status(StatusCodes.OK).json({ msg: "password successfully reset" });
};

module.exports = {
  register,
  verifyEmail,
  login,
  logout,
  forgotPassword,
  resetPassword,
};
