const { Router } = require("express");
const {
  getAllQuiz,
  getQuizById,
  deleteQuizById,
  createQuiz,
  updateQuiz,
  getQuizByGrupo,
  getQuestionsByQuiz,
  insertOptionsByPerson,
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

router.post("/createQuiz", createQuiz);

router.post("/updateQuiz", [validarCampos], updateQuiz);

module.exports = router;
