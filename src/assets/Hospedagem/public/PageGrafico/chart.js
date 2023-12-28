if (typeof window !== 'undefined') {
  window.onload = function () {
    // Fazer uma requisição HTTP para obter os dados do banco de dados
    axios.get('/dadosbanco')
      .then(function (response) {
        // Obter os dados da resposta da requisição
        console.log(response);
        var data = response.data[0];
        console.log(data);

        // Obter a referência ao elemento canvas do gráfico
        var ctx = document.getElementById("myChart");
        var backgroundColors = ['rgba(255, 99, 132, 0.8)', 'rgba(54, 162, 235, 0.8)', 'rgba(255, 206, 86, 0.8)', 'rgba(75, 192, 192, 0.8)', 'rgba(153, 102, 255, 0.8)', 'rgba(255, 159, 64, 0.8)'];

        // Criar uma instância do gráfico
        var myChart = new Chart(ctx, {
          type: 'pie',
          data: {
            labels: ["Protocolos", "Solicitação de Emprestimo"],
            datasets: [{
              label: 'Quantidade de Clientes',
              data: [data.Protocolos, data.SolicEmpr],
              backgroundColor: backgroundColors,
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

      })
      .catch(function (error) {
        console.log("Algo ocorreu: " + error);
      });
  }
}
