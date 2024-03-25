const oracledb = require('oracledb');
const dbConfig = {
  user: 'system',
  password: '1234',
  connectString: 'localhost:1521/xe'
};

const dbConnection = async() => {
    let connection;
    try {
      connection = await oracledb.getConnection(dbConfig);
      console.log('Conexión exitosa a la base de datos Oracle!');
    } catch (err) {
      console.error(err.message);
    }
    return connection;
}

async function closeConnection(connection) {
    if (connection) {
        try {
        await connection.close();
        console.log('Conexión cerrada con éxito!');
        } catch (err) {
        console.error(err.message);
        }
    }
}

module.exports = {
    dbConnection,
    closeConnection
}

