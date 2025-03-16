const { isTokenValid, attachCookiesToResponse } = require("../utils");
const Token = require("../models/Token");
const CustomError = require("../errors");

const authenticateUser = async (req, res, next) => {
  const { accessToken, refreshToken } = req.signedCookies;
  try {
    if(accessToken){
        const payload =  isTokenValid(accessToken);
        req.user = payload.user;
        return next()
    }
    const payload = isTokenValid(refreshToken)
    const existingToken = await Token.findOne({
        user : payload.user.userId,
        refreshToken : payload.refreshToken
    })

    if(!existingToken || !existingToken?.isValid){
        throw new CustomError.UnauthenticatedError('Authentication invalid')
    }
    attachCookiesToResponse({
        res,
        user : payload.user,
        refreshToken: existingToken.refreshToken
    })
    req.user = payload.user;
    next()
} catch (error) {
    throw new CustomError.UnauthenticatedError('Authentication invalid')
}
};

const isSubscribed = async (req, res, next) => {
  if (!req.user.isPaid) {
    throw new CustomError.UnauthenticatedError("user must be subscribed to access this feature as it is a premium feature");
  }
  next();
};
module.exports = { authenticateUser, isSubscribed };