const express = require('express');
const stagesADO = require('../../../Nexum/stages.js');
const jwt = require('jsonwebtoken');
const clientInstance = require('../../../../server.js');
const criarConexao = require('../../Hospedagem/BancoDeDados/BancoDeDados.js');
const scarlatMeta = require('../../../../meta_modules/ScarlatMeta/Requisicoes/API.js');
const moment = require('moment');
const bodyParser = require('body-parser');
const multer = require('multer');
const storagesADO = require('../../../Nexum/storage.js');
const geraProtocoloMSG = require('../../../Nexum/gerarProtocolos/geraDadosProtocolo.js')
const geraProtocolo = require('../../../Nexum/gerarProtocolos/geraProtocoloPrincipal.js')

let cachedClient = null;
let cachedDb = null;
let entradaCount = 0;
const MAX_ENTRADAS = 10; // Defina o número máximo de entradas antes de fechar e reabrir a conexão

async function obterCliente() {
  if (!cachedClient || !cachedDb) {
    cachedClient = await criarConexao.Client();
    cachedDb = cachedClient.db('ScarlatDataBase');
  }
  return cachedDb;
}

const upload = multer({
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB em bytes (ajuste conforme necessário)
  },
});


const router = express.Router();

router.use(bodyParser.json({
  limit: '50mb'
}));


router.post('/sendMessage', enviarMensagemTextoNaoOficial);
router.post('/sendText', enviarMensagemTexto);
router.get('/chatId', obterMensagensPorChatId);
router.get('/chatMensagens', obterChatMensagens);
router.post('/sendTemplate', sendTemplate);
router.post('/sendDocument', sendDocument);
router.post('/uploadMedia', upload.any(), uploadMedia);
router.post('/lerMensagem', ProtocoloLido);
router.post('/sendOptions', enviarOpcoes);
router.get('/getProtocolos', retornarProtolocos);
router.post('/sendFileBase64', sendFileBase64);



async function verificarToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, 'supersecret', (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
}

async function enviarMensagemTextoNaoOficial(req, res) {
  try {
    const {
      telnumber,
      token,
      protocolo
    } = req.headers;
    const {
      message
    } = req.body;
    let decoded;
    if (token.toString() == "sC@rl1T") {
      decoded = true;
    } else {
      decoded = await verificarToken(token);
    }
    if (decoded) {
      const numeroExiste = telnumber + '@c.us';


      const currentStage = stagesADO.getStage({
        from: numeroExiste
      });
      if (protocolo == "true") {
        if (storagesADO.storage[numeroExiste].protocolo != 0) {
          geraProtocolo.AlteraStatusProtocolo(storagesADO.storage[numeroExiste].protocolo, "F");
        }
        await clientInstance.client.sendText(numeroExiste, message.toString());
        //////////////////////////////////////////////////////////////////////////////////////////////AQUI ESTA O OURO
        // const Nome = await clientInstance.client.getChatById(numeroExiste);
        // console.log(Nome.contact.pushname);

        // const Foto = await clientInstance.client.getProfilePicFromServer(numeroExiste);
        // console.log(Foto);
        // // Uso da função
        // imageUrlToBase64(Foto.imgFull)
        //   .then(base64String => console.log(base64String))
        //   .catch(error => console.error('Erro ao converter imagem para base64:', error));
        ////////////////////////////////////////////////////////////////////////////////////////////
        let numProcotocolo;
        setTimeout(() => {
          geraProtocolo.CriarProtocoloPrincipal(telnumber)
            .then((nextId) => {
              storagesADO.storage[numeroExiste].protocolo = nextId;
              storagesADO.storage[numeroExiste].stage = 0;

              numProcotocolo = nextId;

              setTimeout(() => {
                geraProtocoloMSG.CriarProtocoloMSGBot(storagesADO.storage[numeroExiste].protocolo, message.toString());
              }, 1000);
              res.json({
                "status": "sucesso",
                "protocolo": numProcotocolo
              });
            })
            .catch((error) => {
              console.error("Erro ao criar protocolo:", error);
            });
        }, 1000);
      } else if (protocolo == "false") {
        if (storagesADO.storage[numeroExiste].stage == 0) {
          await clientInstance.client.sendText(numeroExiste, message.toString());
          if (storagesADO.storage[numeroExiste].protocolo != 0 && storagesADO.storage[numeroExiste].protocolo) {
            setTimeout(() => {
              geraProtocoloMSG.CriarProtocoloMSGBot(storagesADO.storage[numeroExiste].protocolo, message.toString());
            }, 1000);
          }
        } else {
          res.status(404).json({
            "status": "ERRO",
            "retorno": "Não é possivel enviar com um protocolo de opções aberto"
          })
        }
        res.json({
          "status": "sucesso"
        });
      } else {
        res.json({
          "status": "Só é aceito TRUE ou FALSE em protocolo"
        });
      }
    }
  } catch (error) {
    console.error('Erro na função enviarMensagemTextoNaoOficial:', error);
    res.status(500).send('Erro na função enviarMensagemTextoNaoOficial: ' + error);
  }
}

