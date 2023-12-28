const mysql = require('mysql2');
const criarConexao = require('../Hospedagem/BancoDeDados/BancoDeDados');
// const dotenv = require('dotenv');
// dotenv.config();

// const pool = mysql.createPool({
//     host: process.env.MYSQL_HOST,
//     user: process.env.MYSQL_USER,
//     password: process.env.MYSQL_PASSWORD,
//     database: process.env.MYSQL_DATABASE
// }).promise();


async function getSelect() {
    const Conexao = criarConexao.connection;
    const [rows] = await Conexao.promise().query("SELECT " +
        "(SELECT COUNT(*) FROM Atendimento) AS Atendimento, " +
        "(SELECT COUNT(*) FROM protocolos) AS Protocolos, " +
        "(SELECT COUNT(*) FROM f_solic_emprest) AS SolicEmpr;");
    return rows;
}

exports.getSelect = getSelect;