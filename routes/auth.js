
const { Router } = require('express');
const router = Router();
const { check } = require('express-validator')

const { read } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar_campos');

router.get(
    '/obtener_usuarios', 
    // [ 
    //     check('name', 'El nombre es obligatorio').not().isEmpty(),
    //     check('email', 'El nombre es obligatorio').isEmail(),
    //     check('password', 'El password debe de ser de 6 caracteres').isLength({ min: 6 }), 
    //     validarCampos
    // ],
    read
);

module.exports = router;
