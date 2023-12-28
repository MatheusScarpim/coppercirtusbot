const storagesADO = require('../storage');
// const geraProtocolo = require('../gerarProtocolos/geraProtocoloPrincipal');
// const geraProtocoloMSG = require('../gerarProtocolos/geraDadosProtocolo.js')

const initialStage = {
  exec({ from }) {
    let msg = "Bem vindo ao sistema de empréstimo\nDigite seu cpf";
    // geraProtocolo.CriarProtocoloPrincipal(from)
    //   .then((nextId) => {
    //     console.log(nextId)
    //     storagesADO.storage[from].protocolo = nextId;
    //   })
    //   .catch((error) => {
    //     console.error("Erro ao criar protocolo:", error);
    //   });
    storagesADO.storage[from].stage = 1;
    // setTimeout(() => {
    //   geraProtocoloMSG.CriarProtocoloMSGBot(storagesADO.storage[from].protocolo, msg);
    // }, 1000);
    return msg;
  },
};


exports.initialStage = initialStage;