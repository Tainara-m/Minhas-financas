const mesExibido = document.getElementById("mes");
const hojeInicial = new Date();

let dataSelecionada = new Date(
  hojeInicial.getFullYear(),
  hojeInicial.getMonth(),
  1,
);

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
  controlarFormulariosPorMes();

  renderizarReceitas();
  renderizarDespesas();

  atualizarResumoReceitas();
  atualizarResumoDespesas();
  atualizarResumoSaldo();
  atualizarResumoAPagar();
  atualizarComposicaoDespesas();
});

setaMesAnterior.addEventListener("click", function () {
  dataSelecionada.setMonth(dataSelecionada.getMonth() - 1);

  atualizarMesExibido();
  controlarFormulariosPorMes();

  renderizarReceitas();
  renderizarDespesas();

  atualizarResumoReceitas();
  atualizarResumoDespesas();
  atualizarResumoSaldo();
  atualizarResumoAPagar();
  atualizarComposicaoDespesas();
});

// ==================== TEMA ====================

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

// ==================== GUIAS ====================

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

// ==================== CONTROLE DOS FORMULÁRIOS ====================

function controlarFormulariosPorMes() {
  const hoje = new Date();

  const mesAtual = hoje.getFullYear() * 12 + hoje.getMonth();

  const mesSelecionado =
    dataSelecionada.getFullYear() * 12 + dataSelecionada.getMonth();

  const ehMesAnterior = mesSelecionado < mesAtual;

  const formularios = [formReceitas, formDespesas, formParcelas];

  formularios.forEach(function (formulario) {
    const campos = formulario.querySelectorAll("input, button");

    campos.forEach(function (campo) {
      campo.disabled = ehMesAnterior;
    });
  });
}

// ==================== CARREGAR PARCELAS ====================

let parcelas = [];

if (localStorage.getItem("parcelas")) {
  parcelas = JSON.parse(localStorage.getItem("parcelas"));
} else {
  parcelas = [];
}

// ==================== RECEITAS ====================

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

// ==================== ADICIONAR RECEITA ====================

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

    ano: dataSelecionada.getFullYear(),
  };

  receitas.push(receita);

  salvarReceitas();

  atualizarResumoReceitas();
  atualizarResumoSaldo();

  renderizarReceitas();

  formReceitas.reset();
});

// ==================== RENDERIZAR RECEITAS ====================

function renderizarReceitas() {
  dadosEntradas.textContent = "";

  receitas.forEach(function (receita, indice) {
    if (
      receita.mes === dataSelecionada.getMonth() &&
      receita.ano === dataSelecionada.getFullYear()
    ) {
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

      // EXCLUIR

      btnExcluir.addEventListener("click", () => {
        indiceParaExcluir = indice;

        modal.classList.remove("oculto");
      });

      // EDITAR

      btnEditar.addEventListener("click", () => {
        if (editando) {
          const inputTituloAtual = tituloEntrada.querySelector("input");

          const inputValorAtual = valorEntrada.querySelector("input");

          receitas[indice].titulo = inputTituloAtual.value;

          receitas[indice].valor = Number(inputValorAtual.value);

          salvarReceitas();

          atualizarResumoReceitas();
          atualizarResumoSaldo();

          renderizarReceitas();
        } else {
          const inputTitulo = document.createElement("input");

          const inputValor = document.createElement("input");

          inputTitulo.type = "text";

          inputValor.type = "number";

          inputTitulo.value = receita.titulo;

          inputValor.value = receita.valor;

          btnEditar.textContent = "Salvar";

          editando = true;

          tituloEntrada.textContent = "";

          valorEntrada.textContent = "";

          tituloEntrada.appendChild(inputTitulo);

          valorEntrada.appendChild(inputValor);
        }
      });

      entrada.appendChild(tituloEntrada);

      entrada.appendChild(valorEntrada);

      entrada.appendChild(acaoEntrada);

      acaoEntrada.appendChild(btnExcluir);

      acaoEntrada.appendChild(btnEditar);

      dadosEntradas.appendChild(entrada);
    }
  });

  const textoTabela = document.getElementById("textoTabela");

  const receitasDoMes = receitas.filter(function (receita) {
    return (
      receita.mes === dataSelecionada.getMonth() &&
      receita.ano === dataSelecionada.getFullYear()
    );
  });

  if (receitasDoMes.length > 0) {
    textoTabela.classList.add("ocultar");

    tabelaEntradas.classList.remove("ocultar");
  } else {
    textoTabela.classList.remove("ocultar");

    tabelaEntradas.classList.add("ocultar");
  }
}