async function sendFileBase64(req, res) {
  try {
    const {
      telnumber,
      token,
      nomearquivo
    } = req.headers;
    const {
      base64
    } = req.body;
    let decoded;

    if (token.toString() == "sC@rl1T") {
      decoded = true;
    } else {
      decoded = await verificarToken(token);
    }

    if (decoded) {
      console.log("Base64");
      console.log(base64);
      console.log(telnumber);
      let retorno = await clientInstance.client.sendFile(telnumber + "@c.us", base64, nomearquivo);

      console.log(retorno);
      res.json(retorno);
    } else {
      res.status(401).send({
        status: "erro",
        mensagem: "Token inválido"
      });
    }
  } catch (error) {
    res.send(error);
  }
}

async function enviarOpcoes(req, res) {
  try {
    const {
      telnumber,
      token,
    } = req.headers;
    const {
      params
    } = req.body


    // params : {
    //   message: "";
    //   opcoes: [{
    //     type: "CALLBACK,CANCELAR,FINALIZAR,TEXTO",
    //     id : ""
    //     method : ""
    //     text: "",
    //     callback: "",
    //     reply: ""
    //   }]
    // }


    let montaMensagem = `${params.message}\n${params.opcoes.map((opcao) => `${opcao.id} - ${opcao.text}`).join("\n")}`;
    let decoded;
    if (token.toString() == "sC@rl1T") {
      decoded = true;
    } else {
      decoded = await verificarToken(token);
    }
    if (decoded) {
      const numeroExiste = telnumber + '@c.us';


      const currentStage = stagesADO.getStage({
        from: numeroExiste
      });

      if (storagesADO.storage[numeroExiste].protocolo != 0) {
        geraProtocolo.AlteraStatusProtocolo(storagesADO.storage[numeroExiste].protocolo, "F");
      }

      await clientInstance.client.sendText(numeroExiste, montaMensagem);

      let numProcotocolo;

      setTimeout(() => {
        geraProtocolo.CriarProtocoloPrincipal(telnumber)
          .then((nextId) => {
            storagesADO.storage[numeroExiste].protocolo = nextId;
            storagesADO.storage[numeroExiste].params = params;

            numProcotocolo = nextId;

            setTimeout(() => {
              geraProtocoloMSG.CriarProtocoloMSGBot(storagesADO.storage[numeroExiste].protocolo, montaMensagem);
            }, 1000);
            res.json({
              "status": "sucesso",
              "protocolo": numProcotocolo
            });
          })
          .catch((error) => {
            console.error("Erro ao criar protocolo:", error);
          });
      }, 1000);
    }
  } catch (error) {
    console.error('Erro na função enviarMensagemTextoNaoOficial:', error);
    res.status(500).send('Erro na função enviarMensagemTextoNaoOficial: ' + error);
  }
}
async function retornarProtolocos(req, res) {
  try {
    const {
      status,
      token
    } = req.headers;
    let decoded;

    if (token.toString() == "sC@rl1T") {
      decoded = true;
    } else {
      decoded = await verificarToken(token);
    }

    if (decoded) {

      let retorno = await obterDadosProtocolos(status)

      res.json(retorno);
    } else {
      res.status(401).send({
        status: "erro",
        mensagem: "Token inválido"
      });
    }
  } catch (error) {
    res.send(error);
  }
}


