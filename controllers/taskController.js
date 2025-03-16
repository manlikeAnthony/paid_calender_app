const Task = require("../models/Task");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");

const scheduleTask = async (req, res) => {
  const { email, title, date } = req.body;
  if (!email || !title || !date) {
    throw new CustomError.BadRequestError("must provide all values");
  }
  const task = await Task.create({ email, title, date });

  res.status(StatusCodes.OK).json({msg:'task scheduled successfully' , task})
};

module.exports = {
  scheduleTask,
};
