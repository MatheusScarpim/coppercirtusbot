const storagesADO = require('../storage.js');
// const geraProtocolo = require('../gerarProtocolos/geraDadosProtocolo.js')

const terceiraMensagem = {
  exec({
    from,
    message,
    client
  }) {
    let mensagem
    var opcao = storagesADO.storage[from].op;
    if (opcao == 0 && message.toString() == "Simular") {
      mensagem = 'Primeiramente preciso que nos informe novamente seu CPF (sem pontuações)'
      storagesADO.storage[from].op = 1;
      // setTimeout(() => {
      //   geraProtocolo.CriarProtocoloMSG(storagesADO.storage[from].protocolo, message);
      // }, 1000);
    } else if (opcao == 1) {
      mensagem = 'Digite seu email'
      storagesADO.storage[from].op = 2;
      storagesADO.storage[from].cpf = message;
      // setTimeout(() => {
      //   geraProtocolo.CriarProtocoloMSG(storagesADO.storage[from].protocolo, message);
      // }, 1000);
    } else if (opcao == 2) {
      storagesADO.storage[from].email = message;
      client.sendButton(from, `🚨  Confira seus dados "OK" para avançar || "Não" para corrigir \n\nE-mail: ${storagesADO.storage[from].email}\n\n CPF: ${storagesADO.storage[from].cpf}  🚨`, [{
        "type": "reply",
        "reply": {
          "id": "OK",
          "title": "OK"
        }
      },
      {
        "type": "reply",
        "reply": {
          "id": "Não",
          "title": "Não"
        }
      }
      ])
      storagesADO.storage[from].op = 0;
      storagesADO.storage[from].stage = 4;
      // setTimeout(() => {
      //   geraProtocolo.CriarProtocoloMSG(storagesADO.storage[from].protocolo, message);
      // }, 1500);
    } else if (message.toString() == "Cancelar") {
      mensagem = "Cancelado com sucesso❌";
      storagesADO.storage[from].stage = 0;
      storagesADO.storage[from].op = 0;
    } else {
      mensagem = '❌ *Digite uma opção válida, por favor.* \n⚠️ ```APENAS UMA OPÇÃO POR VEZ``` ⚠️'
      storagesADO.storage[from].op = 0;
    }

    // const delayBetweenMessages = 2000; // Atraso entre as mensagens em milissegundos
    // const delayIncrement = 100; // Incremento do atraso para evitar duplicação de IDs

    // // Mensagem para o Bot com um pequeno incremento no atraso
    // setTimeout(() => {
    //   geraProtocolo.CriarProtocoloMSGBot(storagesADO.storage[from].protocolo, mensagem);
    // }, delayBetweenMessages + delayIncrement);

    return mensagem;
  }
};

exports.terceiraMensagem = terceiraMensagem;