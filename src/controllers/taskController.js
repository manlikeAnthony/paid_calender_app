const Task = require("../models/Task");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const checkPermissions = require("../utils/checkPermissions");
const { taskValidator } = require("../validator/validate");


const scheduleTask = async (req, res) => {
  req.body.email = req.user.email;
  req.body.user = req.user.userId;
  const { error, value } = taskValidator(req.body);
  if (error) {
    console.log(error);
    return res.send(error.details.map((details) => details.message));
  }
  const task = await Task.create(req.body);
  res.status(StatusCodes.OK).json({ msg: "task scheduled successfully", task });
};


const getAllTasks = async (req, res) => {
  const tasks = await Task.find({ user: req.user.userId });
  res.status(StatusCodes.OK).json({ tasks });
};


const getSingleTask = async (req, res) => {
  const { id: taskId } = req.params;
  const task = await Task.findOne({ _id: taskId });
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
  res.status(StatusCodes.OK).json({ msg: "Task deleted successfully" });
};


const getAllArchivedTasks = async (req, res) => {
  try {
    req.body.user = req.user.userId;
    const archivedTasks = await Task.find({
      user: req.user.userId,
      archived: true,
    });
    res.status(StatusCodes.OK).json({ archivedTasks, value: archivedTasks.length });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "something went wrong " });
  }
};


const deleteAllArchivedTasks = async(req,res)=>{
  try {
    const tasks = await Task.deleteMany({user : req.user.userId , archived : true})
    res.status(StatusCodes.OK).json({msg : "All archived tasks successfully removed"});
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "something went wrong " });
  }
}


const flagTask = async (req,res)=>{
  const {params : {id :taskId} , body : {color} } = req;
  const task = await Task.findOne({_id: taskId});
  if (!task) {
    throw new CustomError.NotFoundError(`No task found with id: ${taskId}`);
  }
  task.flagged = color;

  await task.save();
  res.status(StatusCodes.OK).json({msg : `task flagged : ${color}`})
}
const getAllTaskWithTheSameFlag = async (req,res)=>{
  const {color} = req.query;
  const tasks = await Task.find({user:req.user.userId , flagged : color})
  res.status(StatusCodes.OK).json({ tasks });

}
module.exports = {
  scheduleTask,
  getAllTasks,
  getSingleTask,
  updateTask,
  deleteTask,
  getAllArchivedTasks,
  deleteAllArchivedTasks,
  flagTask,
  getAllTaskWithTheSameFlag
};
