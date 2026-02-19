// AJUSTANDO ELEMENTOS DA PÁGINA
const inputArquivo = document.getElementById("arquivoCSV");
const listaTerminais = document.getElementById("listaTerminais");
const listaSeriais = document.getElementById("listaSeriais");

//BOTÃO TEMA
const botaoTema = document.getElementById("btnTema");

botaoTema.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        botaoTema.textContent = "☀️";
    } else {
        botaoTema.textContent = "🌙";
    }
});

//BOTÃO COPIAR
const btnCopiarTerminais = document.getElementById("btnCopiarTerminais");

btnCopiarTerminais.addEventListener("click", () => {
    const copiou = copiarSomenteNumeros("listaTerminais");

    if (copiou) {
        animarCopiado(btnCopiarTerminais);
    }
});

const btnCopiarSeriais = document.getElementById("btnCopiarSeriais");

btnCopiarSeriais.addEventListener("click", () => {
    const copiou = copiarSomenteNumeros("listaSeriais");

    if (copiou) {
        animarCopiado(btnCopiarSeriais);
    }
});

function copiarSomenteNumeros(id) {
    const campo = document.getElementById(id);

    const msgErro =
        id === "listaTerminais"
            ? document.getElementById("msgTerminais")
            : document.getElementById("msgSeriais");

    if (!campo.value.trim()) {
        msgErro.classList.add("ativo");

        setTimeout(() => {
            msgErro.classList.remove("ativo");
        }, 2000);

        return false;

    }
    msgErro.classList.remove("ativo");

    let textoParaCopiar;

    if (id === "listaterminais") {
        textoParaCopiar = campo.value.replace(/[^0-9, ]/g, "");
    } else {
        textoParaCopiar = campo.value.replace(/[^a-zA-Z0-9, -]/g, "");
    }

    navigator.clipboard.writeText(textoParaCopiar);
    return true;
}

function animarCopiado(botao) {
    botao.classList.add("copiado");

    setTimeout(() => {
        botao.classList.remove("copiado");
    }, 800);
}

// BOTÃO LIMPAR
const btnLimpar = document.getElementById("btnLimpar");

btnLimpar.addEventListener("click", () => {
    listaTerminais.value = "";
    listaSeriais.value = "";
    inputArquivo.value = "";
});

//EVENTO AO SELECIONAR ARQUIVO

inputArquivo.addEventListener("change", function () {
    const arquivo = this.files[0];
    if (!arquivo) return;

    const leitor = new FileReader();

    leitor.onload = function (evento) {
        const conteudo = evento.target.result;

        //CONVERTE QUALQUER SEPARADOR EM VIRGULA

        const linhas = conteudo
            .replace(/;/g, ",")
            .replace(/\|/g, ",")
            .split(/\r?\n/);

        linhas.shift();
        let terminais = [];
        let seriais = [];

        linhas.forEach(linha => {
            if (linha.trim() !== "") {

                const partes = linha.split(",");

                //ASSUMINDO:
                //COLUNA 2 = TERMINAL
                //COLUNA 15 - SERIAL NUMBER
                if (partes.length >= 16) {

                    terminais.push(partes[2].trim());

                    seriais.push(partes[15].trim());

                }
            }

        });


        //MOSTRA OS RESULTADOS
        listaTerminais.value = terminais.join(",");

        listaSeriais.value = seriais.join(",");

    };

    leitor.readAsText(arquivo);
});