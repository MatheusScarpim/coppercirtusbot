const express = require('express');
const session = require('express-session');
var router = express.Router();
const bodyParser = require('body-parser');
const login = require('../login/login');
const criarConexao = require('../Hospedagem/BancoDeDados/BancoDeDados');
const geral = require("../../geralBots/CadastrarProtocolo")

router.use(bodyParser.urlencoded({
  extended: true
}));


router.get('/DadosProtocolo/', (req, res) => {
  let idProtocolo = req.query.id;
  DadosProtocolo(res, idProtocolo);
});

async function DadosProtocolo(res, id) {
  try {

    const documents = await DadosUsuario(id);
    const documentsProtocol = await DadosBPM(id);

    res.render(__dirname + '/index.ejs', {
      rows: documents,
      prot: documentsProtocol
    })
  } catch (error) {
    console.error('Erro ao conectar e obter as coleções:', error);
  }
}

async function DadosUsuario(id) {
  const client = await criarConexao.Client();
  const db = client.db('scarlatbot01');
  const collectionName = 'DadosProtocolo';

  // Obtém a coleção no banco de dados
  const collection = await db.collection(collectionName);
  // Procura o documento com o ID fornecido
  const document = await collection.findOne({
    _id: parseInt(id)
  });

  console.log(document);
  client.close();
  return document;
}


async function DadosBPM(id) {
  const client = await criarConexao.Client();
  const db = client.db('scarlatbot01');
  const collectionName = 'Protocolos';

  // Obtém a coleção no banco de dados
  const collection = await db.collection(collectionName);
  // Procura o documento com o ID fornecido
  const document = await collection.findOne({
    _id: parseInt(id)
  });

  console.log(document);
  client.close();
  return document;
}

module.exports = router;