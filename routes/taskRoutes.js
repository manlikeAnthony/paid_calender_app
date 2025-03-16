const express = require("express");
const router = express.Router();
const {
  scheduleTask,
  getAllTasks,
  getSingleTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const {
  authenticateUser,
  isSubscribed,
} = require("../middleware/authentication");

router.post("/schedule-task", authenticateUser, isSubscribed, scheduleTask);
router.get("/", authenticateUser, isSubscribed, getAllTasks);
router.get("/:id", authenticateUser, isSubscribed, getSingleTask);
router.put("/:id", authenticateUser, isSubscribed, updateTask);
router.delete("/:id", authenticateUser, isSubscribed, deleteTask);

module.exports = router;
