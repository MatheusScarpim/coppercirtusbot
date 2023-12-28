function toggleSidebar(x) {
    x.classList.toggle("change");
  
    var escondediv = document.querySelector('.div-tools');
    // var tamanho = document.querySelector('.content-fd');
    //let divEsquerda = document.getElementById("ferramentas-esquerda");
    //let divDireita = document.getElementById("ferramentas-direita");
  
    // define as novas larguras em porcentagem
    // let novaLarguraEsquerda = 40;
    //let novaLarguraDireita = 60;
  
    // altera as larguras das divs
    //divEsquerda.style.width = novaLarguraEsquerda + "%";
    //divDireita.style.width = novaLarguraDireita + "%";
  
  
    var sidebar = document.querySelector('.ferramentas-esquerda');
    if (sidebar.classList.contains('collapsed')) {
      sidebar.classList.remove('collapsed');
      escondediv.style.display = "block";
    } else {
      sidebar.classList.add('collapsed');
      escondediv.style.display = "none";
    }
  }
  
