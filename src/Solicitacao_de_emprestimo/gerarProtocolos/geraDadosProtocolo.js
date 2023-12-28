//Scarpim: Id do protocolo (puxar da principal), mensagem enviada,data de envio,ordem
const criarConexao = require('../../assets/Hospedagem/BancoDeDados/BancoDeDados');
const { use } = require('../../assets/login/login');
const Utils = require('../gerarProtocolos/Utils/Utils');
const gerarProtocolos = require('../gerarProtocolos/geraProtocoloPrincipal');
const storagesADO = require('../storage');

async function CriarProtocoloMSG(id, msg) {
  try {
    var dataAtual = new Date();
    let dataAtualFormatada = Utils.gerarData(dataAtual)
    const client = await criarConexao.Client();
    const db = client.db('scarlatbot01'); // Substitua pelo nome do seu banco de dados  
    const collection = db.collection('MENSAGENS');
    // const lastOrdem = await collection.findOne({ _id: id }, { sort: { ORDEM: -1 } });
    const lastOrdem = await collection.findOne({}, { sort: { ORDEM: -1 } });
    const nextOrdem = lastOrdem ? lastOrdem.ORDEM + 1 : 1;
    const lastid = await collection.findOne({}, { sort: { _id: -1 } });
    const nextid = lastid ? lastid._id + 1 : 1;
    await collection.insertOne({
      _id: nextid,
      PROTOCOLO_ID: id,
      MENSAGEM: msg,
      DATA_ENVIO: dataAtualFormatada,
      ORDEM: nextOrdem,
      USUARIO: "U"
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
    let dataAtualFormatada = Utils.gerarData(dataAtual)
    const client = await criarConexao.Client();
    const db = client.db('scarlatbot01'); // Substitua pelo nome do seu banco de dados  
    const collection = db.collection('MENSAGENS');
    // const lastOrdem = await collection.findOne({ _id: id }, { sort: { ORDEM: -1 } });
    const lastOrdem = await collection.findOne({}, { sort: { ORDEM: -1 } });
    const nextOrdem = lastOrdem ? lastOrdem.ORDEM + 1 : 1;
    const lastid = await collection.findOne({}, { sort: { _id: -1 } });
    const nextid = lastid ? lastid._id + 1 : 1;
    await collection.insertOne({
      _id: nextid,
      PROTOCOLO_ID: id,
      MENSAGEM: msg,
      DATA_ENVIO: dataAtualFormatada,
      ORDEM: nextOrdem,
      USUARIO: "B"
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
    const db = client.db('scarlatbot01'); // Substitua pelo nome do seu banco de dados  
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

    client.close();
    return "Solicitação Criada com sucesso"
  } catch (error) {
    console.error('Erro ao conectar e inserir dados do Usuario:', error);
  }
}

function AlterarStatusPrincipal(id, status) {
  gerarProtocolos.AlteraStatusProtocolo(id, status);
}


exports.CriarProtocoloMSG = CriarProtocoloMSG;
exports.CriaDadosProtocolo = CriaDadosProtocolo;
exports.AlterarStatusPrincipal = AlterarStatusPrincipal;
exports.CriarProtocoloMSGBot = CriarProtocoloMSGBot;