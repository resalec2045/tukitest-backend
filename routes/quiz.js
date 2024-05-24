const { Router } = require("express");
const {
  getAllQuiz,
  getQuizById,
  createTest,
  getQuizByGrupo,
  getQuestionsByQuiz,
  insertOptionsByPerson,
  informe1,
  informe2,
  informe3,
} = require("../controllers/quiz");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar_campos");
const router = Router();

router.get("/getAllQuiz", getAllQuiz);

router.get("/getQuizById/:id", getQuizById);

router.get("/getQuizByGrupo/:grupo", getQuizByGrupo);

router.get("/getQuestionsByQuiz/:id", getQuestionsByQuiz);

router.post("/insertOptionsByPerson", insertOptionsByPerson);

router.post("/createTest", createTest);

router.get("/informe1", informe1);

router.get("/informe2", informe2);

router.get("/informe3", informe3);

module.exports = router;
