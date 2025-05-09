const express = require('express');
const apiKeyMiddleware = require('../middleware/auth')
const SubTaskController = require('../controllers/subTaskController');

const router = express.Router();

router.get('/subtasks/:taskId', apiKeyMiddleware, SubTaskController.getSubTasks);
router.get('/comments/:subTaskId', apiKeyMiddleware, SubTaskController.fetchComments);

router.post('/subtask', apiKeyMiddleware, SubTaskController.createSubTask);

router.patch('/updatesubtask/content/:id', apiKeyMiddleware, SubTaskController.updateContent);
router.patch('/updatesubtask/lang/:id', apiKeyMiddleware, SubTaskController.updateLang);

router.delete('/subtask/:id', apiKeyMiddleware, SubTaskController.deleteSubTask);

module.exports = router;