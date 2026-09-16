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
const receitasSalvas = localStorage.getItem("receitas");
let receitas;
const modal = document.querySelector(".fundo-modal");
const btnExcluirModal = document.getElementById("btnExcluirModal");
const btnCancelarModal = document.getElementById("btnCancelarModal");

let indiceParaExcluir = null;

if (receitasSalvas !== null) {
  receitas = JSON.parse(receitasSalvas);
} else {
  receitas = [];
}
atualizarResumoReceitas();
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
  localStorage.getItem("receitas");

  receitas.push(receita);
  salvarReceitas();
  atualizarResumoReceitas();
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
    acaoEntrada.classList.add("acao-entrada");
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
        salvarReceitas();
        atualizarResumoReceitas();
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
  salvarReceitas();
  atualizarResumoReceitas();
  renderizarReceitas();
  modal.classList.add("oculto");
  indiceParaExcluir = null;
});

atualizarResumoReceitas();
renderizarReceitas();

function salvarReceitas() {
  let salvarReceita;

  salvarReceita = JSON.stringify(receitas);
  localStorage.setItem("receitas", salvarReceita);
}

function calcularTotalReceitas() {
  let totalReceitas = 0;

  receitas.forEach(function (receita) {
    totalReceitas += receita.valor;
  });

  return totalReceitas;
}

function atualizarResumoReceitas() {
  const valorResumoReceita = document.getElementById("valorResumoReceita");
  const formatador = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  const total = formatador.format(calcularTotalReceitas());

  valorResumoReceita.textContent = total;
}

const descricaoDespesa = document.getElementById("descricaoDespesa");
const precoDespesa = document.getElementById("valorDespesa");
const formDespesas = document.getElementById("saidas");
const tabelaDespesas = document.getElementById("tabelaDespesas");
const statusDespesas = document.getElementById("statusDespesas");
const dadosDespesas = document.getElementById("dadosDespesas");
let despesas;
const despesasSalvas = localStorage.getItem("despesas");
const modalDespesa = document.querySelector(".fundo-modal-despesa");
const btnExcluirModalDespesa = document.getElementById(
  "btnExcluirModalDespesa",
);
const btnCancelarModalDespesa = document.getElementById(
  "btnCancelarModalDespesa",
);

let indiceParaExcluirDespesa = null;

if (despesasSalvas !== null) {
  despesas = JSON.parse(despesasSalvas);
} else {
  despesas = [];
}

atualizarResumoDespesas();
renderizarDespesas();

formDespesas.addEventListener("submit", (event) => {
  event.preventDefault();

  const tituloDespesa = descricaoDespesa.value;
  const valorDespesa = Number(precoDespesa.value);

  const tituloCapitalizadoDespesa = tituloDespesa
    .split(" ")
    .map(function (palavra) {
      return palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase();
    })
    .join(" ");

  let despesa = {
    titulo: tituloCapitalizadoDespesa,
    valor: valorDespesa,
    status: "Pendente",
  };

  despesas.push(despesa);
  salvarDespesas();
  atualizarResumoDespesas();
  renderizarDespesas();
  formDespesas.reset(); //limpa os campos após inserir uma despesa
});

