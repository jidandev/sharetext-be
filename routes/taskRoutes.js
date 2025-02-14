const express = require('express');
const { getTasks, addTask, getTasksByUser, addSubTask, getSubTasks, getSubTask, updateSubTask, changeTitleSubTask, changeLangSubTask, changeTextSubTask, deleteSubTask} = require('../controllers/taskController');

const router = express.Router();

router.get('/tasks', getTasks);
router.get('/tasks/user', getTasksByUser);
router.get('/subtasks', getSubTasks);
router.get('/subtask/:id', getSubTask);
router.post('/tasks', addTask);
router.post('/subtask', addSubTask);
router.put('/subtask/:id', updateSubTask);
router.put('/subtask/title/:id', changeTitleSubTask)
router.put('/subtask/lang/:id', changeLangSubTask)
router.put('/subtask/text/:id', changeTextSubTask)
router.delete('/subtask/:id', deleteSubTask)

module.exports = router;