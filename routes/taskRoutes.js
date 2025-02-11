const express = require('express');
const { getTasks, addTask, getTasksByUser, addSubTask, getSubTasks } = require('../controllers/taskController');

const router = express.Router();

router.get('/tasks', getTasks);
router.get('/tasks/user', getTasksByUser);
router.get('/subtasks', getSubTasks);
router.post('/tasks', addTask);
router.post('/subtask', addSubTask);

module.exports = router;