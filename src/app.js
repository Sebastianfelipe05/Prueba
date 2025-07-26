const express = require('express');
const app = express();
const taskRoutes = require('./routes/taskRoutes');
const sequelize = require('./config/database');

app.use(express.json());
app.use(express.static('public')); // Servir index.html
app.use(taskRoutes);

// Sincroniza la base de datos
sequelize.sync()
  .then(() => console.log('✅ Base de datos sincronizada'))
  .catch(err => console.error('Error al sincronizar DB:', err));

module.exports = app;
