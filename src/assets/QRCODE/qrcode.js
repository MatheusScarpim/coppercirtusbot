const express = require('express');
const session = require('../login/login');
var  router = express.Router();
const bodyParser = require('body-parser');
var clientInstance  = require('../../../server');
const wpp = require('@wppconnect-team/wppconnect')

router.use(bodyParser.urlencoded({ extended: true }));

router.get('/qrcode', (req, res) => {
  if(session.isAuthenticated(req))
  {
    res.render(__dirname + '/index.ejs', { rows: rows })
  }
  else
  {
    res.redirect('/logar');
  }
});

router.get('/imageqrcode', (req, res) => {
    res.sendFile(wpp.createQRCode());
  });

module.exports = router;