const { Router } = require("express");
const { getAllQuiz, getQuizById } = require("../controllers/quiz");
const router = Router();
// const { check } = require("express-validator");
// const { validarCampos } = require("../middlewares/validar_campos");

router.get("/getAllQuiz", getAllQuiz);

router.get("/getQuizById/:id", getQuizById);

module.exports = router;
