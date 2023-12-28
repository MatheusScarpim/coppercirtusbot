
// const InsertDocuments = require('../assets/Hospedagem/BancoDeDados/BancoDeDados');
const criarConexao = require('../assets/Hospedagem/BancoDeDados/BancoDeDados');
// Função para cadastrar usuário

function cadastrarSolicitacao(valores) {
  let valoresSolic = valores.cadastrarSolic;
  // const conexao = criarConexao.connection;
  // conexao.query('INSERT INTO f_solic_emprest (cpf, email, vlrParcela, qtdParcelas, vlrTotal,idprotocolo) VALUES (?, ?, ?, ?, ?,?)', [valoresSolic.cpf, valoresSolic.email, valoresSolic.valorparcela, valoresSolic.parcelas, valoresSolic.valor, id], (err) => {
  //   if (err) {
  //     console.error(err.message);
  //   }
  // });
  InsertDadosProtocolo(valoresSolic.cpf, valoresSolic.email, valoresSolic.valorparcela, valoresSolic.parcelas, valoresSolic.valor);
}

async function cadastrarUser(valores) {
  // const conexao = criarConexao.connection;
  let valoresProtocolo = valores.cadastrarProtocolo;
  // const [rows, fields] = await conexao.promise().query('INSERT INTO protocolos (protocolo, origem, numero, criado, ultimoContato, canal) VALUES (?, ?, ?, ?, ?, ?)', [valoresProtocolo.numProcesso, valoresProtocolo.origem, valoresProtocolo.numero, valoresProtocolo.criado, valoresProtocolo.ultimoContato, valoresProtocolo.canal]);
  cadastrarSolicitacao(valores);
  InsertDocuments(valoresProtocolo.numProcesso, valoresProtocolo.origem, valoresProtocolo.numero, valoresProtocolo.criado, valoresProtocolo.ultimoContato, valoresProtocolo.canal)
}



async function InsertDadosProtocolo(CPF, Email, ValorParc, Parcela, Valor) {
  try {
    const client = await criarConexao.Client();
    const db = client.db('scarlatbot01'); // Substitua pelo nome do seu banco de dados  
    const collection = db.collection('DadosProtocolo');
    const lastDocument = await collection.findOne({}, { sort: { _id: -1 } });
    const nextId = lastDocument ? lastDocument._id + 1 : 1;
    await collection.insertOne({
      _id: nextId,
      CPF: CPF,
      Email: Email,
      ValorParcela: ValorParc,
      Parcela: Parcela,
      Valor: Valor,
    });


    const documents = await collection.find().toArray();

    console.log('Documentos encontrados:');
    console.log(documents);

    console.log('Documentos inseridos com sucesso!');

    client.close();
  } catch (error) {
    console.error('Erro ao conectar e inserir dados do Usuario:', error);
  }
}

async function InsertDocuments(NumProtocolo, origem, numero, criado, ultimoContato, canal) {
  try {
    const client = await criarConexao.Client();
    const db = client.db('scarlatbot01'); // Substitua pelo nome do seu banco de dados  
    const collection = db.collection('Protocolos');
    const lastDocument = await collection.findOne({}, { sort: { _id: -1 } });
    const nextId = lastDocument ? lastDocument._id + 1 : 1;
    await collection.insertOne({
      _id: nextId,
      NumProtocolo: NumProtocolo,
      Origem: origem,
      Numero: numero,
      Criado: criado,
      ultimoContato: ultimoContato,
      Canal: canal
    });


    const documents = await collection.find().toArray();

    console.log('Documentos encontrados:');
    console.log(documents);

    console.log('Documentos inseridos com sucesso!');

    client.close();
  } catch (error) {
    console.error('Erro ao conectar e inserir documentos:', error);
  }
}

// Função para gerar data formatada para SQL
function gerarData(data) {
  var dataSql = data.toISOString().replace(/T/, ' ').replace(/\..+/, '');
  return dataSql;
}

function formatarvalor(valor) {
  valor = parseFloat(valor);
  return valor.toFixed(2);
}

function formatarData(datausada) {
  const data = new Date(datausada);

  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = String(data.getFullYear());
  const horas = String(data.getHours()).padStart(2, '0');
  const minutos = String(data.getMinutes()).padStart(2, '0');
  const segundos = String(data.getSeconds()).padStart(2, '0');

  const dataFormatada = `${dia}/${mes}/${ano} ${horas}:${minutos}:${segundos}`;
}

function gerarNumeroFormatado(numero) {
  var datacorrigida = numero.replace("@c.us", "")
  return datacorrigida;
}


module.exports = {
  cadastrarUser,
  gerarData,
  gerarNumeroFormatado,
  cadastrarSolicitacao,
  formatarData,
  formatarvalor
};
