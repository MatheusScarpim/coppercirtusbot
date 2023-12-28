const express = require('express');
const http = require('http');
const app = express();
const ejs = require('ejs');
const bodyParser = require('body-parser');

const path = require('path');
const userRoute = require('../API/gerarToken/TestToken');
const userMensagem = require('../API/apiWpp/apiWpp');
// const ScarlatMeta = require('../../../meta_modules/ScarlatMeta/WebHook/webWook')

app.use('/', userRoute);
app.use('/', userMensagem);
// app.use('/', ScarlatMeta)

app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname + "/public")));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/status', (req, res) => {
  res.json({
    "status": "OK"
  });
});

const port = process.env.PORT || 8080;
const server = http.createServer(app);

server.listen(port, function () {
  console.log('O app está rodando ' + port);
});

// Exporte todos os módulos em um único objeto
module.exports = {
  userRoute: userRoute,
  userMensagem: userMensagem,
  // ScarlatMeta: ScarlatMeta
};