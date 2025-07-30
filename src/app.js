const express = require('express');
const app = express();
const sequelize = require('./config/database');
const taskRoutes = require('./routes/taskRoutes');
const pokemonRoutes = require('./routes/pokemonRoutes');

// Middleware
app.use(express.json());
app.use(express.static('public')); // Para servir index.html desde la carpeta "public"

// Rutas
app.use('/api/tasks', taskRoutes);      // si usas rutas tipo /api/tasks
app.use('/api/pokemon', pokemonRoutes); // ya lo tienes bien

// Sincroniza la base de datos
sequelize.sync()
  .then(() => console.log('✅ Base de datos sincronizada'))
  .catch(err => console.error('❌ Error al sincronizar DB:', err));

module.exports = app;
