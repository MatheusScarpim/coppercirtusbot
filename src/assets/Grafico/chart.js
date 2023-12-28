// // Obter a referência ao elemento canvas do gráfico
var ctx = document.getElementById("myChart");

// Criar uma instância do gráfico
var myChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: [], // As labels serão atualizadas posteriormente
    datasets: [{
      label: '# of Votes',
      data: [], // Os dados serão atualizados posteriormente
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});

// (async () => {
//   const db = require('./Api');
//   const chamados = await db.NumChamados();
//   console.log(chamados);
//   myChart.data.labels = ["Atendimento", "Protocolos", "SolicEmpr"]
//   myChart.data.datasets[0].data = chamados.Atendimetno;
// })()
// const { NumChamados } = require('./Api.js');
// async function exemplo() {
//   const valores = await NumChamados();
//   console.log(valores);
//   // faça algo com os valores aqui
// }
// exemplo();

// Fazer uma requisição HTTP para obter os dados do banco de dados
axios.get('/dadosbanco')
  .then(function (response) {
    // Obter os dados da resposta da requisição
    console.log(response);
    var data = response.data[0];
    console.log(data.Teste1);
    // Atualizar as labels e os dados do gráfico com os dados obtidos do banco de dados
    myChart.data.labels = data.teste2 + ";"
    myChart.data.datasets[0].data = data.Teste1 + ";"
    // myChart.data.labels = data;
    // myChart.data.datasets[0].data = data.map(function (d) { return d.value; });
    // Atualizar o gráfico
    myChart.update();
  })
  .catch(function (error) {
    console.log("Algo ocorreu: " + error);
  });


