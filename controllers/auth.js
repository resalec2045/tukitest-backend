const OracleDB = require("oracledb");
const { dbConnection } = require("../database/config");

const read = async (req, res = response) => {
  let connection;
  try {
    connection = await dbConnection();
    const result = await connection.execute(`SELECT * FROM PERSONA`, [], {
      outFormat: OracleDB.OUT_FORMAT_OBJECT,
    });
    res.status(201).json({
      ok: true,
      usuarios: result.rows,
    });
  } catch (err) {
    console.error("Error al leer registros:", err.message);
  }
};

const login = async (req, res = response) => {
  let connection;
  try {
    connection = await dbConnection();
    const { email, password } = req.body;
    const result = await connection.execute(
      `SELECT * FROM PERSONA JOIN GRUPO ON GRUPO.PERSONA_ID = PERSONA.ID JOIN ROL ON ROL.PERSONA_ID = PERSONA.ID WHERE Email = :email AND Contrasena = :password`,
      [email, password],
      { outFormat: OracleDB.OUT_FORMAT_OBJECT }
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        ok: false,
        msg: "Usuario o contraseña incorrectos",
      });
    }
    res.status(201).json({
      ok: true,
      usuario: result.rows[0],
    });
  } catch (err) {
    console.error("Error al leer registros:", err.message);
  }
};

const obtenerGruposByProfesor = async (req, res = response) => {
  let connection;
  try {
    connection = await dbConnection();
    const { id } = req.params;
    const result = await connection.execute(
      `SELECT * FROM GRUPO WHERE PERSONA_ID = :id`,
      [id],
      {
        outFormat: OracleDB.OUT_FORMAT_OBJECT,
      }
    );
    res.status(201).json({
      ok: true,
      grupos: result.rows,
    });
  } catch (err) {
    console.error("Error al leer registros:", err.message);
  }
};

module.exports = {
  read,
  login,
  obtenerGruposByProfesor,
};
