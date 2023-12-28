const storage = require('../Solicitacao_de_emprestimo/storage')
const stageIndex = require('../Solicitacao_de_emprestimo/stages/index')


const stages = [{
    stage: stageIndex.intents.initialStage,
  },
  {
    stage: stageIndex.intents.primeiraMensagem,
  },
  {
    stage: stageIndex.intents.segundaMensagem,
  },
  {
    stage: stageIndex.intents.terceiraMensagem,
  },
  {
    stage: stageIndex.intents.quartaMensagem,
  },
];

function getStage({
  from
}) {
  if (storage.storage[from]) {
    return storage.storage[from].stage;
  }
  storage.storage[from] = {
    stage: 0,
    op: 0,
    cpf: '',
    email: '',
    emprestimo: {
      valor: 0,
      parcelas: 0,
      valor_parcela: 0
    },
    protocolo: 0
  };

  return storage.storage[from].stage;
}

exports.stages = stages;
module.exports.getStage = getStage;