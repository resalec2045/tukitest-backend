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

const createTest = async (req, res = response) => {
  try {
    console.log("Datos recibidos:", req.body);

    const quizId = await insertQuiz(req.body);

    const idPreguntas = await insertPregunta(req.body, quizId);

    for (let i = 0; i < idPreguntas.length; i++) {
      console.log("ID de la pregunta:", idPreguntas[i]);
      await insertOpcion(idPreguntas[i], req.body.listQuestions[i].options);
    }

    // Llamar a la función para insertar evaluación, pasando el ID del quiz y el JSON de la evaluación
    await insertEvaluacion(req.body, quizId);
  } catch (error) {
    console.error("Error al llamar a los procedimientos:", error);
  }
};

const insertQuiz = async (jsonData) => {
  let connection;

  try {
    connection = await dbConnection();

    const { quiz } = jsonData;

    console.log(quiz);

    const query = `
      BEGIN
        INSERTAR_QUIZ(:p_nombre, :p_fecha, :p_tiempo, :p_categoria, :p_cantidad_preguntas, :p_puntuacion_total, :p_hora_programada, :p_aprobacion, :p_tema_id, :p_quiz_id);
      END;
    `;

    const bindParams = {
      p_nombre: quiz.quizName,
      p_fecha: quiz.level,
      p_tiempo: parseInt(quiz.totalTime),
      p_categoria: quiz.categoria,
      p_cantidad_preguntas: parseInt(quiz.cantPreguntas),
      p_puntuacion_total: parseInt(quiz.puntuacionTotal),
      p_hora_programada: quiz.horaProgramada,
      p_aprobacion: parseInt(quiz.aprobacion),
      p_tema_id: 1, // Puedes inventar este valor o pasarlo desde el JSON si está disponible
      p_quiz_id: { dir: OracleDB.BIND_OUT, type: OracleDB.NUMBER },
    };

    const result = await connection.execute(query, bindParams, {
      autoCommit: true,
    });

    console.log("Quiz ID:", result);
    const quizId = result.outBinds.p_quiz_id;
    console.log("Quiz ID:", quizId);

    return quizId;
  } catch (error) {
    console.error("Error al insertar quiz:", error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error("Error cerrando la conexión:", error);
      }
    }
  }
};

const insertPregunta = async (jsonData, quizId) => {
  let connection;

  try {
    connection = await dbConnection();

    const { listQuestions } = jsonData;

    //array para guardar los ids de las preguntas
    let idPreguntas = [];

    for (const pregunta of listQuestions) {
      const query = `
        BEGIN
          INSERTAR_PREGUNTA(:p_titulo, :p_contenido, :p_calificacion, :p_estado, :p_quiz_id, :p_es_publica, :p_pregunta_id);
        END;
      `;

      const bindParams = {
        p_titulo: pregunta.title,
        p_contenido: pregunta.content,
        p_calificacion: parseInt(pregunta.grade),
        p_estado: "A", // Puedes inventar este valor o pasarlo desde el JSON si está disponible
        p_quiz_id: quizId,
        p_es_publica: pregunta.isPublic ? "S" : "N", // Convertir a 'S' o 'N' dependiendo del valor de isPublic
        p_pregunta_id: { dir: OracleDB.BIND_OUT, type: OracleDB.NUMBER },
      };

      const result = await connection.execute(query, bindParams, {
        autoCommit: true,
      });

      idPreguntas.push(result.outBinds.p_pregunta_id);
    }

    return idPreguntas;
  } catch (error) {
    console.error("Error al insertar pregunta:", error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error("Error cerrando la conexión:", error);
      }
    }
  }
};

const insertOpcion = async (preguntaId, opciones) => {
  let connection;

  try {
    connection = await dbConnection();

    for (const opcion of opciones) {
      console.log("Opción:", opcion);
      console.log("Pregunta ID de la opcion:", preguntaId);

      const query = `
        BEGIN
          INSERTAR_OPCION(:p_texto, :p_pregunta_id, :p_es_correcta, :p_opcion_id);
        END;
      `;

      const bindParams = {
        p_texto: opcion.text,
        p_pregunta_id: preguntaId,
        p_es_correcta: opcion.isCorrect ? "S" : "N",
        p_opcion_id: { dir: OracleDB.BIND_OUT, type: OracleDB.NUMBER },
      };

      const result = await connection.execute(query, bindParams, {
        autoCommit: true,
      });

      const opcionId = result.outBinds.p_opcion_id;
      console.log("Opción ID:", opcionId);
    }
  } catch (error) {
    console.error("Error al insertar opción:", error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error("Error cerrando la conexión:", error);
      }
    }
  }
};

const insertEvaluacion = async (jsonData, quizId) => {
  let connection;

  try {
    connection = await dbConnection();

    const { quiz } = jsonData;

    const query = `
      BEGIN
        INSERTAR_EVALUACION(:p_nota, :p_grupo_id, :p_quiz_id, :p_evaluacion_id);
      END;
    `;

    const bindParams = {
      p_nota: parseInt(quiz.puntuacionTotal), // Puedes ajustar esto según el JSON si es necesario
      p_grupo_id: 1, // Puedes ajustar esto según el JSON si es necesario
      p_quiz_id: quizId,
      p_evaluacion_id: { dir: OracleDB.BIND_OUT, type: OracleDB.NUMBER },
    };

    const result = await connection.execute(query, bindParams, {
      autoCommit: true,
    });

    const evaluacionId = result.outBinds.p_evaluacion_id[0];

    console.log("Evaluación ID:", evaluacionId);
  } catch (error) {
    console.error("Error al insertar evaluación:", error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error("Error cerrando la conexión:", error);
      }
    }
  }
};

const informe1 = async (req, res = response) => {
  let connection;
  try {
    connection = await dbConnection();
    const query = `SELECT * FROM TABLE(obtener_notas_quizes_por_grupo())`;
    const result = await connection.execute(query, [], {
      outFormat: OracleDB.OUT_FORMAT_OBJECT,
    });
    res.status(201).json({
      ok: true,
      quiz: result.rows,
    });
  } catch (err) {
    console.error("Error al leer registros:", err.message);
  }
};

const informe2 = async (req, res = response) => {
  let connection;
  try {
    connection = await dbConnection();
    const result = await connection.execute(
      `SELECT * FROM TABLE(reporte_categorias_aprobadas())`,
      [],
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

const informe3 = async (req, res = response) => {
  let connection;
  try {
    connection = await dbConnection();
    const result = await connection.execute(
      `SELECT * FROM TABLE(obtener_notas_por_grupo())`,
      [],
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

module.exports = {
  getAllQuiz,
  getQuizById,
  createTest,
  getQuizByGrupo,
  getQuestionsByQuiz,
  insertOptionsByPerson,
  informe1,
  informe2,
  informe3,
};
