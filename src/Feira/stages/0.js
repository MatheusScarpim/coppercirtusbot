const storagesADO = require('../storage');
const BPM = require('./BPM/AbrirApiBpm');
// const geraProtocolo = require('../gerarProtocolos/geraProtocoloPrincipal');
// const geraProtocoloMSG = require('../gerarProtocolos/geraDadosProtocolo.js')

const initialStage = {
  exec({
    from,
    message,
    client
  }) {
    if (message == "Receber cases") {
      let codProcesso = storagesADO.storage[from].processo
      console.log(
      `Iniciando disparos Botao Receber CASES
      \nProtocolo de processo ${storagesADO.storage[from].processo}
      \nNome: ${storagesADO.storage[from].nome}
      \nNumero: ${from} `)
      client.sendFile(from, "6889320331156377", "Cooperativas")
      client.sendFile(from, "657040889869289", "Sicoob Divicred")
      client.sendFile(from, "264073262732491", "Sicoob Credicitrus")
      setTimeout(() => {
        client.sendText(from, "Obrigado por participar do evento cooperativo! Esperamos que tenha sido tão enriquecedor para você quanto foi para nós. Para mais informações ou dúvidas, ligue para o nosso time comercial: 14991168289. Até a próxima!")
      }, 1000);
      BPM.aprovarProcesso(codProcesso)
    }
    return null;
  },
};


exports.initialStage = initialStage;