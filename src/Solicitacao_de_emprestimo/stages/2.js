const storagesADO = require('../storage.js');
// const geraProtocolo = require('../gerarProtocolos/geraDadosProtocolo.js')


const segundaMensagem = {
  exec({
    from,
    message,
    client
  }) {
    if (message.toString() === 'Crédito') {
      client.sendButton(from, "🚨  Escolha uma das opções abaixo:  🚨", [{
          "type": "reply",
          "reply": {
            "id": "Simular",
            "title": "Simular"
          }
        },
        {
          "type": "reply",
          "reply": {
            "id": "Cancelar",
            "title": "Cancelar"
          }
        }
      ])
      storagesADO.storage[from].stage = 3;
      // setTimeout(() => {
      //   geraProtocolo.CriarProtocoloMSG(storagesADO.storage[from].protocolo, message);
      // }, 1000);
      // setTimeout(() => {
      //   geraProtocolo.CriarProtocoloMSGBot(storagesADO.storage[from].protocolo, msg);
      // }, 200);
      return null;
    } else if (message.toString() === 'Cancelar') {
      storagesADO.storage[from].stage = 0;
      msg = "Cancelado com sucesso❌";
      return msg
    }
    let Error = '❌ *Digite uma opção válida, por favor.* \n⚠️ ```APENAS UMA OPÇÃO POR VEZ``` ⚠️';
    // geraProtocolo.CriarProtocoloMSGBot(storagesADO.storage[from].protocolo, Error);
    return Error;
  },
};

exports.segundaMensagem = segundaMensagem;