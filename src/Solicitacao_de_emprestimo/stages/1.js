const storagesADO = require('../storage.js');
// const geraProtocolo = require('../gerarProtocolos/geraDadosProtocolo.js')

const menu = {
  1: {
    description: 'Crédito',
  },
};

const primeiraMensagem = {
  exec({
    from,
    message,
    client
  }) {
    let msg = '🚨  Escolha uma das opções abaixo:  🚨\n\n';

    Object.keys(menu).map((value) => {
      const element = menu[value];
      if (value.toString() === '1') {
        msg += `1️⃣ - _${element.description}_ \n`;
      }
    });
    client.sendButton(from, "🚨  Escolha uma das opções abaixo:  🚨", [{
        "type": "reply",
        "reply": {
          "id": "Crédito",
          "title": "Crédito"
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

    storagesADO.storage[from].stage = 2;

    // const delayBetweenMessages = 2000; // Atraso entre as mensagens em milissegundos
    // const delayIncrement = 100; // Incremento do atraso para evitar duplicação de IDs

    // // Primeira mensagem
    // setTimeout(() => {
    //   geraProtocolo.CriarProtocoloMSG(storagesADO.storage[from].protocolo, message);
    // }, delayBetweenMessages);

    // // Segunda mensagem com um pequeno incremento no atraso
    // setTimeout(() => {
    //   geraProtocolo.CriarProtocoloMSGBot(storagesADO.storage[from].protocolo, msg);
    // }, delayBetweenMessages + delayIncrement);

    return null;
  }
};

exports.primeiraMensagem = primeiraMensagem;