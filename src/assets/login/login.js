const express = require('express');
const session = require('express-session');
var  router = express.Router();
const bodyParser = require('body-parser');


router.use(bodyParser.urlencoded({ extended: true }));


router.get('/logar', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

function isAuthenticated(req) {
  if(req.session.login)
  {
    return true
  }
  else{
    return false
  }  ;
}

  // Rota para obter a sessão
  
    
router.use(session({
  secret: 'portabeta123', // chave secreta usada para assinar o cookie da sessão
  resave: false, // indica se a sessão deve ser salva no armazenamento, mesmo que não tenha sido modificada
  saveUninitialized: true,
  cookie: {
    maxAge: 30000000 // 30 minutos
  } // indica se a sessão deve ser salva no armazenamento, mesmo que não tenha sido inicializada
}));

router.post('/entrar', (req, res) => {
   let username = req.body.usermail;
   let password = req.body.password;

   
   // Aqui você deve implementar a lógica para comparar as informações de login  com um conjunto de credenciais válidas, por exemplo:
   if (username === 'adm@adm' && password === 'adm') {
       // Se as informações de login forem válidas, redirecione o usuário para a página inicial ou outra página restrita.
       req.session.login = username;
       res.redirect('/');
   } else {
       // Se as informações de login forem inválidas, renderize a página de login novamente com uma mensagem de erro.
       res.redirect('/logar');
   }
});
module.exports = router;
module.exports.isAuthenticated = isAuthenticated;