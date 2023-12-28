const express = require('express');
const database = require('./database.js');
var router = express.Router();
const login = require('../login/login');

router.get("/dadosbanco", async (req, res) => {
    if (login.isAuthenticated(req)) {
        const notes = await database.getSelect();
        res.send(notes);
    }
    else {
        res.redirect("/logar");
    }
})

router.get('/grafico', (req, res) => {
    if (login.isAuthenticated(req)) {
        // res.render('index.html');
        res.render(__dirname + '/index.html');
    }
    else {
        res.redirect("/logar");
    }
})

module.exports = router;

// app.listen(3000, () => {
//     console.log('Servidor rodando');
// });