
const CHAVE_USUARIO = "translacoUsuario";

let usuario = {};

try {
    usuario = JSON.parse(localStorage.getItem(CHAVE_USUARIO)) || {};
} catch (erro) {
    usuario = {};
}

const campos = [
    "nomeSocial",
    "nomeCivil",
    "email",
    "telefone",
    "cidade",
    "area",
    "experiencia",
    "sobre",
    "escolaridade",
    "formacao",
    "modalidade",
    "tipoVaga"
];

// Preenche os campos com os dados já cadastrados
function carregarPerfil() {
    campos.forEach(campo => {
        const elemento = document.getElementById(campo);

        if (elemento) {
            elemento.value = usuario[campo] || "";
        }
    });

    atualizarCabecalho();
    atualizarProgresso();

    if (usuario.curriculoNome) {
        document.getElementById("curriculoAtual").textContent =
            "Currículo anexado: " + usuario.curriculoNome;
    } else if (usuario.curriculo) {
        document.getElementById("curriculoAtual").textContent =
            "Currículo anexado.";
    }
}

// Atualiza o nome e as iniciais
function atualizarCabecalho() {
    const nome = usuario.nomeSocial || "Meu perfil";

    document.getElementById("nomeExibido").textContent = nome;
    document.getElementById("emailExibido").textContent =
        usuario.email || "Complete suas informações";

    const iniciais = nome
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map(palavra => palavra[0].toUpperCase())
        .join("");

    document.getElementById("avatar").textContent = iniciais || "TL";
}

// Calcula a porcentagem de preenchimento
function atualizarProgresso() {
    const preenchidos = campos.filter(campo => {
        return document.getElementById(campo).value.trim() !== "";
    }).length;

    const porcentagem = Math.round(
        (preenchidos / campos.length) * 100
    );

    document.getElementById("textoProgresso").textContent =
        porcentagem + "% preenchido";

    document.getElementById("barraProgresso").style.width =
        porcentagem + "%";
}

// Atualiza o progresso enquanto o usuário digita
campos.forEach(campo => {
    document.getElementById(campo).addEventListener("input", atualizarProgresso);
});

// Salva as alterações
document.getElementById("formPerfil").addEventListener("submit", function(evento) {
    evento.preventDefault();

    campos.forEach(campo => {
        usuario[campo] = document.getElementById(campo).value.trim();
    });

    const arquivo = document.getElementById("curriculo").files[0];

    if (arquivo) {
        if (arquivo.type !== "application/pdf") {
            alert("Selecione um arquivo PDF válido.");
            return;
        }

        if (arquivo.size > 500 * 1024) {
            alert("O currículo deve ter no máximo 500 KB neste protótipo.");
            return;
        }

        const leitor = new FileReader();

        leitor.onload = function() {
            usuario.curriculo = leitor.result;
            usuario.curriculoNome = arquivo.name;
            salvarPerfil();
        };

        leitor.onerror = function() {
            alert("Não foi possível ler o currículo.");
        };

        leitor.readAsDataURL(arquivo);
    } else {
        salvarPerfil();
    }
});

function salvarPerfil() {
    try {
        localStorage.setItem(CHAVE_USUARIO, JSON.stringify(usuario));
        atualizarCabecalho();
        atualizarProgresso();
        alert("Perfil atualizado com sucesso!");
    } catch (erro) {
        alert("Não foi possível salvar os dados no navegador.");
    }
}

carregarPerfil();
