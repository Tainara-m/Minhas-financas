function alternarGuia(event, idGuia) {
  event.preventDefault();

  const guias = document.querySelectorAll(".guia");
  const conteudos = document.querySelectorAll(".conteudo-guia");

  guias.forEach(function (guia) {
    guia.classList.remove("selecionada");
  });
  conteudos.forEach(function (conteudo) {
    conteudo.classList.remove("ativa");
  });
  event.currentTarget.classList.add("selecionada");
  document.getElementById(idGuia).classList.add("ativa");
}

function trocarTema() {
  const html = document.documentElement;
  const btnTema = document.getElementById("theme-toggle");
  const iconeTema = document.getElementById("theme-icon");
  const temaSalvo = localStorage.getItem("data-theme");

  if (temaSalvo !== null) {
    html.setAttribute("data-theme", temaSalvo);
    if (temaSalvo === "light") {
      iconeTema.textContent = "light_mode";
    } else {
      iconeTema.textContent = "dark_mode";
    }
  }

  btnTema.addEventListener("click", () => {
    const temaAtual = html.getAttribute("data-theme");
    if (temaAtual === "light") {
      html.setAttribute("data-theme", "dark");
      localStorage.setItem("data-theme", "dark");
      iconeTema.textContent = "dark_mode";
    } else {
      html.setAttribute("data-theme", "light");
      localStorage.setItem("data-theme", "light");
      iconeTema.textContent = "light_mode";
    }
  });
}

trocarTema();

const descricaoReceita = document.getElementById("descricaoReceita");
const precoReceita = document.getElementById("valorReceita");
const formReceitas = document.getElementById("entradas");
const tabelaEntradas = document.getElementById("tabelaEntradas");
const dadosEntradas = document.getElementById("dadosEntradas");

const modal = document.querySelector(".fundo-modal");
const btnExcluirModal = document.getElementById("btnExcluirModal");
const btnCancelarModal = document.getElementById("btnCancelarModal");

const receitas = [];
let indiceParaExcluir = null;

renderizarReceitas();

formReceitas.addEventListener("submit", (event) => {
  event.preventDefault();

  const tituloReceita = descricaoReceita.value;
  const valorReceita = Number(precoReceita.value);

  const tituloCapitalizado = tituloReceita
    .split(" ")
    .map(function (palavra) {
      return palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase();
    })
    .join(" ");

  let receita = {
    titulo: tituloCapitalizado,
    valor: valorReceita,
  };

  receitas.push(receita);
  renderizarReceitas();

  formReceitas.reset();
});

function renderizarReceitas() {
  dadosEntradas.textContent = "";

  receitas.forEach(function (receita, indice) {
    const entrada = document.createElement("tr");
    const tituloEntrada = document.createElement("td");
    const valorEntrada = document.createElement("td");
    const acaoEntrada = document.createElement("td");
    const btnExcluir = document.createElement("button");
    const btnEditar = document.createElement("button");
    btnExcluir.classList.add("btn-excluir");
    btnEditar.classList.add("btn-editar");
    const formatarValorEntrada = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    let editando = false;
    tituloEntrada.textContent = receita.titulo;
    valorEntrada.textContent = formatarValorEntrada.format(receita.valor);
    btnExcluir.textContent = "Excluir";
    btnEditar.textContent = "Editar";

    btnExcluir.addEventListener("click", () => {
      indiceParaExcluir = indice;
      modal.classList.remove("oculto");
    });

    btnEditar.addEventListener("click", () => {
      if (editando) {
        const inputTituloAtual = tituloEntrada.querySelector("input");
        const inputValorAtual = valorEntrada.querySelector("input");

        receitas[indice].titulo = inputTituloAtual.value;
        receitas[indice].valor = Number(inputValorAtual.value);
        renderizarReceitas();
      } else {
        const inputTitulo = document.createElement("input"); //cria o input do título
        const inputValor = document.createElement("input"); //cria o input do valor

        inputTitulo.type = "text"; //define o tipo do input
        inputValor.type = "number"; //define o tipo do input

        inputTitulo.value = receita.titulo; //atribui valor ao input
        inputValor.value = receita.valor; //atribui valor ao input

        btnEditar.textContent = "Salvar";
        editando = true;
        tituloEntrada.textContent = ""; // limpar tituloEntrada
        valorEntrada.textContent = ""; // limpar valorEntrada

        tituloEntrada.appendChild(inputTitulo); // colocar inputTitulo dentro de tituloEntrada
        valorEntrada.appendChild(inputValor); // colocar inputValor dentro de valorEntrada
      }
    });

    entrada.appendChild(tituloEntrada);
    entrada.appendChild(valorEntrada);
    entrada.appendChild(acaoEntrada);
    acaoEntrada.appendChild(btnExcluir);
    acaoEntrada.appendChild(btnEditar);
    dadosEntradas.appendChild(entrada);
  });

  const textoTabela = document.getElementById("textoTabela");
  if (receitas.length > 0) {
    textoTabela.classList.add("ocultar");
    tabelaEntradas.classList.remove("ocultar");
  } else {
    textoTabela.classList.remove("ocultar");
    tabelaEntradas.classList.add("ocultar");
  }
}

btnCancelarModal.addEventListener("click", () => {
  modal.classList.add("oculto");
  indiceParaExcluir = null;
});

btnExcluirModal.addEventListener("click", () => {
  receitas.splice(indiceParaExcluir, 1);
  renderizarReceitas();
  modal.classList.add("oculto");
  indiceParaExcluir = null;
});
