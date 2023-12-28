//Meu: Id de protocolo, número, data Criada, ultimo contato (Mudou a mensagem dela salva ), status
const criarConexao = require('../../assets/Hospedagem/BancoDeDados/BancoDeDados');
const Utils = require('../gerarProtocolos/Utils/Utils');


async function CriarProtocoloPrincipal(numero) {
    try {
        var dataAtual = new Date();
        let dataAtualFormatada = Utils.gerarData(dataAtual)
        const client = await criarConexao.Client();
        const db = client.db('scarlatbot01'); // Substitua pelo nome do seu banco de dados  
        const collection = db.collection('PROTOCOLOS');
        const lastDocument = await collection.findOne({}, { sort: { _id: -1 } });
        const nextId = lastDocument ? lastDocument._id + 1 : 1;
        await collection.insertOne({
            _id: nextId,
            NUMERO: numero,
            DATA_CRIACAO: dataAtualFormatada,
            ULTIMO_CONTATO: dataAtualFormatada,
            STATUS: "A",
        });
        client.close();
        return nextId;
    } catch (error) {
      console.error('Erro ao conectar e inserir documentos:', error);
    }
}

async function UpdateUltimoContrato(id) {
    try {
        var dataAtual = new Date();
        let dataAtualFormatada = Utils.gerarData(dataAtual)
        const client = await criarConexao.Client();
        const db = client.db('scarlatbot01'); // Substitua pelo nome do seu banco de dados  
        const collection = db.collection('PROTOCOLOS');
        await collection.updateOne( 
            { _id: id },
            { $set: { ULTIMO_CONTATO: dataAtualFormatada } }
        );

        client.close();
    } catch (error) {
      console.error('Erro ao conectar e inserir documentos:', error);
    }
}

async function AlteraStatusProtocolo(id,status) {
    try {
        const client = await criarConexao.Client();
        const db = client.db('scarlatbot01'); // Substitua pelo nome do seu banco de dados  
        const collection = db.collection('PROTOCOLOS');
        await collection.updateOne( 
            { _id: id },
            { $set: { STATUS: status } }
        );

        client.close();
    } catch (error) {
      console.error('Erro ao conectar e inserir documentos:', error);
    }
}

exports.UpdateUltimoContrato = UpdateUltimoContrato;
exports.CriarProtocoloPrincipal = CriarProtocoloPrincipal;
exports.AlteraStatusProtocolo = AlteraStatusProtocolo;