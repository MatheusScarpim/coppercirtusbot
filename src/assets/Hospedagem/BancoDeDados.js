const sqlite3 = require('sqlite3').verbose();


function criarConexao() {
  return new sqlite3.Database(__dirname + '/Tabelas/ServidorScarlat', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Conectado ao banco de dados SQLite.');
  });
}

// Exporta a função de criação de conexão para outros módulos
module.exports = criarConexao;


const db = new sqlite3.Database(__dirname + "/Tabelas/ServidorScarlat", (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Conectado ao banco de dados SQLite.');
});
   
  db.run(`CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    protocolo TEXT NOT NULL,
    origem TEXT NOT NULL,
    numero TEXT NOT NULL,
    criado DateTime NOT NULL,
    ultimoContato DateTime NOT NULL,
    canal TEXT NOT NULL)`, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Tabela criada com sucesso.');
  });