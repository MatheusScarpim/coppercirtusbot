const storage = require('../Feira/storage')
const stageIndex = require('../Feira/stages/index')


const stages = [{
  stage: stageIndex.intents.initialStage,
},];

function getStage({
  from
}) {
  if (storage.storage[from]) {
    return storage.storage[from].stage;
  }
  storage.storage[from] = {
    stage: 0,
    nome: "",
    processo: ""
  };

  return storage.storage[from].stage;
}

exports.stages = stages;
module.exports.getStage = getStage;