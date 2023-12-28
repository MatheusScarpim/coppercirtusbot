//Scarpim: Id do protocolo (puxar da principal), mensagem enviada,data de envio,ordem
const criarConexao = require('../../assets/Hospedagem/BancoDeDados/BancoDeDados');
const moment = require('moment-timezone');
const {
  use
} = require('../../assets/login/login');
const Utils = require('../gerarProtocolos/Utils/Utils');
const gerarProtocolos = require('../gerarProtocolos/geraProtocoloPrincipal');
const storagesADO = require('../storage');

async function CriarProtocoloMSG(id, msg) {
  try {
    var dataAtual = new Date();
    const dataAtualFormatada = moment.tz('America/Sao_Paulo').format('YYYY-MM-DD HH:mm:ss');
    const client = await criarConexao.Client();
    const db = client.db('ScarlatDataBase');
    const collection = db.collection('MENSAGENS');

    // Encontrar o último valor de ORDEM para o mesmo PROTOCOLO_ID
    const lastOrdem = await collection.findOne({
      PROTOCOLO_ID: id
    }, {
      sort: {
        ORDEM: -1
      }
    });
    const nextOrdem = lastOrdem ? lastOrdem.ORDEM + 1 : 1;

    const lastid = await collection.findOne({}, {
      sort: {
        _id: -1
      }
    });
    const nextid = lastid ? lastid._id + 1 : 1;

    await collection.insertOne({
      _id: nextid,
      PROTOCOLO_ID: id,
      MENSAGEM: msg,
      DATA_ENVIO: dataAtualFormatada,
      ORDEM: nextOrdem,
      USUARIO: "U",
      LIDA: "false"
    });

    client.close();
    await gerarProtocolos.UpdateUltimoContrato(id);

    const delayMilliseconds = 1000; // 1 segundo
    await new Promise((resolve) => setTimeout(resolve, delayMilliseconds));

    // Continuar com o resto do código após o atraso
    // ...
  } catch (error) {
    console.error('Erro ao conectar e inserir documentos:', error);
  }
}



async function CriarProtocoloMSGBot(id, msg) {
  try {
    var dataAtual = new Date();
    const dataAtualFormatada = moment.tz('America/Sao_Paulo').format('YYYY-MM-DD HH:mm:ss');
    const client = await criarConexao.Client();
    const db = client.db('ScarlatDataBase');
    const collection = db.collection('MENSAGENS');

    // Encontrar o último valor de ORDEM para o mesmo PROTOCOLO_ID
    const lastOrdem = await collection.findOne({
      PROTOCOLO_ID: id
    }, {
      sort: {
        ORDEM: -1
      }
    });
    const nextOrdem = lastOrdem ? lastOrdem.ORDEM + 1 : 1;

    const lastid = await collection.findOne({}, {
      sort: {
        _id: -1
      }
    });
    const nextid = lastid ? lastid._id + 1 : 1;
    await collection.insertOne({
      _id: nextid,
      PROTOCOLO_ID: id,
      MENSAGEM: msg,
      DATA_ENVIO: dataAtualFormatada,
      ORDEM: nextOrdem,
      USUARIO: "B",
      LIDA: "true"
    });
    client.close();
    await gerarProtocolos.UpdateUltimoContrato(id);

    const delayMilliseconds = 1000; // 1 segundo
    await new Promise((resolve) => setTimeout(resolve, delayMilliseconds));

    // Continuar com o resto do código após o atraso
    // ...
  } catch (error) {
    console.error('Erro ao conectar e inserir documentos:', error);
  }
}


async function CriaDadosProtocolo(from) {
  try {
    const client = await criarConexao.Client();
    const db = client.db('ScarlatDataBase'); // Substitua pelo nome do seu banco de dados  
    const collection = db.collection('SOLICITACAO_EMPRESTIMO');
    await collection.insertOne({
      _id: storagesADO.storage[from].protocolo,
      CPF: storagesADO.storage[from].cpf,
      Email: storagesADO.storage[from].email,
      ValorParcela: storagesADO.storage[from].emprestimo.valor_parcela,
      Parcela: storagesADO.storage[from].emprestimo.parcelas,
      Valor: storagesADO.storage[from].emprestimo.valor,
    });


    const documents = await collection.find().toArray();

    console.log('Documentos encontrados:');
    console.log(documents);

    console.log('Documentos inseridos com sucesso!');

    client.close();
    return "Solicitação Criada com sucesso"
  } catch (error) {
    console.error('Erro ao conectar e inserir dados do Usuario:', error);
  }
}

async function gravaMensagem(numero) {
  try {
    // Formatar o número para o formato desejado (remover @c.us e adicionar os parênteses, espaço e hífen)
    const numeroFormatado = formatarNumero(numero);

    const client = await criarConexao.Client();
    const db = client.db('ScarlatDataBase');
    const collection = db.collection('MENSAGENS');

    // Utilizando uma expressão regular para encontrar o número no formato desejado
    const regexNumero = new RegExp(`^${numeroFormatado}$`, 'i');
    // Encontrar o último valor de ORDEM para o número formatado
    const lastOrdem = await collection.findOne({
      USUARIO: "U",
      MENSAGEM: regexNumero
    }, {
      sort: {
        ORDEM: -1
      }
    });

    client.close();

    return lastOrdem ? lastOrdem.ORDEM : null;
  } catch (error) {
    console.error('Erro ao conectar e consultar documentos:', error);
    return null;
  }
}

function formatarNumero(numeroOriginal) {
  // Extrair apenas os dígitos do número original
  const numeros = numeroOriginal.match(/\d/g).join('');

  // Formatar para (XX) XXXXX-XXXX
  return `(${numeros.substring(2, 3)}) ${numeros.substring(4, 8)}-${numeros.substring(8)}`;
}

function AlterarStatusPrincipal(id, status) {
  gerarProtocolos.AlteraStatusProtocolo(id, status);
}


exports.CriarProtocoloMSG = CriarProtocoloMSG;
exports.CriaDadosProtocolo = CriaDadosProtocolo;
exports.AlterarStatusPrincipal = AlterarStatusPrincipal;
exports.CriarProtocoloMSGBot = CriarProtocoloMSGBot;
exports.gravaMensagem = gravaMensagem;