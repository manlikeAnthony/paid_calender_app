const createTokenUser = (user) => {
  return { name: user.name, userId: user._id , isPaid: user.isPaid };
};

module.exports = createTokenUser;
