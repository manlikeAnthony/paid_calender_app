const express = require("express");
const router = express.Router();
const {
  scheduleTask,
  getAllTasks,
  getSingleTask,
  updateTask,
  deleteTask,
  getAllArchivedTasks,
  deleteAllArchivedTasks,
  flagTask,
  getAllTaskWithTheSameFlag,
  deleteAllTaskWithSameFlag
} = require("../controllers/taskController");
const {
  authenticateUser,
  isSubscribed,
} = require("../middleware/authentication");

router.post("/schedule-task", authenticateUser, isSubscribed, scheduleTask);
router.get("/", authenticateUser, isSubscribed, getAllTasks);
router.get('/archived',authenticateUser,isSubscribed , getAllArchivedTasks)
router.delete('/archived',authenticateUser,isSubscribed , deleteAllArchivedTasks)
router.get("/flagged", authenticateUser, isSubscribed, getAllTaskWithTheSameFlag);
router.delete("/flagged", authenticateUser, isSubscribed, deleteAllTaskWithSameFlag);
router.patch("/flag/:id", authenticateUser, isSubscribed, flagTask);
router.get("/:id", authenticateUser, isSubscribed, getSingleTask);
router.patch("/:id", authenticateUser, isSubscribed, updateTask);
router.delete("/:id", authenticateUser, isSubscribed, deleteTask);

module.exports = router;
