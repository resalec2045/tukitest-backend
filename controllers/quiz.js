const { quiz } = require("../data/data");
const { dbConnection } = require("../database/config");

const getAllQuiz = async (req, res = response) => {
  let connection;
  try {
    connection = await dbConnection();
    // const result = await connection.execute(`SELECT * FROM Estudiante`, [], {
    //   outFormat: oracledb.OUT_FORMAT_OBJECT,
    // });
    const result = quiz.react;
    res.status(201).json({
      ok: true,
      quiz: result,
    });
  } catch (err) {
    console.error("Error al leer registros:", err.message);
  }
};

const getQuizById = async (req, res = response) => {
  let connection;
  try {
    connection = await dbConnection();
    // const result = await connection.execute(`SELECT * FROM Estudiante`, [], {
    //   outFormat: oracledb.OUT_FORMAT_OBJECT,
    // });
    let result = {};
    for (let i = 0; i < quiz.react.length; i++) {
      if (quiz.react[i].id === parseInt(req.params.id)) {
        result = quiz.react[i];
      }
    }
    res.status(201).json({
      ok: true,
      quiz: result,
    });
  } catch (err) {
    console.error("Error al leer registros:", err.message);
  }
};

module.exports = {
  getAllQuiz,
  getQuizById,
};
