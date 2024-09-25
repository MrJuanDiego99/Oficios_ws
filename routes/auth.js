const express = require('express');
const { login, personas, oficios, agregar, servicioUsuario, servicio, servsoli, soliserv, peradmin, documentos, agregaroficio} = require('../controllers/authController');
const router = express.Router();

router.post('/login', login);
router.post('/personas', personas);
router.get('/oficios', oficios);
router.get('/documentos', documentos);
router.post('/agregar', agregar);
router.post('/agregaroficio', agregaroficio);
router.get('/servicioUsuario', servicioUsuario);
router.post('/servicio', servicio);
router.post('/servsoli', servsoli);
router.post('/soliserv', soliserv);
router.get('/peradmin', peradmin);


module.exports = router;
