const express = require('express');
const apiKeyMiddleware = require('../middleware/auth')
const TaskController = require('../controllers/taskController');

const router = express.Router();

router.get('/task/:slug', apiKeyMiddleware, TaskController.getTaskBySlug);
router.get('/rendertask/:slug', apiKeyMiddleware, TaskController.renderTask);

router.post('/task', apiKeyMiddleware, TaskController.createTask);

router.patch('/updatetask/password/:slug', apiKeyMiddleware, TaskController.updatePassword);
router.patch('/updatetask/title/:slug', apiKeyMiddleware, TaskController.updateTitle);

router.delete('/task/:slug', apiKeyMiddleware, TaskController.deleteTask);

module.exports = router;