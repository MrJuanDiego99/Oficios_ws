const express = require('express');
const { login, personas, oficios, agregar, servicioUsuario, servicio, servsoli, soliserv, peradmin } = require('../controllers/authController');
const router = express.Router();

router.post('/login', login);
router.post('/personas', personas);
router.get('/oficios', oficios);
router.post('/agregar', agregar);
router.get('/servicioUsuario', servicioUsuario);
router.post('/servicio', servicio);
router.post('/servsoli', servsoli);
router.post('/soliserv', soliserv);
router.get('/peradmin', peradmin);


module.exports = router;
