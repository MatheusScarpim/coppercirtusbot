const express = require('express');
const session = require('express-session');
var router = express.Router();
const bodyParser = require('body-parser');
const login = require('../login/login');
const criarConexao = require('../Hospedagem/BancoDeDados/BancoDeDados');
let db;

router.use(bodyParser.urlencoded({ extended: true }));


router.get('/', (req, res) => {
  if (login.isAuthenticated(req)) {
    // const conexao = criarConexao.connection;
    // conexao.query(`SELECT *,DATE_FORMAT(criado, '%d/%m/%y %H:%i') as criadoFormatado,DATE_FORMAT(ultimoContato, '%d/%m/%y %H:%i') as ultimoFormatado FROM scarlatbot.protocolos;`, (err, rows) => {
    //   if (err) {
    //     console.error(err.message);
    //   }

    //   // Renderiza o template EJS com os valores das linhas
    //   res.render(__dirname + '/index.ejs', { rows: rows });
    // });
    getAllCollections(res);
  }
  else {
    res.redirect("/logar");
  }
});

async function getAllCollections(res) {
  try {
    const client = await criarConexao.Client();
    const db = client.db('scarlatbot01');
    const collectionName = 'Protocolos';

    // Obtém a lista de coleções no banco de dados
    const collectionNames = await db.collection(collectionName);
    const documents = await collectionNames.find({}).toArray();
    // const NomeColuna = ['NumProtocolo', 'Numero', 'Criado', 'ultimoContato', 'Canal', 'Origem']
    // const rows = documents
    //   .filter(collection => NomeColuna.includes(collection.name))
    //   .map(({ name }) => ({ name }));
    // console.log(rows.map(({ name }) => ({ name })));

    // Renderiza o arquivo index.ejs passando o array de coleções (rows)
    res.render(__dirname + '/index.ejs', { rows: documents });

    client.close();
  } catch (error) {
    console.error('Erro ao conectar e obter as coleções:', error);
  }
}


module.exports = router;