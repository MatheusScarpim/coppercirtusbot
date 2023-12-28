const express = require('express');
const session = require('../login/login');
var  router = express.Router();
const bodyParser = require('body-parser');
const geral = require('../../geralBots/CadastrarProtocolo')

const criarConexao = require('../Hospedagem/BancoDeDados/BancoDeDados');
var dataAtual = new Date();
router.use(bodyParser.urlencoded({ extended: true }));

  // Rota para obter a sessão
 router.post('/cadastrar', (req, res) => {
  if(session.isAuthenticated(req))
  {
    const { email, senha } = req.body;
    cadastrarUser(email,senha);
  }
  else
  {
    res.redirect('/logar');
  }
});
router.get('/cadastrar', (req, res) => {
  if(session.isAuthenticated(req))
  {
    res.sendFile(__dirname + '/index.html');
  }
  else
  {
    res.redirect('/logar');
  }
});


function cadastrarUser(email,senha)
{
  const conexao = criarConexao.connection;
  conexao.query('INSERT INTO usuarios (id , email , senha, criado) VALUES (default,?, ? , ?)', [email, senha,geral.gerarData(dataAtual)])
}

module.exports = router;