async function ProtocoloLido(req, res) {
  try {
    const {
      protocolo,
      token
    } = req.headers;
    let decoded;

    if (token.toString() == "sC@rl1T") {
      decoded = true;
    } else {
      decoded = await verificarToken(token);
    }

    if (decoded) {

      let retorno = await alterarNaoLidos(protocolo)

      res.json(retorno);
    } else {
      res.status(401).send({
        status: "erro",
        mensagem: "Token inválido"
      });
    }
  } catch (error) {
    res.send(error);
  }
}


async function enviarMensagemTexto(req, res) {
  try {
    const {
      telnumber,
      message,
      token
    } = req.headers;
    const decoded = await verificarToken(token);

    if (decoded) {

      await scarlatMeta.sendText(telnumber, message);

      const return_object = {
        status: "sucesso",
      };

      res.send(return_object);
    } else {
      res.status(401).send({
        status: "erro",
        mensagem: "Token inválido"
      });
    }
  } catch (error) {
    res.send(error);
  }
}

async function sendTemplate(req, res) {
  try {
    const {
      telnumber,
      nometemplate,
      token
    } = req.headers;
    const decoded = await verificarToken(token);
    if (decoded) {

      const resp = await scarlatMeta.sendTemplate(telnumber, nometemplate, req.body);

      if (resp.status != "200") {
        res.status(resp.status).send({
          status: "erro",
          mensagem: resp.data
        })
      } else {
        res.status(200).send(resp.data);
      }

    } else {
      res.status(401).send({
        status: "erro",
        mensagem: "Token inválido"
      });
    }
  } catch (error) {
    res.send(error);
    console.log(error)
  }
}

async function uploadMedia(req, res) {
  try {
    const {
      nomedocumento,
      token,
      mimeType
    } = req.headers;
    // console.log(req.headers.mimetype);
    // const fileBuffer = req.file.buffer;
    const decoded = await verificarToken(token);
    if (decoded) {

      const resp = await scarlatMeta.uploadFile(nomedocumento, req.body, req.headers.mimetype, res);
      const return_object = {
        status: resp,
      };

      res.send(return_object);
    } else {
      res.status(401).send({
        status: "erro",
        mensagem: "Token inválido"
      });
    }
  } catch (error) {
    console.log(error);
    res.send(error);
  }
}

async function sendDocument(req, res) {
  try {
    const {
      telnumber,
      iddocument,
      nomdocument,
      token
    } = req.headers;
    console.log(req.headers);
    const decoded = await verificarToken(token);

    if (decoded) {

      const resp = await scarlatMeta.sendFile(telnumber, iddocument, nomdocument);
      const return_object = {
        status: resp.data,
      };

      if (resp.status != "200") {
        res.status(resp.status).send({
          status: "erro",
          mensagem: resp.data
        })
      } else {
        res.status(200).send(return_object);
      }

    } else {
      res.status(401).send({
        status: "erro",
        mensagem: "Token inválido"
      });
    }
  } catch (error) {
    res.send(error);
  }
}

async function obterMensagensPorChatId(req, res) {
  try {
    const {
      telnumber,
      token
    } = req.headers;
    const decoded = await verificarToken(token);

    if (decoded) {
      const numeroExiste = telnumber + '@c.us';
      const retorno = await clientInstance.client.getMessages(numeroExiste);

      const return_object = {
        status: "sucesso",
        response: retorno
      };

      res.send(return_object);
    } else {
      res.status(401).send({
        status: "erro",
        mensagem: "Token inválido"
      });
    }
  } catch (error) {
    res.send(error);
  }
}


