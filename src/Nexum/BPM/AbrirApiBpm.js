const storagesADO = require('../storage')
const fetch = require('node-fetch');
const geral = require("../../geralBots/CadastrarProtocolo")

let usuario = { login: "adm", senha: "lecom" }

function authentication() {
  const url = `https://bpm-apresentacao.nexum.com.br/sso/api/v1/authentication`
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

function abrirProcesso(tokenLogin) {
  const url = `https://bpm-apresentacao.nexum.com.br/bpm/api/v1/process-definitions/74/versions/1/start`
  const options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'ticket-sso': tokenLogin,
      'language': 'pt_BR',
      'test-mode': 'true',
      'test-user': '1',
    },
  };

  return fetch(url, options)
    .then(response => {
      if (response.ok) {
        return response.json(); // converte a resposta em formato JSON
      } else {
        throw new Error('Erro na requisição'); // lança uma exceção se a resposta não estiver ok
      }
    })
    .then(data => {
      console.log()
      return {
        numProcesso: data.content.processInstanceId,
        codAtividade: data.content.currentActivityInstanceId
      }; // retorna um objeto com as informações de numProcesso e codAtividade
    })
    .catch(error => {
      console.error(error);
    });
}


async function aprovarProcesso(from) {
  var ticket = await authentication();
  let dados = await abrirProcesso(ticket)
  const url = `https://bpm-apresentacao.nexum.com.br/bpm/api/v1/process-instances/${dados.numProcesso}/activity-instances/${dados.codAtividade}/cycles/1/complete?`;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    headers: {
      'Content-Type': 'application/json',
      'ticket-sso': ticket,
      'language': 'pt_BR',
      'test-mode': 'true',
      'test-user': '1',
    },
    body: JSON.stringify({
      action: "P",
      values: [{ id: "LT_CPF_CNPJ", value: storagesADO.storage[from].cpf },
      { id: "LT_EMAIL", value: storagesADO.storage[from].email },
      { id: "LT_VALOR", value: storagesADO.storage[from].emprestimo.valor },
      { id: "LT_PARCELAS", value: storagesADO.storage[from].emprestimo.parcelas },
      { id: "LT_VALOR_PARCELA", value: storagesADO.storage[from].emprestimo.valor_parcela },
      ]
    })
  }

  const response = await fetch(url, options);
  if (response.ok) {
    return `Sua solicitação foi aberta com sucesso`;
  } else {
    return `Erro na abertura da solicitação`;
  }

}

exports.aprovarProcesso = aprovarProcesso;