// ==================== MODAL RECEITA ====================

btnCancelarModal.addEventListener("click", () => {
  modal.classList.add("oculto");

  indiceParaExcluir = null;
});

btnExcluirModal.addEventListener("click", () => {
  receitas.splice(indiceParaExcluir, 1);

  salvarReceitas();

  atualizarResumoReceitas();
  atualizarResumoSaldo();

  renderizarReceitas();

  modal.classList.add("oculto");

  indiceParaExcluir = null;
});

// ==================== SALVAR RECEITAS ====================

function salvarReceitas() {
  let salvarReceita;

  salvarReceita = JSON.stringify(receitas);

  localStorage.setItem("receitas", salvarReceita);
}

// ==================== TOTAL RECEITAS ====================

function calcularTotalReceitas() {
  let totalReceitas = 0;

  receitas.forEach(function (receita) {
    if (
      receita.mes === dataSelecionada.getMonth() &&
      receita.ano === dataSelecionada.getFullYear()
    ) {
      totalReceitas += receita.valor;
    }
  });

  return totalReceitas;
}

// ==================== RESUMO RECEITAS ====================

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

// ==================== DESPESAS ====================

const descricaoDespesa = document.getElementById("descricaoDespesa");

const precoDespesa = document.getElementById("valorDespesa");

const formDespesas = document.getElementById("saidas");

const tabelaDespesas = document.getElementById("tabelaDespesas");

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

renderizarDespesas();

// ==================== ADICIONAR DESPESA ====================

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

    mes: dataSelecionada.getMonth(),

    ano: dataSelecionada.getFullYear(),
  };

  despesas.push(despesa);

  salvarDespesas();

  atualizarResumoDespesas();
  atualizarResumoSaldo();
  atualizarResumoAPagar();
  atualizarComposicaoDespesas();

  renderizarDespesas();

  formDespesas.reset();
});

// ==================== RENDERIZAR DESPESAS ====================

