const { Router } = require("express");
const router = Router();
const { check } = require("express-validator");

const { read, login, obtenerGruposByProfesor } = require("../controllers/auth");
const { validarCampos } = require("../middlewares/validar_campos");

router.get("/obtener_usuarios", read);

router.post(
  "/login",
  [
    check("email", "El email es obligatorio").isEmail(),
    check("password", "El password es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  login
);

router.get("/obtener_grupos/:id", obtenerGruposByProfesor);

module.exports = router;
