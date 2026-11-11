
const CHAVE_USUARIO = "translacoUsuario";
const CHAVE_CADASTROS = "translacoCadastros";

const formulario = document.getElementById("formCadastro");
const mensagem = document.getElementById("mensagemCadastro");

formulario.addEventListener("submit", async function(evento) {
    evento.preventDefault();

    const nomeSocial = document.getElementById("nome_social").value.trim();
    const nomeCivil = document.getElementById("nome_civil").value.trim();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const senha = document.getElementById("senha").value;
    const area = document.getElementById("area_interesse").value;
    const arquivo = document.getElementById("curriculo").files[0];

    mensagem.textContent = "";
    mensagem.style.color = "#2e2e2e";

    // Verifica os campos obrigatórios
    if (!nomeSocial || !email || !senha || !area) {
        mostrarMensagem("Preencha todos os campos obrigatórios.", "red");
        return;
    }

    if (senha.length < 6) {
        mostrarMensagem("A senha deve ter pelo menos 6 caracteres.", "red");
        return;
    }

    // Verifica se o currículo é PDF
    if (arquivo) {
        if (arquivo.type !== "application/pdf") {
            mostrarMensagem("O currículo deve estar no formato PDF.", "red");
            return;
        }

        if (arquivo.size > 500 * 1024) {
            mostrarMensagem("O currículo deve ter no máximo 500 KB.", "red");
            return;
        }
    }

    try {
        // Recupera os cadastros existentes
        const cadastros = JSON.parse(
            localStorage.getItem(CHAVE_CADASTROS) || "[]"
        );

        // Verifica se o e-mail já está cadastrado
        const emailExistente = cadastros.some(
            usuario => usuario.email === email
        );

        if (emailExistente) {
            mostrarMensagem("Este e-mail já possui cadastro.", "red");
            return;
        }

        // Gera um hash da senha para o protótipo
        const dadosSenha = new TextEncoder().encode(senha);
        const resultadoHash = await crypto.subtle.digest(
            "SHA-256",
            dadosSenha
        );

        const senhaHash = Array.from(new Uint8Array(resultadoHash))
            .map(byte => byte.toString(16).padStart(2, "0"))
            .join("");

        // Cria o objeto do usuário
        const usuario = {
            nomeSocial: nomeSocial,
            nomeCivil: nomeCivil,
            email: email,
            senhaHash: senhaHash,
            area: area,
            telefone: "",
            cidade: "",
            experiencia: "",
            sobre: "",
            escolaridade: "",
            formacao: "",
            modalidade: "",
            tipoVaga: "",
            curriculo: "",
            curriculoNome: ""
        };

        // Lê o currículo, caso tenha sido enviado
        if (arquivo) {
            const leitor = new FileReader();

            leitor.onload = function() {
                usuario.curriculo = leitor.result;
                usuario.curriculoNome = arquivo.name;
                finalizarCadastro(usuario, cadastros);
            };

            leitor.onerror = function() {
                mostrarMensagem("Não foi possível carregar o currículo.", "red");
            };

            leitor.readAsDataURL(arquivo);

        } else {
            finalizarCadastro(usuario, cadastros);
        }

    } catch (erro) {
        console.error("Erro no cadastro:", erro);
        mostrarMensagem("Ocorreu um erro ao realizar o cadastro.", "red");
    }
});

// Finaliza e salva o cadastro
function finalizarCadastro(usuario, cadastros) {
    try {
        cadastros.push(usuario);

        localStorage.setItem(
            CHAVE_CADASTROS,
            JSON.stringify(cadastros)
        );

        localStorage.setItem(
            CHAVE_USUARIO,
            JSON.stringify(usuario)
        );

        mostrarMensagem("Cadastro realizado com sucesso!", "green");

        formulario.reset();

        setTimeout(function() {
            window.location.href = "perfilusuario.html";
        }, 1200);

    } catch (erro) {
        console.error("Erro ao salvar:", erro);
        mostrarMensagem(
            "Não foi possível salvar os dados. Tente novamente.",
            "red"
        );
    }
}

// Exibe mensagens na tela
function mostrarMensagem(texto, cor) {
    mensagem.textContent = texto;
    mensagem.style.color = cor;
}
