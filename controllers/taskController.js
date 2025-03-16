const Task = require("../models/Task");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const checkPermissions = require("../utils/checkPermissions");

const scheduleTask = async (req, res) => {
  const {title, date } = req.body;
  if (!title || !date) {
    throw new CustomError.BadRequestError("must provide all values");
  }
  req.body.email = req.user.email;
  req.body.user = req.user.userId;
  const task = await Task.create(req.body);
  res.status(StatusCodes.OK).json({ msg: "task scheduled successfully", task });
};

const getAllTasks = async (req, res) => {
  const tasks = await Task.find({user: req.user.userId});
  res.status(StatusCodes.OK).json({ tasks });
};

const getSingleTask = async (req, res) => {
  const { id: taskId } = req.params;
  const task = await Task.findOne({ _id: taskId});
  if (!task) {
    throw new CustomError.NotFoundError(`No task with id : ${taskId}`);
  }
  checkPermissions(req.user, task.user);
  res.status(StatusCodes.OK).json({ task });
};

const updateTask = async (req, res) => {
  const { id: taskId } = req.params;
  const task = await Task.findOneAndUpdate({ _id: taskId }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!task) {
    throw new CustomError.NotFoundError(`No task with id : ${taskId}`);
  }
  checkPermissions(req.user, task.user);
  res.status(StatusCodes.OK).json({ task });
};

const deleteTask = async (req, res) => {
  const { id: taskId } = req.params;
  const task = await Task.findOneAndDelete({
    _id: taskId,
  });
  if (!task) {
    throw new CustomError.NotFoundError(`No task with id : ${taskId}`);
  }
  checkPermissions(req.user, task.user);
  res.status(StatusCodes.OK).json({ msg : "Task deleted successfully" });
};

module.exports = {
  scheduleTask,
  getAllTasks,
  getSingleTask,
  updateTask,
  deleteTask,
};
