const storagesADO = require('../storage');

const initialStage = {
  exec({
    from,
    message,
    client
  }) {
    client.sendListMessage(from, {
      buttonText: 'Escolha uma opção',
      description: 'Olá, meu nome é Alana e agradeço por entrar em contato com a CooperCitrus.\nPara iniciar escolha uma das opções?"',
      sections: [{
        title: 'Opções',
        rows: [{
            rowId: '1',
            title: 'Solicitação de Garantia',
          },
          {
            rowId: '2',
            title: 'Ouvidoria',
          }
        ],
      }, ],
    });


    storagesADO.storage[from].stage = 1;
    return null;
  },
};


exports.initialStage = initialStage;