const express = require('express');
const { getTasks, addTask, getTasksByUser, addSubTask, getSubTasks, updateSubTask} = require('../controllers/taskController');

const router = express.Router();

router.get('/tasks', getTasks);
router.get('/tasks/user', getTasksByUser);
router.get('/subtasks', getSubTasks);
router.post('/tasks', addTask);
router.post('/subtask', addSubTask);
router.put('/subtasks/:id', updateSubTask);

module.exports = router;