const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Task = sequelize.define('Task', {
 title: {
  type: DataTypes.STRING(150),
  allowNull: false,
  unique: true, // clave para que sea único
  validate: {
    len: [1, 150] // longitud entre 1 y 150
    }
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  due_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  priority: {
    type: DataTypes.ENUM('Alta','Media','Baja'),
    defaultValue: 'Media'
  },
  status: {
    type: DataTypes.ENUM('Pendiente','En progreso','Completada'),
    defaultValue: 'Pendiente'
  }
});

module.exports = Task;
