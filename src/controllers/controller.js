const Task = require('../models/task');

// Obtener todas las tareas (con opción de filtrar por status y prioridad)
exports.getAllTasks = async (req, res) => {
  try {
    const { status, priority } = req.query;
    const where = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;

    const tasks = await Task.findAll({ where });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener tareas' });
  }
};

// Crear tarea
exports.createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.json(task);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ error: 'El título ya existe' });
    } else if (err.name === 'SequelizeValidationError') {
      res.status(400).json({ error: 'Datos inválidos', details: err.errors });
    } else {
      res.status(500).json({ error: 'Error al crear tarea' });
    }
  }
};

// Actualizar tarea
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Task.update(req.body, { where: { id } });
    if (updated) {
      res.json({ message: 'Tarea actualizada' });
    } else {
      res.status(404).json({ error: 'Tarea no encontrada' });
    }
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ error: 'El título ya existe' });
    } else {
      res.status(500).json({ error: 'Error al actualizar tarea' });
    }
  }
};

// Eliminar tarea
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Task.destroy({ where: { id } });
    if (deleted) {
      res.json({ message: 'Tarea eliminada' });
    } else {
      res.status(404).json({ error: 'Tarea no encontrada' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar tarea' });
  }
};
