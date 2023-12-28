const fetch = require('node-fetch');

let etapa = 2;

let usuario = {
  login: "robo",
  senha: "lecom"
}

function authentication() {
  const url = `https://bpm-desenvolvimento.nexum.com.br/sso/api/v1/authentication`
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "user": usuario.login,
      "pass": usuario.senha,
      "keepMeLoggedIn": "true"
    })
  }

  return fetch(url, options)
    .then(response => {
      if (response.ok) {
        return response.json() // converte a resposta em formato JSON
      } else {
        throw new Error('Erro na requisição'); // lança uma exceção se a resposta não estiver ok
      }
    })
    .then(data => { // mostra o corpo da resposta como um objeto JavaScript
      return data['ticket-sso']; // retorna o token de autenticação
    })
    .catch(error => {
      console.error(error);
    });
}


async function aprovarProcesso(numProcesso) {
  var ticket = await authentication();
  console.log(ticket);
  const url = `https://bpm-desenvolvimento.nexum.com.br/bpm/api/v1/process-instances/${numProcesso}/activity-instances/${etapa}/cycles/1/complete`;
  console.log(url)
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    headers: {
      'Content-Type': 'application/json',
      'ticket-sso': ticket,
      'language': 'pt_BR',
      'test-mode': 'false',
      'test-user': '4',
    },
    body: JSON.stringify({
      action: "P",
    })
  }

  const response = await fetch(url, options);
  if (response.status === 200) {
    console.log(`O processo ${numProcesso} foi aprovado com sucesso`);
  } else {
    console.log(response)
  }
}

exports.aprovarProcesso = aprovarProcesso;