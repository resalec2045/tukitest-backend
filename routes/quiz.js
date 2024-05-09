const { Router } = require("express");
const {
  getAllQuiz,
  getQuizById,
  deleteQuizById,
  createTest,
  updateQuiz,
  getQuizByGrupo,
  getQuestionsByQuiz,
  insertOptionsByPerson,
  informe1,
} = require("../controllers/quiz");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar_campos");
const router = Router();

router.get("/getAllQuiz", getAllQuiz);

router.get("/getQuizById/:id", getQuizById);

router.get("/getQuizByGrupo/:grupo", getQuizByGrupo);

router.get("/getQuestionsByQuiz/:id", getQuestionsByQuiz);

router.delete("/deleteQuizById/:id", deleteQuizById);

router.post("/insertOptionsByPerson", insertOptionsByPerson);

router.post("/createTest", createTest);

router.post("/updateQuiz", [validarCampos], updateQuiz);

router.get("obterne nifmrenowsd", informe1)

module.exports = router;
