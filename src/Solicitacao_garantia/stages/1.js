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
    let msg = "";
    if (storagesADO.storage[from].op == 0 && message == "Solicitação de Garantia") {
      msg = 'Digite o número do monobloco:';
      storagesADO.storage[from].op = 1;
    } else if (storagesADO.storage[from].op == 1) {
      storagesADO.storage[from].monobloco = message;

      client.sendText(from, "Validando monobloco...")
      setTimeout(() => {
        storagesADO.storage[from].stage = 2;
        storagesADO.storage[from].op = 2;
        client.sendText(from, "Obrigado vimos aqui que sua garantia está em vigor, vamos dar continuidade a sua solicitação. \nInforme o defeito apresentado:")
      }, 3000);
    }


    return msg;
  }
};

exports.primeiraMensagem = primeiraMensagem;