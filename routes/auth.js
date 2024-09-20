const express = require('express');
const { login, personas, oficios, agregar, servicioUsuario } = require('../controllers/authController');
const router = express.Router();

router.post('/login', login);
router.post('/personas', personas);
router.get('/oficios', oficios);
router.post('/agregar', agregar);
router.get('/servicioUsuario', servicioUsuario);


module.exports = router;
