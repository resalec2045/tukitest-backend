const { dbConnection } = require("../database/config");
const OracleDB = require("oracledb");

const getQuizByGrupo = async (req, res = response) => {
  let connection;
  try {
    connection = await dbConnection();
    const { grupo } = req.params;
    const result = await connection.execute(
      `SELECT * FROM EVALUACION e JOIN QUIZ q ON q.id = e.quiz_id JOIN GRUPO G ON e.grupo_id = G.id WHERE g.id = :grupo`,
      [grupo],
      {
        outFormat: OracleDB.OUT_FORMAT_OBJECT,
      }
    );
    res.status(201).json({
      ok: true,
      quiz: result.rows,
    });
  } catch (err) {
    console.error("Error al leer registros:", err.message);
  }
};

const getQuizById = async (req, res = response) => {
  let connection;
  try {
    connection = await dbConnection();
    const { id } = req.params;
    const result = await connection.execute(
      `SELECT * FROM QUIZ WHERE QUIZ.ID = :id`,
      [id],
      {
        outFormat: OracleDB.OUT_FORMAT_OBJECT,
      }
    );
    res.status(201).json({
      ok: true,
      quiz: result.rows[0],
    });
  } catch (err) {
    console.error("Error al leer registros:", err.message);
  }
};

const getAllQuiz = async (req, res = response) => {
  let connection;
  try {
    connection = await dbConnection();
    const result = await connection.execute(`SELECT * FROM QUIZ`, [], {
      outFormat: OracleDB.OUT_FORMAT_OBJECT,
    });
    res.status(201).json({
      ok: true,
      quiz: result,
    });
  } catch (err) {
    console.error("Error al leer registros:", err.message);
  }
};

const getQuestionsByQuiz = async (req, res = response) => {
  let connection;
  try {
    connection = await dbConnection();
    const { id } = req.params;
    const result = await connection.execute(
      `SELECT * FROM PREGUNTA WHERE QUIZ_ID = :id`,
      [id],
      {
        outFormat: OracleDB.OUT_FORMAT_OBJECT,
      }
    );

    for (let element of result.rows) {
      element.options = [];
      try {
        const res = await getOptionsByQuestion(element.ID);
        element.options = res;
      } catch (error) {
        console.error("Error al obtener opciones:", error);
      }
    }

    res.status(201).json({
      question: result.rows,
    });
  } catch (err) {
    console.error("Error al leer registros:", err.message);
  }
};

const getOptionsByQuestion = async (id) => {
  let connection;
  try {
    connection = await dbConnection();
    const result = await connection.execute(
      `SELECT * FROM OPCION WHERE PREGUNTA_ID = :id`,
      [id],
      {
        outFormat: OracleDB.OUT_FORMAT_OBJECT,
      }
    );
    return result.rows;
  } catch (err) {
    console.error("Error al leer registros:", err.message);
  }
};

// TODO: REALIZAR

const deleteQuizById = async (req, res = response) => {
  let connection;
  try {
    connection = await dbConnection();
    // const result = await connection.execute(`SELECT * FROM Estudiante`, [], {
    //   outFormat: oracledb.OUT_FORMAT_OBJECT,
    // });
    res.status(201).json({
      ok: true,
      quiz: result,
    });
  } catch (err) {
    console.error("Error al leer registros:", err.message);
  }
};

const createQuiz = async (req, res = response) => {
  let connection;
  try {
    connection = await dbConnection();
    // const result = await connection.execute(`SELECT * FROM Estudiante`, [], {
    //   outFormat: oracledb.OUT_FORMAT_OBJECT,
    // });
    res.status(201).json({
      ok: true,
      quiz: result,
    });
  } catch (err) {
    console.error("Error al leer registros:", err.message);
  }
};

const updateQuiz = async (req, res = response) => {
  let connection;
  try {
    connection = await dbConnection();
    // const result = await connection.execute(`SELECT * FROM Estudiante`, [], {
    //   outFormat: oracledb.OUT_FORMAT_OBJECT,
    // });
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
  deleteQuizById,
  createQuiz,
  updateQuiz,
  getQuizByGrupo,
  getQuestionsByQuiz,
};
