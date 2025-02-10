const express = require('express');
const { getTasks, addTask, getTasksByUser, addSubTask } = require('../controllers/taskController');

const router = express.Router();

router.get('/tasks', getTasks);
router.get('/tasks/user', getTasksByUser);
router.post('/tasks', addTask);
router.post('/subtask', addSubTask);

module.exports = router;