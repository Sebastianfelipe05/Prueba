const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Task = sequelize.define('Task', {
  title: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
    validate: {
      len: {
        args: [1, 150],
        msg: 'El título debe tener entre 1 y 150 caracteres'
      }
    }
  },
  description: {
    type: DataTypes.STRING(1000),
    allowNull: true,
    validate: {
      len: {
        args: [0, 1000],
        msg: 'La descripción no puede tener más de 1000 caracteres'
      }
    }
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