async function obterChatMensagens(req, res) {
  try {
    const {
      protocolo,
      token
    } = req.headers;
    let decoded;

    if (token.toString() == "sC@rl1T") {
      decoded = true;
    } else {
      decoded = await verificarToken(token);
    }

    if (decoded) {
      const statusProtocolo = await obterDadosDaColecaoProtocolo(protocolo);

      if (statusProtocolo) {
        const dataCriacaoFormatada = moment(statusProtocolo.DATA_CRIACAO).format('DD/MM/YYYY HH:mm:ss');
        const ultimoContatoFormatado = moment(statusProtocolo.ULTIMO_CONTATO).format('DD/MM/YYYY HH:mm:ss');
        const numeroFormatado = formatarNumero(statusProtocolo.NUMERO);

        const dadosMensagens = await obterDadosDaColecaoMensagens(protocolo);

        if (dadosMensagens) {
          const sortedDados = dadosMensagens.sort((a, b) => b.ORDEM - a.ORDEM);

          const mappedDados = sortedDados.map(item => {
            return {
              PROTOCOLO_ID: item.PROTOCOLO_ID,
              MENSAGEM: item.MENSAGEM,
              DATA_ENVIO: item.DATA_ENVIO,
              ORDEM: item.ORDEM,
              USUARIO: item.USUARIO,
              LIDA: item.LIDA
            };
          });

          const return_object = {
            status: "sucesso",
            NUMERO: numeroFormatado,
            DATA_CRIACAO: dataCriacaoFormatada,
            ULTIMO_CONTATO: ultimoContatoFormatado,
            ULTIMA_MENSAGEM: sortedDados[0].MENSAGEM,
            STATUS: statusProtocolo.STATUS,
            MOME: statusProtocolo.NOME,
            FOTOPERFIL: statusProtocolo.FOTOPERFIL,
            mensagens: mappedDados
          };

          res.json(return_object);
        } else {
          res.status(404).send({
            status: "erro",
            mensagem: "Mensagens não encontradas"
          });
        }
      } else {
        res.status(404).send({
          status: "erro",
          mensagem: "Protocolo não encontrado"
        });
      }
    } else {
      res.status(401).send({
        status: "erro",
        mensagem: "Token inválido"
      });
    }
  } catch (error) {
    res.json(error);
  }
}

function formatarNumero(numero) {
  // Remova o prefixo '55' e aplique a máscara de formatação desejada
  const numeroSemPrefixo = numero.replace(/^55/, '').replace("@c.us", "");

  // Formatação do número para o estilo (XX) XXXXX-XXXX
  const ddd = numeroSemPrefixo.substring(0, 2);
  const primeiraParte = numeroSemPrefixo.substring(2, 7);
  const segundaParte = numeroSemPrefixo.substring(7);

  return `(${ddd}) ${primeiraParte}-${segundaParte}`;
}

async function obterDadosDaColecaoMensagens(protocolo) {
  const client = await criarConexao.Client();
  const db = client.db('ScarlatDataBase');
  const collection = db.collection('MENSAGENS');
  const data = await collection.find({
    PROTOCOLO_ID: parseInt(protocolo)
  }).toArray();
  return data;
}

