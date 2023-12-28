
const { MongoClient, ServerApiVersion } = require('mongodb');
const dbName = 'ScarlatDataBase';



let collections = ["PROTOCOLOS", "MENSAGENS", "SOLICITACAO_EMPRESTIMO"]
const url = `mongodb://admin:1mzU0kqNIZ@node160146-env-3513841.jelastic.saveincloud.net:27017/ScarlatDataBase`; /*Alteração da URL*/
const uri = "mongodb+srv://matheuscuan:334455@scarlatbot.85s8bhy.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const servidor = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// const client = new MongoClient(url, { useNewUrlParser: true });

servidor.connect(function (err) {
  if (err) {
    console.error('Erro ao conectar ao MongoDB:', err);
    return;
  }
  console.log('Conexão estabelecida com sucesso.');
});

async function createCollectionIfNotExists() {

  try {
    const client = await servidor.connect();
    const db = client.db(dbName);

    collections.forEach(async (element) => {
      const collectionName = element;

      const collections = await db.listCollections({ name: collectionName }).toArray();

      if (collections.length > 0) {
        console.log(`A coleção ${collectionName} já existe.`);
      } else {
        await db.createCollection(collectionName);
        console.log(`A coleção ${collectionName} foi criada com sucesso.`);
      }
    });

    setTimeout(() => {
      client.close();
    }, 1000);

  } catch (err) {
    console.error('Erro ao conectar e criar a coleção:', err);
  }
}


createCollectionIfNotExists();

async function Client() {
  const client = await servidor.connect();
  return client;
}

module.exports = {
  Client
}



// // const { MongoClient, ServerApiVersion } = require('mongodb');
// // const dbName = 'scarlat01';



// // let collections = ["PROTOCOLOS", "MENSAGENS", "SOLICITACAO_EMPRESTIMO"]
// // // const url = `mongodb://scarlat01:334455Matheus@mongodb.scarlat.kinghost.net:27017/scarlat01`; /*Alteração da URL*/
// // const url = `mongodb+srv://matheuscuan:334455Matheus@cluster0.jjivfzh.mongodb.net/?retryWrites=true&w=majority`; /*Alteração da URL*/

// // const uri = "mongodb+srv://admin:1mzU0kqNIZ@node160146-env-3513841.jelastic.saveincloud.net/?retryWrites=true&w=majority";

// // const cliente = new MongoClient(uri, {
// //   serverApi: {
// //     version: ServerApiVersion.v1,
// //     strict: true,
// //     deprecationErrors: true,
// //   }
// // });
// // const client = new MongoClient(url, { useNewUrlParser: true });

// // client.connect(function (err) {
// //   if (err) {
// //     console.error('Erro ao conectar ao MongoDB:', err);
// //     return;
// //   }
// //   console.log('Conexão estabelecida com sucesso.');
// // });

// // async function createCollectionIfNotExists() {

// //   try {
// //     const client = await cliente.connect();
// //     const db = client.db(dbName);

// //     collections.forEach(async (element) => {
// //       const collectionName = element;

// //       const collections = await db.listCollections({ name: collectionName }).toArray();

// //       if (collections.length > 0) {
// //         console.log(`A coleção ${collectionName} já existe.`);
// //       } else {
// //         await db.createCollection(collectionName);
// //         console.log(`A coleção ${collectionName} foi criada com sucesso.`);
// //       }
// //     });

// //     setTimeout(() => {
// //       client.close();
// //     }, 1000);

// //   } catch (err) {
// //     console.error('Erro ao conectar e criar a coleção:', err);
// //   }
// // }


// // createCollectionIfNotExists();

// // async function Client() {
// //   const client = await cliente.connect();
// //   return client;
// // }

// // module.exports = {
// //   Client
// // }


// mongodb://admin:1mzU0kqNIZ@node160146-env-3513841.jelastic.saveincloud.net:27017/scarlat01

// const dbHost = 'scarlatbot.85s8bhy.mongodb.net';
// const dbName = 'scarlat01';
// const dbUser = 'matheuscuan';
// const dbPassword = '334455Matheus';
// let dbURI = `mongodb+srv://${dbUser}:${dbPassword}@${dbHost}/${dbName}/?retryWrites=true&w=majority`;

// async function connectToDB() {
//   try {
//     const client = new MongoClient(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
//     await client.connect();
//     console.log('Conectado ao MongoDB');
//     return client.db();
//   } catch (error) {
//     console.error('Erro ao conectar ao MongoDB:', error);
//     throw error;
//   }
// }

// connectToDB();

// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://matheuscuan:334455@scarlatbot.85s8bhy.mongodb.net/?retryWrites=true&w=majority";

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);