function renderizarDespesas() {
  dadosDespesas.textContent = "";

  // ---------- DESPESAS NORMAIS ----------

  despesas.forEach(function (despesa, indice) {
    if (
      despesa.mes === dataSelecionada.getMonth() &&
      despesa.ano === dataSelecionada.getFullYear()
    ) {
      const saida = document.createElement("tr");

      const tituloSaida = document.createElement("td");

      const valorSaida = document.createElement("td");

      const statusSaida = document.createElement("td");

      const acaoSaida = document.createElement("td");

      const btnExcluirDespesa = document.createElement("button");

      const btnEditarDespesa = document.createElement("button");

      btnExcluirDespesa.classList.add("btn-excluir-despesa");

      btnEditarDespesa.classList.add("btn-editar-despesa");

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

      // STATUS

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
        atualizarResumoSaldo();
        atualizarResumoAPagar();

        renderizarDespesas();
      });

      // EXCLUIR

      btnExcluirDespesa.addEventListener("click", () => {
        indiceParaExcluirDespesa = indice;

        modalDespesa.classList.remove("oculto");
      });

      // EDITAR

      btnEditarDespesa.addEventListener("click", () => {
        if (edicao) {
          const inputTituloAtualDespesa = tituloSaida.querySelector("input");

          const inputValorAtualDespesa = valorSaida.querySelector("input");

          despesas[indice].titulo = inputTituloAtualDespesa.value;

          despesas[indice].valor = Number(inputValorAtualDespesa.value);

          salvarDespesas();

          atualizarResumoDespesas();
          atualizarResumoSaldo();
          atualizarResumoAPagar();
          atualizarComposicaoDespesas();

          renderizarDespesas();
        } else {
          const inputTituloDespesa = document.createElement("input");

          const inputValorDespesa = document.createElement("input");

          inputTituloDespesa.type = "text";

          inputValorDespesa.type = "number";

          inputTituloDespesa.value = despesa.titulo;

          inputValorDespesa.value = despesa.valor;

          btnEditarDespesa.textContent = "Salvar";

          edicao = true;

          tituloSaida.textContent = "";

          valorSaida.textContent = "";

          tituloSaida.appendChild(inputTituloDespesa);

          valorSaida.appendChild(inputValorDespesa);
        }
      });

      saida.appendChild(tituloSaida);

      saida.appendChild(valorSaida);

      saida.appendChild(statusSaida);

      saida.appendChild(acaoSaida);

      acaoSaida.appendChild(btnExcluirDespesa);

      acaoSaida.appendChild(btnEditarDespesa);

      dadosDespesas.appendChild(saida);
    }
  });

  // ---------- PARCELAS NAS DESPESAS ----------

  parcelas.forEach(function (parcela) {
    const diferencaMeses = calcularDiferencaMeses(parcela);

    const numeroParcela = parcela.atual + diferencaMeses;

    if (numeroParcela >= 1 && numeroParcela <= parcela.total) {
      const parcelaElement = document.createElement("tr");

      const tituloParcela = document.createElement("td");

      const valorParcela = document.createElement("td");

      const statusParcela = document.createElement("td");

      const acaoParcela = document.createElement("td");

      const btnExcluirParcela = document.createElement("button");

      const btnEditarParcela = document.createElement("button");

      btnExcluirParcela.classList.add("btn-excluir-despesa");

      btnEditarParcela.classList.add("btn-editar-despesa");

      const formatarValorSaida = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      });

      tituloParcela.textContent =
        parcela.titulo + " - Parcela " + numeroParcela + "/" + parcela.total;

      valorParcela.textContent = formatarValorSaida.format(parcela.valor);

      btnExcluirParcela.textContent = "Excluir";

      btnEditarParcela.textContent = "Editar";

      // STATUS RETROATIVO

      if (diferencaMeses < 0) {
        statusParcela.textContent = "Pago";

        statusParcela.classList.add("status-pago");
      } else {
        if (parcela.statusParcelas[numeroParcela] === "Pago") {
          statusParcela.textContent = "Pago";

          statusParcela.classList.add("status-pago");
        } else {
          statusParcela.textContent = "Pendente";

          statusParcela.classList.add("status-pendente");
        }
      }

      // STATUS MANUAL DAS PARCELAS

      if (diferencaMeses >= 0) {
        statusParcela.addEventListener("click", () => {
          if (parcela.statusParcelas[numeroParcela] === "Pago") {
            delete parcela.statusParcelas[numeroParcela];
          } else {
            parcela.statusParcelas[numeroParcela] = "Pago";
          }

          salvarParcelas();

          atualizarResumoAPagar();

          renderizarDespesas();
        });
      }

      parcelaElement.appendChild(tituloParcela);

      parcelaElement.appendChild(valorParcela);

      parcelaElement.appendChild(statusParcela);

      parcelaElement.appendChild(acaoParcela);

      acaoParcela.appendChild(btnExcluirParcela);

      acaoParcela.appendChild(btnEditarParcela);

      dadosDespesas.appendChild(parcelaElement);
    }
  });

  // ---------- TABELA VAZIA ----------

  const textoTabelaDespesas = document.getElementById("textoTabelaDespesas");

  const despesasDoMes = despesas.filter(function (despesa) {
    return (
      despesa.mes === dataSelecionada.getMonth() &&
      despesa.ano === dataSelecionada.getFullYear()
    );
  });

  const temParcelasNoMes = parcelas.some(function (parcela) {
    const diferencaMeses = calcularDiferencaMeses(parcela);

    const numeroParcela = parcela.atual + diferencaMeses;

    return numeroParcela >= 1 && numeroParcela <= parcela.total;
  });

  if (despesasDoMes.length > 0 || temParcelasNoMes) {
    textoTabelaDespesas.classList.add("ocultar");

    tabelaDespesas.classList.remove("ocultar");
  } else {
    textoTabelaDespesas.classList.remove("ocultar");

    tabelaDespesas.classList.add("ocultar");
  }
}

