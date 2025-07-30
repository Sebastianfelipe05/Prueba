// src/routes/pokemonRoutes.js
const express = require('express');
const axios = require('axios');

const router = express.Router();

// Ruta para obtener información de la API de Pokémon
router.get('/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
    res.json(response.data);
  } catch (error) {
    res.status(404).json({ error: 'Pokémon no encontrado' });
  }
});

module.exports = router;
