const mesExibido = document.getElementById("mes");
let dataSelecionada = new Date();
const nomesMeses = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

function atualizarMesExibido() {
  mesExibido.textContent =
    nomesMeses[dataSelecionada.getMonth()] +
    "/" +
    dataSelecionada.getFullYear();
}

atualizarMesExibido();

const setaMesAnterior = document.getElementById("setaMesAnterior");
const setaProximoMes = document.getElementById("setaProximoMes");

setaProximoMes.addEventListener("click", function () {
  dataSelecionada.setMonth(dataSelecionada.getMonth() + 1);
  atualizarMesExibido();
});

setaMesAnterior.addEventListener("click", function () {
  dataSelecionada.setMonth(dataSelecionada.getMonth() - 1);
  atualizarMesExibido();
});

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
    mes: dataSelecionada.getMonth(),
    ano: dataSelecionada.getFullYear()
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
  const valorReceitaResumoGeral = document.getElementById("receita");
  const formatador = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  const total = formatador.format(calcularTotalReceitas());

  valorResumoReceita.textContent = total;
  valorReceitaResumoGeral.textContent = total;
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

// atualizarResumoDespesas();
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

    if (despesas[indice].status === "Pendente") {
      statusSaida.classList.add("status-pendente");
    } else {
      statusSaida.classList.add("status-pago");
    }

    statusSaida.addEventListener("click", () => {
      if (despesas[indice].status === "Pendente") {
        despesas[indice].status = "Pago";
      } else {
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

// atualizarResumoDespesas();
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
  const valorDespesaResumoGeral = document.getElementById("despesas");
  const formatadorDespesas = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const totalDespesasTotal = calcularTotalParcelas() + calcularTotalDespesas();
  const totalDespesas = formatadorDespesas.format(totalDespesasTotal);

  valorResumoDespesa.textContent = totalDespesas;
  valorDespesaResumoGeral.textContent = totalDespesas;
}

const formParcelas = document.getElementById("parcelas");
const descricaoParcela = document.getElementById("descricaoParcela");
const parcelaAtual = document.getElementById("parcelaAtual");
const totalParcelas = document.getElementById("parcelaTotal");
const precoParcela = document.getElementById("valorParcela");
const dadosParcelas = document.getElementById("dadosParcelas");
const textoParcelas = document.getElementById("textoTabelaParcelas");
const tabelaParcelas = document.getElementById("tabelaParcelas");
let parcelas = []; //receberá a lista de parcelas
const modalParcelas = document.querySelector(".fundo-modal-parcela");
const btnExcluirModalParcela = document.getElementById(
  "btnExcluirModalParcela",
);
const btnCancelarModalParcela = document.getElementById(
  "btnCancelarModalParcela",
);

let indiceParaExcluirParcela = null;

if (localStorage.getItem("parcelas")) {
  parcelas = JSON.parse(localStorage.getItem("parcelas"));
} else {
  parcelas = [];
}

renderizarDespesas();
atualizarResumoDespesas();

formParcelas.addEventListener("submit", function (event) {
  event.preventDefault();

  const tituloParcela = descricaoParcela.value;
  const atualParcela = Number(parcelaAtual.value);
  const parcelasTotal = Number(totalParcelas.value);
  const valorParcela = Number(precoParcela.value);

  const tituloCapitalizadoParcela = tituloParcela
    .split(" ")
    .map(function (palavra) {
      return palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase();
    })
    .join(" ");

  let parcela = {
    titulo: tituloCapitalizadoParcela,
    atual: atualParcela,
    total: parcelasTotal,
    valor: valorParcela,
  };
  localStorage.getItem("parcelas");

  parcelas.push(parcela);
  salvarParcelas();
  atualizarResumoDespesas();
  renderizarParcelas();
  formParcelas.reset();
});

function renderizarParcelas() {
  dadosParcelas.textContent = "";

  parcelas.forEach(function (parcela, indice) {
    const prestacao = document.createElement("tr");
    const tituloPrestacao = document.createElement("td");
    const atualPrestacao = document.createElement("td");
    const totalPrestacao = document.createElement("td");
    const valorPrestacao = document.createElement("td");
    const acaoPrestacao = document.createElement("td");
    const containerAcoes = document.createElement("div");
    const btnExcluirPrestacao = document.createElement("button");
    const btnEditarPrestacao = document.createElement("button");
    btnExcluirPrestacao.classList.add("btn-excluir-parcelas");
    btnEditarPrestacao.classList.add("btn-editar-parcelas");
    containerAcoes.classList.add("acoes");
    const formatarValorPrestacao = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    let mudar = false;
    tituloPrestacao.textContent = parcela.titulo;
    atualPrestacao.textContent = parcela.atual;
    totalPrestacao.textContent = parcela.total;
    valorPrestacao.textContent = formatarValorPrestacao.format(parcela.valor);
    btnExcluirPrestacao.textContent = "Excluir";
    btnEditarPrestacao.textContent = "Editar";

    btnExcluirPrestacao.addEventListener("click", () => {
      indiceParaExcluirParcela = indice;
      modalParcelas.classList.remove("oculto");
    });

    btnEditarPrestacao.addEventListener("click", () => {
      if (mudar) {
        const inputTituloAtualParcela = tituloPrestacao.querySelector("input");
        const inputAtualParcela = atualPrestacao.querySelector("input");
        const inputTotalParcela = totalPrestacao.querySelector("input");
        const inputValorAtualParcela = valorPrestacao.querySelector("input");

        parcelas[indice].titulo = inputTituloAtualParcela.value;
        parcelas[indice].atual = Number(inputAtualParcela.value);
        parcelas[indice].total = Number(inputTotalParcela.value);
        parcelas[indice].valor = Number(inputValorAtualParcela.value);
        salvarParcelas();
        atualizarResumoDespesas();
        renderizarParcelas();
      } else {
        const inpTitulo = document.createElement("input"); //cria o input do título
        const inpAtual = document.createElement("input"); //cria o input da parcela atual
        const inpTotal = document.createElement("input"); //cria o input da parcela total
        const inpValor = document.createElement("input"); //cria o input do valor

        inpTitulo.type = "text";
        inpAtual.type = "number";
        inpTotal.type = "number";
        inpValor.type = "number";

        inpTitulo.value = parcela.titulo;
        inpAtual.value = parcela.atual;
        inpTotal.value = parcela.total;
        inpValor.value = parcela.valor;

        btnEditarPrestacao.textContent = "Salvar";
        mudar = true;
        tituloPrestacao.textContent = "";
        atualPrestacao.textContent = "";
        totalPrestacao.textContent = "";
        valorPrestacao.textContent = "";

        tituloPrestacao.appendChild(inpTitulo);
        atualPrestacao.appendChild(inpAtual);
        totalPrestacao.appendChild(inpTotal);
        valorPrestacao.appendChild(inpValor);
      }
    });

    containerAcoes.appendChild(btnExcluirPrestacao);
    containerAcoes.appendChild(btnEditarPrestacao);

    acaoPrestacao.appendChild(containerAcoes);

    prestacao.appendChild(tituloPrestacao);
    prestacao.appendChild(atualPrestacao);
    prestacao.appendChild(totalPrestacao);
    prestacao.appendChild(valorPrestacao);
    prestacao.appendChild(acaoPrestacao);

    dadosParcelas.appendChild(prestacao);
  });

  if (parcelas.length > 0) {
    textoParcelas.classList.add("ocultar");
    tabelaParcelas.classList.remove("ocultar");
  } else {
    textoParcelas.classList.remove("ocultar");
    tabelaParcelas.classList.add("ocultar");
  }
}

btnCancelarModalParcela.addEventListener("click", () => {
  modalParcelas.classList.add("oculto");
});

btnExcluirModalParcela.addEventListener("click", () => {
  parcelas.splice(indiceParaExcluirParcela, 1);
  salvarParcelas();
  atualizarResumoDespesas();
  renderizarParcelas();
  modalParcelas.classList.add("oculto");
  indiceParaExcluirParcela = null;
});

renderizarParcelas();

function salvarParcelas() {
  let salvarParcela;

  salvarParcela = JSON.stringify(parcelas);
  localStorage.setItem("parcelas", salvarParcela);
}

function calcularTotalParcelas() {
  let totalParcelasMes = 0;
  parcelas.forEach(function (parcela) {
    totalParcelasMes += parcela.valor;
  });
  return totalParcelasMes;
}

function calcularSaldo() {
  const saldo =
    calcularTotalReceitas() -
    (calcularTotalDespesas() + calcularTotalParcelas());
  return saldo;
}

function atualizarResumoSaldo() {
  const valorResumoSaldoGeral = document.getElementById("saldoMesAtual");
  const valorResumoSaldo = document.getElementById("valorResumoSaldo");
  const formatadorSaldo = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const saldoTotal = calcularSaldo();
  const saldoFormatado = formatadorSaldo.format(saldoTotal);
  valorResumoSaldo.textContent = saldoFormatado;
  valorResumoSaldoGeral.textContent = saldoFormatado;
}

atualizarResumoSaldo();