function renderizarDespesas() {
  dadosDespesas.textContent = "";

  despesas.forEach(function (despesa, indice) {
    const saida = document.createElement("tr");
    const tituloSaida = document.createElement("td");
    const valorSaida = document.createElement("td");
    const statusSaida = document.createElement("td");
    const acaoSaida = document.createElement("td");
    const containerAcoes = document.createElement("div");
    const btnExcluirDespesa = document.createElement("button");
    const btnEditarDespesa = document.createElement("button");
    btnExcluirDespesa.classList.add("btn-excluir-despesa");
    btnEditarDespesa.classList.add("btn-editar-despesa");
    containerAcoes.classList.add("acoes");
    const formatarValorSaida = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    let edicao = false;
    tituloSaida.textContent = despesa.titulo;
    valorSaida.textContent = formatarValorSaida.format(despesa.valor);
    statusSaida.textContent = despesa.status;
    btnExcluirDespesa.textContent = "Excluir";
    btnEditarDespesa.textContent = "Editar";

    if(despesas[indice].status === "Pendente"){
      statusSaida.classList.add("status-pendente");
    }else{
      statusSaida.classList.add("status-pago");
    }

    statusSaida.addEventListener('click', () =>{
    if (despesas[indice].status === "Pendente") {
      despesas[indice].status = "Pago";
    }else{
      despesas[indice].status = "Pendente";

    }
    salvarDespesas();
    atualizarResumoDespesas();
    renderizarDespesas();
    });

    btnExcluirDespesa.addEventListener("click", () => {
      indiceParaExcluirDespesa = indice;
      modalDespesa.classList.remove("oculto");
    });

    btnEditarDespesa.addEventListener("click", () => {
      if (edicao) {
        const inputTituloAtualDespesa = tituloSaida.querySelector("input");
        const inputValorAtualDespesa = valorSaida.querySelector("input");

        despesas[indice].titulo = inputTituloAtualDespesa.value;
        despesas[indice].valor = Number(inputValorAtualDespesa.value);
        salvarDespesas();
        atualizarResumoDespesas();
        renderizarDespesas();
      } else {
        const inputTituloDespesa = document.createElement("input"); //cria o input do título
        const inputValorDespesa = document.createElement("input"); //cria o input do valor

        inputTituloDespesa.type = "text"; //define o tipo do input
        inputValorDespesa.type = "number"; //define o tipo do input

        inputTituloDespesa.value = despesa.titulo; //atribui valor ao input
        inputValorDespesa.value = despesa.valor; //atribui valor ao input

        btnEditarDespesa.textContent = "Salvar";
        edicao = true;
        tituloSaida.textContent = ""; // limpar tituloSaida
        valorSaida.textContent = ""; // limpar valorSaida

        tituloSaida.appendChild(inputTituloDespesa); // colocar inputTitulo dentro de tituloSaida
        valorSaida.appendChild(inputValorDespesa); // colocar inputValor dentro de valorSaida
      }
    });

    saida.appendChild(tituloSaida);
    saida.appendChild(valorSaida);
    saida.appendChild(statusSaida);
    saida.appendChild(acaoSaida);
    acaoSaida.appendChild(btnExcluirDespesa);
    acaoSaida.appendChild(btnEditarDespesa);
    dadosDespesas.appendChild(saida);
  });

  const textoTabelaDespesas = document.getElementById("textoTabelaDespesas");
  if (despesas.length > 0) {
    textoTabelaDespesas.classList.add("ocultar");
    tabelaDespesas.classList.remove("ocultar");
  } else {
    textoTabelaDespesas.classList.remove("ocultar");
    tabelaDespesas.classList.add("ocultar");
  }
}

btnCancelarModalDespesa.addEventListener("click", () => {
  modalDespesa.classList.add("oculto");
  indiceParaExcluirDespesa = null;
});

btnExcluirModalDespesa.addEventListener("click", () => {
  despesas.splice(indiceParaExcluirDespesa, 1);
  salvarDespesas();
  atualizarResumoDespesas();
  renderizarDespesas();
  modalDespesa.classList.add("oculto");
  indiceParaExcluirDespesa = null;
});

atualizarResumoDespesas();
renderizarDespesas();

function salvarDespesas() {
  let salvarDespesa;

  salvarDespesa = JSON.stringify(despesas);
  localStorage.setItem("despesas", salvarDespesa);
}

function calcularTotalDespesas() {
  let totalDespesas = 0;

  despesas.forEach(function (despesa) {
    totalDespesas += despesa.valor;
  });

  return totalDespesas;
}

function atualizarResumoDespesas() {
  const valorResumoDespesa = document.getElementById("valorResumoDespesa");
  const formatadorDespesas = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  const totalDespesas = formatadorDespesas.format(calcularTotalDespesas());

  valorResumoDespesa.textContent = totalDespesas;
}
