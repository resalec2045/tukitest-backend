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

const insertOptionsByPerson = async (req, res = response) => {
  let connection;

  try {
    connection = await dbConnection();

    // Generar un ID único para esta inserción
    const ID = Math.floor(Math.random() * 1000000);

    // Obtener los datos del cuerpo de la solicitud
    const { id: PERSONA_ID, listSelectedAnswer, listQuestions } = req.body;

    if (listSelectedAnswer[0].length === 2) {
      // Separar los elementos del primer subarray por un punto y coma
      listSelectedAnswer[0] = [listSelectedAnswer[0].join(";")];
    }

    const newListSelectedAnswer = aplanarArray(listSelectedAnswer);

    // Convertir las listas a matrices JSON
    let selectedAnswersJSON = JSON.stringify(newListSelectedAnswer);
    let questionsJSON = JSON.stringify(listQuestions);

    selectedAnswersJSON = selectedAnswersJSON
      .replace(/"/g, "'")
      .replace("[", "")
      .replace("]", "");
    questionsJSON = questionsJSON.replace("[", "").replace("]", "");

    const query = `
    DECLARE
        p_id NUMBER := null;
        p_persona_id NUMBER := ${PERSONA_ID};
        p_listSelectedAnswer SYS.ODCIVARCHAR2LIST := SYS.ODCIVARCHAR2LIST(${selectedAnswersJSON});
        p_listQuestions SYS.ODCINUMBERLIST := SYS.ODCINUMBERLIST(${questionsJSON});
    BEGIN
        INSERTAR_RESPUESTAS(p_id, p_persona_id, p_listSelectedAnswer, p_listQuestions);
    END;
    `;

    // Llamar al procedimiento almacenado con los datos proporcionados
    const result = await connection.execute(
      query,
      {},
      {
        outFormat: OracleDB.OUT_FORMAT_OBJECT,
        autoCommit: true,
      }
    );

    console.log("Rows affected:", result.rowsAffected);

    res.status(201).json({
      ok: true,
    });
  } catch (err) {
    console.error("Error al insertar datos:", err.message);
    res.status(500).json({
      ok: false,
      error: "Error al insertar datos",
    });
  } finally {
    if (connection) {
      try {
        // Liberar la conexión de vuelta al pool
        await connection.close();
      } catch (err) {
        console.error("Error cerrando la conexión:", err.message);
      }
    }
  }
};

function aplanarArray(arr) {
  return arr.flatMap((subarr) => {
    // Verificar si el elemento es un array
    if (Array.isArray(subarr)) {
      // Si es un array, devolver sus elementos
      return subarr;
    } else {
      // Si no es un array, devolverlo tal cual
      return [subarr];
    }
  });
}

const createQuiz = async (req, res = response) => {
  let connection;
  try {
    connection = await dbConnection();
    // const result = await connection.execute(`SELECT * FROM Estudiante`, [], {
    //   outFormat: oracledb.OUT_FORMAT_OBJECT,
    // });
    console.log("Body:", req.body);
    console.log("Quiz:", req.body.listQuestions[1].options);
    res.status(201).json({
      ok: true,
    });
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
  insertOptionsByPerson,
};