// ==================== MODAL DESPESA ====================

btnCancelarModalDespesa.addEventListener("click", () => {
  modalDespesa.classList.add("oculto");

  indiceParaExcluirDespesa = null;
});

btnExcluirModalDespesa.addEventListener("click", () => {
  despesas.splice(indiceParaExcluirDespesa, 1);

  salvarDespesas();

  atualizarResumoDespesas();
  atualizarResumoSaldo();
  atualizarResumoAPagar();
  atualizarComposicaoDespesas();

  renderizarDespesas();

  modalDespesa.classList.add("oculto");

  indiceParaExcluirDespesa = null;
});

// ==================== SALVAR DESPESAS ====================

function salvarDespesas() {
  let salvarDespesa;

  salvarDespesa = JSON.stringify(despesas);

  localStorage.setItem("despesas", salvarDespesa);
}

// ==================== TOTAL DESPESAS ====================

function calcularTotalDespesas() {
  let totalDespesas = 0;

  despesas.forEach(function (despesa) {
    if (
      despesa.mes === dataSelecionada.getMonth() &&
      despesa.ano === dataSelecionada.getFullYear()
    ) {
      totalDespesas += despesa.valor;
    }
  });

  return totalDespesas;
}

// ==================== RESUMO DESPESAS ====================

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

// ==================== PARCELAS ====================

const formParcelas = document.getElementById("parcelas");

const descricaoParcela = document.getElementById("descricaoParcela");

const parcelaAtual = document.getElementById("parcelaAtual");

const totalParcelas = document.getElementById("parcelaTotal");

const precoParcela = document.getElementById("valorParcela");

const dadosParcelas = document.getElementById("dadosParcelas");

const textoParcelas = document.getElementById("textoTabelaParcelas");

const tabelaParcelas = document.getElementById("tabelaParcelas");

const modalParcelas = document.querySelector(".fundo-modal-parcela");

const btnExcluirModalParcela = document.getElementById(
  "btnExcluirModalParcela",
);

const btnCancelarModalParcela = document.getElementById(
  "btnCancelarModalParcela",
);

let indiceParaExcluirParcela = null;

// ==================== ADICIONAR PARCELA ====================

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

    mes: dataSelecionada.getMonth(),

    ano: dataSelecionada.getFullYear(),

    statusParcelas: {},
  };

  parcelas.push(parcela);

  salvarParcelas();

  atualizarResumoDespesas();
  atualizarResumoSaldo();
  atualizarResumoAPagar();
  atualizarComposicaoDespesas();

  renderizarDespesas();
  renderizarParcelas();

  formParcelas.reset();
});

// ==================== DIFERENÇA DE MESES ====================

function calcularDiferencaMeses(parcela) {
  const mesInicial = parcela.ano * 12 + parcela.mes;

  const mesSelecionado =
    dataSelecionada.getFullYear() * 12 + dataSelecionada.getMonth();

  return mesSelecionado - mesInicial;
}

// ==================== RENDERIZAR PARCELAS ====================

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

    // EXCLUIR

    btnExcluirPrestacao.addEventListener("click", () => {
      indiceParaExcluirParcela = indice;

      modalParcelas.classList.remove("oculto");
    });

    // EDITAR

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
        atualizarResumoSaldo();
        atualizarResumoAPagar();
        atualizarComposicaoDespesas();

        /*
         * IMPORTANTE:
         * a parcela também aparece na
         * tabela de despesas.
         *
         * Portanto as DUAS tabelas
         * precisam ser renderizadas.
         */

        renderizarDespesas();
        renderizarParcelas();
      } else {
        const inpTitulo = document.createElement("input");

        const inpAtual = document.createElement("input");

        const inpTotal = document.createElement("input");

        const inpValor = document.createElement("input");

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

  // ---------- ESTADO VAZIO ----------

  if (parcelas.length > 0) {
    textoParcelas.classList.add("ocultar");

    tabelaParcelas.classList.remove("ocultar");
  } else {
    textoParcelas.classList.remove("ocultar");

    tabelaParcelas.classList.add("ocultar");
  }
}

