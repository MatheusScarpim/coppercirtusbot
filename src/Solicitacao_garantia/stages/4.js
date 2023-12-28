const storagesADO = require('../storage.js');
var clientInstance = require('../../../server');
// const geraProtocolo = require('../gerarProtocolos/geraDadosProtocolo.js')
const abrirProcesso = require('../BPM/AbrirApiBpm.js')

const quartaMensagem = {
  exec({
    from,
    message,
    client
  }) {
    let mensagem;
    var opcao = storagesADO.storage[from].op;

    function processStep() {
      if (opcao == 0) {
        if (message.toLowerCase() == "ok") {
          mensagem = "✅ Vamos começar! Preciso que me informe o valor que deseja contratar (Digite o valor sem vírgula ou ponto. EX: 1000)";
          storagesADO.storage[from].op = 1;
        } else {
          mensagem = "Primeiramente preciso que nos informe novamente seu CPF (sem pontuações)";
          storagesADO.storage[from].stage = 3;
          storagesADO.storage[from].op = 1;
        }
      } else if (opcao == 1) {
        mensagem = "✅Entendi. Agora me informe o número de parcelas:";
        storagesADO.storage[from].emprestimo.valor = message;
        storagesADO.storage[from].op = 2;
      } else if (opcao == 2) {
        client.sendButton(from, "🔵Escolha uma das opções🔵", [{
            "type": "reply",
            "reply": {
              "id": "Calcular",
              "title": "Calcular"
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
        mensagem = null;
        storagesADO.storage[from].emprestimo.parcelas = message;
        storagesADO.storage[from].op = 3;
      } else if (opcao == 3) {
        if (message == "Cancelar") {
          mensagem = "❌Proposta Cancelada!❌";
          storagesADO.storage[from].op = 0;
          storagesADO.storage[from].stage = 0;
          // geraProtocolo.AlterarStatusPrincipal(storagesADO.storage[from].protocolo, "C");
        } else if (message == "Calcular") {
          let calculo;
          let valor = parseInt(storagesADO.storage[from].emprestimo.valor);
          let parcelas = parseInt(storagesADO.storage[from].emprestimo.parcelas);
          calculo = valor / parcelas;
          client.sendButton(from, `✅O valor de cada parcela será de R$ ${calculo.toFixed(2)}✅
🟢 Para Abrir uma análise de empréstimo aperte no *SIM*🟢`, [{
            "type": "reply",
            "reply": {
              "id": "SIM",
              "title": "SIM"
            }
          }])
          mensagem = null;
          storagesADO.storage[from].emprestimo.valor_parcela = calculo;
          storagesADO.storage[from].op = 4;
        }
      } else if (message.toLowerCase() == "sim") {
        // geraProtocolo.AlterarStatusPrincipal(storagesADO.storage[from].protocolo, "F");
        // mensagem = geraProtocolo.CriaDadosProtocolo(from);
        storagesADO.storage[from].op = 0;
        storagesADO.storage[from].stage = 0;
        abrirProcesso.aprovarProcesso(from)
        mensagem = "🟢Protocolo Gerado🟢"
      } else {
        mensagem = "❌ *Digite uma opção válida, por favor.* \n⚠️ ```APENAS UMA OPÇÃO POR VEZ``` ⚠️";
      }

      // setTimeout(() => {
      //   geraProtocolo.CriarProtocoloMSG(storagesADO.storage[from].protocolo, message);
      //   setTimeout(() => {
      //     geraProtocolo.CriarProtocoloMSGBot(storagesADO.storage[from].protocolo, mensagem);
      //   }, 1000);
      // }, 1000);
    }

    processStep(); // Inicia o processamento da etapa

    return mensagem; // Retorna a mensagem no final
  }
};

exports.quartaMensagem = quartaMensagem;