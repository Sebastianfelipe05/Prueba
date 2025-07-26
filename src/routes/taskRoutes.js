const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');

router.get('/api/tasks', controller.getAllTasks);
router.post('/api/tasks', controller.createTask);
router.put('/api/tasks/:id', controller.updateTask);
router.delete('/api/tasks/:id', controller.deleteTask);

module.exports = router;
