const stagesADO = require('./src/Solicitacao_garantia/stages.js');
const servidorExpress = require('./src/assets/Hospedagem/HospedaExpress');
const wpp = require('@wppconnect-team/wppconnect');
const Reflect = require('reflect-metadata');
let protocoloteste = true



wpp.create({
        session: 'store',
        multidevice: true,
        headless: true,
        updatesLog: true,
        debug: true,
    })
    .then((client) => start(client))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });


function start(client) {
    module.exports.client = client
    client.onMessage((message) => {
        if (!message.isGroupMsg) {
            console.log(message.body)

            const currentStage = stagesADO.getStage({
                from: message.from
            });

            const messageResponse = stagesADO.stages[currentStage].stage.exec({
                from: message.from,
                message: message.body,
                client,
            });

            if (messageResponse && messageResponse != "") {
                console.log(messageResponse)
                client.sendText(message.from, messageResponse.toString()).then(() => {
                    console.log('Message sent.');
                }).catch(error => console.error('Error when sending message', error));
            }
        }
    });
};