async function obterDadosProtocolos(status) {
  let retorno = [];
  try {
    const db = await obterCliente()
    const collectionProtocolos = db.collection('PROTOCOLOS');

    const dataProtocolos = await collectionProtocolos.find({
      STATUS: status.toString(),
    }).toArray();
    const collectionMensagem = db.collection('MENSAGENS');

    // Usando Promise.all para esperar por todas as consultas assíncronas
    await Promise.all(dataProtocolos.map(async (elemento) => {
      try {
        // Obter a última mensagem para o protocolo, independentemente de ter sido lida ou não
        let ultimaMensagem = await collectionMensagem.find({
          PROTOCOLO_ID: parseInt(elemento["_id"]),
        }).sort({
          DATA_ENVIO: -1
        }).limit(1).toArray();

        if (ultimaMensagem.length > 0) {
          ultimaMensagem = ultimaMensagem[0];

          retorno.push({
            PROTOCOLO_ID: elemento["_id"],
            NOME: elemento["NOME"],
            FOTOPERFIL: elemento["FOTOPERFIL"],
            NUMERO: formatarNumero(elemento["NUMERO"]),
            NAO_LIDAS: await collectionMensagem.countDocuments({
              PROTOCOLO_ID: parseInt(elemento["_id"]),
              LIDA: "false"
            }),
            DATA_CRIACAO: elemento["DATA_CRIACAO"],
            ULTIMO_CONTATO: elemento["ULTIMO_CONTATO"],
            ULTIMA_MENSAGEM: ultimaMensagem.MENSAGEM
          });
        } else {
          // Nenhuma mensagem encontrada para o protocolo
          retorno.push({
            PROTOCOLO_ID: elemento["_id"],
            NOME: elemento["NOME"],
            FOTOPERFIL: elemento["FOTOPERFIL"],
            NUMERO: formatarNumero(elemento["NUMERO"]),
            DATA_CRIACAO: elemento["DATA_CRIACAO"],
            ULTIMO_CONTATO: elemento["ULTIMO_CONTATO"],
            ULTIMA_MENSAGEM: "Nenhuma mensagem encontrada"
          });
        }
      } catch (error) {
        console.error("Error fetching data for Protocolo ID:", elemento["_id"], error);
      }
    }));
    retorno.sort((a, b) => b.NAO_LIDAS - a.NAO_LIDAS);
    return retorno;
  } catch (error) {
    if (
      error.message &&
      (error.message.includes('closed') || error.message.includes('Client must be connected') || error.message.includes('Cannot use a session that has ended') || error.message.includes("duplicate key") || error.message.includes("client"))
    ) {
      console.warn('Conexão fechada, expirada ou não conectada. Tentando novamente...');
      // Tenta obter uma nova conexão
      cachedClient = await criarConexao.Client();
      cachedDb = cachedClient.db('ScarlatDataBase');
      // Recurso para evitar um loop infinito
      if (entradaCount < MAX_ENTRADAS) {
        return obterDadosProtocolos(status);
      } else {
        console.error('Erro ao conectar e inserir documentos:', error);
      }
    } else {
      console.error('Erro ao conectar e inserir documentos:', error);
    }
  }
}


async function alterarNaoLidos(protocolo) {
  try {
    const db = await obterCliente()
    const collection = db.collection('MENSAGENS');
    await collection.updateMany({
      PROTOCOLO_ID: parseInt(protocolo),
      LIDA: "false"
    }, {
      $set: {
        LIDA: "true"
      }
    });
    return {
      "status": "sucesso"
    }
  } catch (error) {
    if (
      error.message &&
      (error.message.includes('closed') || error.message.includes('Client must be connected') || error.message.includes('Cannot use a session that has ended') || error.message.includes("duplicate key") || error.message.includes("client"))
    ) {
      console.warn('Conexão fechada, expirada ou não conectada. Tentando novamente...');
      cachedClient = await criarConexao.Client();
      cachedDb = cachedClient.db('ScarlatDataBase');
      if (entradaCount < MAX_ENTRADAS) {
        return alterarNaoLidos(protocolo);
      } else {
        console.error('Erro ao conectar e inserir documentos:', error);
      }
    } else {
      console.error('Erro ao conectar e inserir documentos:', error);
    }
  }
  return {
    "status": "ERRO"
  }
}


async function obterDadosDaColecaoProtocolo(protocolo) {
  try {
    const db = await obterCliente()
    const collection = db.collection('PROTOCOLOS');
    const data = await collection.findOne({
      _id: parseInt(protocolo)
    });
    return data;
  } catch (error) {
    if (
      error.message &&
      (error.message.includes('closed') || error.message.includes('Client must be connected') || error.message.includes('Cannot use a session that has ended') || error.message.includes("duplicate key") || error.message.includes("client"))
    ) {
      console.warn('Conexão fechada, expirada ou não conectada. Tentando novamente...');
      cachedClient = await criarConexao.Client();
      cachedDb = cachedClient.db('ScarlatDataBase');
      if (entradaCount < MAX_ENTRADAS) {
        return obterDadosDaColecaoProtocolo(protocolo);
      } else {
        console.error('Erro ao conectar e inserir documentos:', error);
      }
    } else {
      console.error('Erro ao conectar e inserir documentos:', error);
    }
  }
}

module.exports = router;