// ==================== MODAL PARCELAS ====================

btnCancelarModalParcela.addEventListener("click", () => {
  modalParcelas.classList.add("oculto");

  indiceParaExcluirParcela = null;
});

btnExcluirModalParcela.addEventListener("click", () => {
  parcelas.splice(indiceParaExcluirParcela, 1);

  salvarParcelas();

  atualizarResumoDespesas();
  atualizarResumoSaldo();
  atualizarResumoAPagar();
  atualizarComposicaoDespesas();

  /*
   * A parcela também aparece
   * na tabela de despesas.
   */

  renderizarDespesas();
  renderizarParcelas();

  modalParcelas.classList.add("oculto");

  indiceParaExcluirParcela = null;
});

// ==================== SALVAR PARCELAS ====================

function salvarParcelas() {
  let salvarParcela;

  salvarParcela = JSON.stringify(parcelas);

  localStorage.setItem("parcelas", salvarParcela);
}

// ==================== TOTAL PARCELAS DO MÊS ====================

function calcularTotalParcelas() {
  let totalParcelasMes = 0;

  parcelas.forEach(function (parcela) {
    const diferencaMeses = calcularDiferencaMeses(parcela);

    const numeroParcela = parcela.atual + diferencaMeses;

    if (numeroParcela >= 1 && numeroParcela <= parcela.total) {
      totalParcelasMes += parcela.valor;
    }
  });

  return totalParcelasMes;
}

// ==================== SALDO ====================

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

// ==================== A PAGAR ====================

function calcularTotalAPagar() {
  let totalAPagar = 0;

  // DESPESAS NORMAIS PENDENTES

  despesas.forEach(function (despesa) {
    if (
      despesa.mes === dataSelecionada.getMonth() &&
      despesa.ano === dataSelecionada.getFullYear() &&
      despesa.status === "Pendente"
    ) {
      totalAPagar += despesa.valor;
    }
  });

  // PARCELAS PENDENTES

  parcelas.forEach(function (parcela) {
    const diferencaMeses = calcularDiferencaMeses(parcela);

    const numeroParcela = parcela.atual + diferencaMeses;

    if (
      numeroParcela >= 1 &&
      numeroParcela <= parcela.total &&
      diferencaMeses >= 0 &&
      parcela.statusParcelas[numeroParcela] !== "Pago"
    ) {
      totalAPagar += parcela.valor;
    }
  });

  return totalAPagar;
}

// ==================== RESUMO A PAGAR ====================

function atualizarResumoAPagar() {
  const valorResumoAPagar = document.getElementById("aPagar");

  const valorAPagarResumoGeral = document.getElementById("valorResumoAPagar");

  const formatador = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const totalDevido = formatador.format(calcularTotalAPagar());

  valorResumoAPagar.textContent = totalDevido;

  valorAPagarResumoGeral.textContent = totalDevido;
}

// ==================== COMPOSIÇÃO DAS DESPESAS ====================

function atualizarComposicaoDespesas() {
  const valorCadastradas = document.getElementById("valorCadastradas");

  const valorParcelas = document.getElementById("valorParcelas");

  const formatador = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const totalD = formatador.format(calcularTotalDespesas());

  const totalP = formatador.format(calcularTotalParcelas());

  valorCadastradas.textContent = totalD;

  valorParcelas.textContent = totalP;
}

// ==================== INICIALIZAÇÃO FINAL ====================

controlarFormulariosPorMes();

renderizarReceitas();
renderizarDespesas();
renderizarParcelas();

atualizarResumoReceitas();
atualizarResumoDespesas();
atualizarResumoSaldo();
atualizarResumoAPagar();
atualizarComposicaoDespesas();
