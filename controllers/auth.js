const { dbConnection, closeConnection } = require("../database/config");
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
    } finally {
      await closeConnection(connection);
    }
}

module.exports = {
    read
}
