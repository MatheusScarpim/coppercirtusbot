const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const meuEmitter = require("../Eventos/Emitter");

router.use(express.json()); // Use express.json() for JSON parsing
router.use(express.urlencoded({
    extended: true
})); // Use express.urlencoded() for URL-encoded parsing

router.get('/webhook', (req, res) => {
    const query = req.query;

    res.status(200).send(query["hub.challenge"]);
});

router.post('/webhook', (req, res) => {
    const body = req.body;
    if (body.entry[0].changes[0].value.messages) {
        const entry = body.entry[0].changes[0].value.messages[0];
        if (entry) {
            let numero = entry.from;
            let dados = undefined;

            if (entry.text) {
                let entryText = entry.text.body;
                console.log(`Pegou o texto: \n ${entryText} - Numero: ${numero} \n\n`);
                dados = {
                    event: "text",
                    from: numero,
                    body: entryText
                };
            } else if (entry.interactive && entry.interactive.button_reply && entry.interactive.button_reply.id) {
                let entryId = entry.interactive.button_reply.id;
                console.log(`Pegou o texto do botão: \n ${entryId} - Numero: ${numero} \n\n`);
                dados = {
                    event: "button_reply",
                    from: numero,
                    body: entryId
                };
            } else if (entry.button && entry.button.text) {
                let buttonText = entry.button.text;
                (`Pegou o texto do botão: \n ${buttonText} - Numero: ${numero} \n\n`);
                dados = {
                    event: "button",
                    from: numero,
                    body: buttonText
                };
            } else {
            }

            if (dados != undefined) {
                console.log(`
                Dados do WEBWOOK SUCESSO
                ${dados.event}`)
                meuEmitter.emit('message', dados);
            }
        }
    } else {
    }

    res.sendStatus(200);

});

// Export the router
module.exports = router;