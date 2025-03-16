const express = require('express')
const router = express.Router();
const {scheduleTask} = require('../controllers/taskController');
const {authenticateUser , isSubscribed} = require('../middleware/authentication');

router.post('/schedule-task' , authenticateUser, isSubscribed, scheduleTask)

module.exports = router