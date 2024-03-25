const { dbConnection } = require("../database/config");
const oracledb = require('oracledb');

const read = async ( req , res = response ) => {
  let connection;
  try {
    connection = await dbConnection();
    const result = await connection.execute(
      `SELECT * FROM employees`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.status(201).json({
      ok: true,
      usuarios: result.rows
  });
  } catch (err) {
    console.error('Error al leer registros:', err.message);
  }
}

const login = async ( req , res = response ) => {
  let connection;
  try {
    connection = await dbConnection();
    const { email, password } = req.body;
    const result = await connection.execute(
      `SELECT * FROM employees WHERE email = :email AND employee_id = :password`,
      [email, password],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        ok: false,
        msg: 'Usuario o contraseña incorrectos'
      });
    }
    res.status(201).json({
      ok: true,
      usuario: result.rows[0]
  });
  } catch (err) {
    console.error('Error al leer registros:', err.message);
  } 
}

module.exports = {
    read,
    login
}
