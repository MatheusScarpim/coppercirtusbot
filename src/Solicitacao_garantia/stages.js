const storage = require('../Solicitacao_garantia/storage')
const stageIndex = require('../Solicitacao_garantia/stages/index')


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
    monobloco: "",
    defeito: "",
    imagem: "",
  };

  return storage.storage[from].stage;
}

exports.stages = stages;
module.exports.getStage = getStage;