const storagesADO = require('../storage.js');
const abrirProcesso = require('../BPM/AbrirApiBpm.js')


const segundaMensagem = {
  exec({
    from,
    message,
    client
  }) {
    storagesADO.storage[from].defeito = message;

    storagesADO.storage[from].op = 0;
    storagesADO.storage[from].stage = 0;

    abrirProcesso.aprovarProcesso(from, client)
    return null
  },
};

exports.segundaMensagem = segundaMensagem;