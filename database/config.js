const oracledb = require("oracledb");

const dbConfig = {
  user: "PROYECTO",
  password: "1234",
  connectString: "localhost:1521/xe",
};

const dbConnection = async () => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
  } catch (err) {
    console.error(err.message);
  }
  return connection;
};

async function closeConnection(connection) {
  if (connection) {
    try {
      await connection.close();
      console.log("Conexión cerrada con éxito!");
    } catch (err) {
      console.error(err.message);
    }
  }
}

module.exports = {
  dbConnection,
  closeConnection,
};
