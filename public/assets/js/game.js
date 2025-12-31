/* =================================================
   ARQUIVO: assets/js/game.js
   DESCRIÇÃO: Lógica do "Dia de Trabalho" (7 Missões)
   ================================================= */

// 1. CONFIGURAÇÃO DAS MISSÕES
// Aqui definimos a ordem exata que o jogador precisa seguir.
const missoes = [
    { 
        id: 0, 
        texto: '01) Abra o ícone "Meu Computador"', 
        acaoNecessaria: 'abrir_pc' 
    },
    { 
        id: 1, 
        texto: '02) Vá em Documentos e leia o "contrato.txt"', 
        acaoNecessaria: 'ler_contrato' 
    },
    { 
        id: 2, 
        texto: '03) Vá em Ferramentas e abra a Calculadora', 
        acaoNecessaria: 'abrir_calc' 
    },
    { 
        id: 3, 
        texto: '04) Ainda em Ferramentas, abra o Email Corp.', 
        acaoNecessaria: 'abrir_app_email' 
    },
    { 
        id: 4, 
        texto: '05) Envie o email para o Chefe', 
        acaoNecessaria: 'enviar_email_chefe' 
    },
    { 
        id: 5, 
        texto: '06) Volte para Documentos e abra o PPT "Bem-vindo"', 
        acaoNecessaria: 'abrir_ppt' 
    },
    { 
        id: 6, 
        texto: '07) Encerre o dia: Desligue pelo Menu Iniciar', 
        acaoNecessaria: 'desligar_pc' 
    }
];

// Variáveis de Estado
let missaoAtual = 0; 
let pontuacaoTotal = 0;
let tempoInicioMissao = Date.now();


// Especificações do computador

function abrirConfiguracoes() {
    // Seleciona a janela pelo ID
    const janela = document.getElementById('janela-specs');
    // Torna ela visível
    janela.style.display = 'block';
}

function fecharConfiguracoes() {
    // Esconde a janela novamente
    const janela = document.getElementById('janela-specs');
    janela.style.display = 'none';
}

// =================================================
// 2. SISTEMA DE PONTUAÇÃO (Time Attack)
// =================================================

 // FUNÇÃO PARA SALVAR NO LOCALSTORAGE
    function salvarProgresso() {
        // Pega o nome que já estava salvo (ou define como Anonimo)
        const nomeJogador = localStorage.getItem('playerName') || "Anonimo";

        // Cria o objeto com os dados atuais
        const dadosDoJogo = {
            nickname: nomeJogador,
            pontuacao: pontuacaoTotal,
            missaoIndex: missaoAtual // Salva o índice da missão (0, 1, 2...)
        };

        // Transforma em texto e salva no navegador
        localStorage.setItem('compuZone_SaveData', JSON.stringify(dadosDoJogo));
        
        console.log("Jogo salvo automaticamente:", dadosDoJogo);
    }

    // --- LEADERBOARD ---
// Essa função conecta com o meu leaderboard.html
function finalizarJogo() {
    // 1. Pergunta o nome (ou usa o que já temos)
    let nomeJogador = localStorage.getItem('playerName');
    
    if (!nomeJogador || nomeJogador === "Anonimo") {
        nomeJogador = prompt("FIM DE EXPEDIENTE! \nDigite seu nome para o RH:") || "Estagiário Anônimo";
    } else {
        alert(`FIM DE EXPEDIENTE!\nParabéns ${nomeJogador}, sua pontuação foi: ${pontuacaoTotal}`);
    }

    // 2. Cria o objeto do Ranking (igual ao leaderboard.js)
    const novoRegistro = {
        nome: nomeJogador,
        pontos: pontuacaoTotal,
        data: new Date().toLocaleDateString('pt-BR')
    };

    // 3. Pega o histórico antigo
    const CHAVE_SAVE = 'officeSimRanking'; // Tem que ser igual ao leaderboard.js
    let historico = JSON.parse(localStorage.getItem(CHAVE_SAVE)) || [];

    // 4. Adiciona e Salva
    historico.push(novoRegistro);
    localStorage.setItem(CHAVE_SAVE, JSON.stringify(historico));

    // 5. Limpa o save temporário (já acabou o jogo)
    localStorage.removeItem('compuZone_SaveData');

    // 6. Manda para a página de Ranking
    window.location.href = "leaderboard.html"; 
}

function calcularPontosDaRodada() {
    const tempoFinal = Date.now();
    const tempoGasto = (tempoFinal - tempoInicioMissao) / 1000;
    
    // Começa valendo 1000, perde 20 pontos por segundo
    let pontos = 1000 - (tempoGasto * 20);
    if (pontos < 50) pontos = 50; // Mínimo de 50 pontos
    
    return Math.floor(pontos);
}

function atualizarHUD() {
    const elTexto = document.getElementById("mission-text");
    const elScore = document.getElementById("score-val");
    const elBox = document.getElementById("mission-box");
    
    // Atualiza Placar
    if(elScore) elScore.innerText = pontuacaoTotal;
    
    // Efeito Visual na Caixa
    if(elBox) {
        elBox.style.backgroundColor = "#00aa00"; 
        setTimeout(() => { elBox.style.backgroundColor = ""; }, 300);
    }

    // Atualiza Texto
    if (elTexto && missaoAtual < missoes.length) {
        elTexto.innerText = missoes[missaoAtual].texto;
        elTexto.style.color = "#00ff00";
    }
}

function checarMissao(acao) {
    // Se o jogo acabou, ignora
    if (missaoAtual >= missoes.length) return;

    // Se a ação for a correta para a missão atual
    if (acao === missoes[missaoAtual].acaoNecessaria) {
        
        pontuacaoTotal += calcularPontosDaRodada();
        tempoInicioMissao = Date.now(); // Reseta relógio
        missaoAtual++; 

        // SALVO O PROGRESSO AQUI ---
        salvarProgresso();

        if (missaoAtual >= missoes.length) {
            finalizarJogo();
        } else {
            atualizarHUD();
        }
    }
}

// =================================================
    // 3. FUNÇÕES GLOBAIS (Conectadas ao HTML)
    // =================================================
    
    // -- Lógica de Telas (Views) --
    function mostrarTela(idTela) {
        // Esconde todas
        document.getElementById('view-main').style.display = 'none';
        document.getElementById('view-docs').style.display = 'none';
        document.getElementById('view-tools').style.display = 'none';
        // Mostra a escolhida
        document.getElementById(idTela).style.display = 'flex';
    }

    // ABRIR O COMPUTADOR (Início)
    window.abrirJanela = function() {
        const janela = document.getElementById('program-manager');
        janela.style.display = 'flex';
        // Reseta posição e tela
        janela.style.top = '15%'; janela.style.left = '20%';
        mostrarTela('view-main');
        
        checarMissao('abrir_pc');
    }

    // NAVEGAÇÃO ENTRE PASTAS
    window.abrirPastaDocumentos = function() {
        mostrarTela('view-docs');
    }

    window.abrirPastaFerramentas = function() {
        mostrarTela('view-tools');
    }

    window.voltarParaMain = function() {
        mostrarTela('view-main');
    }

    // AÇÕES DE ARQUIVOS (Missões)
    
    window.abrirArquivoTexto = function() {
        alert("📄 CONTRATO DE TRABALHO\n\nCláusula 1: O funcionário deve aprender a usar o mouse.\nCláusula 2: Proibido jogar Minecraft no expediente.\n\nAssinado: A Gerência.");
        checarMissao('ler_contrato');
    }

    window.abrirCalculadora = function() {
        alert("🧮 Calculadora: 1 + 1 = 11 (Sistema funcionando!)");
        checarMissao('abrir_calc');
    }

    window.abrirAppEmail = function() {
        document.getElementById('email-window').style.display = 'flex';
        checarMissao('abrir_app_email');
    }

    window.enviarEmailReal = function() {
        alert("✅ E-mail enviado com sucesso para chefe@empresa.com!");
        document.getElementById('email-window').style.display = 'none';
        checarMissao('enviar_email_chefe');
    }

    window.abrirApresentacao = function() {
        // Só deixa abrir o PPT se já tiver mandado o email (Missão 5 completa)
        if(missaoAtual < 5) {
            alert("⚠️ Termine as tarefas anteriores antes de ver a apresentação!");
            return;
        }
        alert("📽️ SLIDE 1: Bem-vindo à Compu-Zone!\nSLIDE 2: Aqui o futuro é retrô.");
        checarMissao('abrir_ppt');
    }

    // BOTÃO DESLIGAR (Fim)
    window.desligarReal = function() {
        checarMissao('desligar_pc');
    }

    // -- Menu Iniciar (Abrir/Fechar) --
    const btnMenu = document.querySelector('.start-btn');
    const menuIniciar = document.getElementById('start-menu');
    
    btnMenu.onclick = (e) => { 
        e.stopPropagation(); 
        menuIniciar.classList.toggle('aberto'); 
    }
    
    document.onclick = (e) => { 
        if (!menuIniciar.contains(e.target) && menuIniciar.classList.contains('aberto')) {
            menuIniciar.classList.remove('aberto'); 
        }
    }


   // --- CONTROLES DE JANELA (AGORA TODOS COM SOM!) ---
    
    // 1. Botão Fechar Janela Principal (X)
    window.fecharJanela = function() { 
        document.getElementById('program-manager').style.display = 'none'; 
        
        // Adicionado o som aqui:
        const som = document.getElementById('som-minimizar');
        if(som) som.play().catch(e => console.log("Erro som:", e));
    }
    
    // 2. Botão Minimizar (_)
    window.minimizarJanela = function() { 
        document.getElementById('program-manager').style.display = 'none';
        
        // O som já existia aqui:
        const som = document.getElementById('som-minimizar');
        if(som) som.play().catch(e => console.log("Erro som:", e));
    }

    // 3. Botão Fechar Email (X)
    window.fecharEmail = function() { 
        document.getElementById('email-window').style.display = 'none'; 
        
        // Adicionado o som aqui também:
        const som = document.getElementById('som-minimizar');
        if(som) som.play().catch(e => console.log("Erro som:", e));
    }

    // FUNÇÃO DO "SISTEMA" (O MEME) ---
    window.abrirSistemaMemes = function() {
        // Mostra a cortina preta com a imagem (muda display para flex para centralizar)
        document.getElementById('meme-overlay').style.display = 'flex';
        alert("⚙️ ACESSANDO NÚCLEO DO SISTEMA...\n\nATENÇÃO: Tecnologia de ponta detectada.");
    }

    window.fecharSistemaMemes = function() {
        // Esconde a cortina de novo
        document.getElementById('meme-overlay').style.display = 'none';
    }

    // FUNÇÃO DO CMD (Prompt) ---
    window.abrirCMD = function() {
        alert("⚠️ ACESSO AO SISTEMA\n\nEssa ferramenta é avançada e usada para manutenção.\nSe você não for um técnico, melhor não alterar nada aqui!");
    }

    window.acaoDesligar = function() {
        // 1. O alerta aparece primeiro (o código pausa aqui até dar OK)
        alert('Faz de conta que desligou...');

        // 2. Quando der OK, ele verifica se está na última missão (id 6)
        if (missaoAtual === 6) {
            // Se tiver acabado, finaliza e manda pro leaderboard
            checarMissao('desligar_pc');
        } else {
            // Se tentar sair antes da hora
            alert("⚠️ ESPERA UM POUCO! Você ainda tem tarefas pendentes. Termine o dia primeiro!");
        }
    }

    // --- MENUS DECORATIVOS ---
    window.menuIndisponivel = function() {
        alert("🚧 EM CONSTRUÇÃO!\n\nEsse menu é apenas decorativo. Nenhuma função foi implementada aqui ainda.");
    }

  // Bônus Minecraft (BLOQUEIO)
    window.abrirAppMinecraft = function() {
        alert("✋ Opa! Foco na missão. Agora não é hora de jogar Minecraft!");
    }

    // Função do Espelho (MEME)
    // --- FUNÇÃO DO ESPELHO (LIXEIRA) ---
window.abrirEspelho = function() {
    const espelho = document.getElementById('mirror-overlay');
    if(espelho) {
        espelho.style.display = 'flex';
        // Toca um som de erro se quiser (opcional)
        // const audio = new Audio('../assets/audio/erro.mp3');
        // audio.play(); 
    }
}

window.fecharEspelho = function() {
    const espelho = document.getElementById('mirror-overlay');
    if(espelho) {
        espelho.style.display = 'none';
    }
}

// --- SISTEMA DE SENHA SECRETA (System32) ---

function abrirPromptSenha() {
    const modal = document.getElementById('janela-senha');
    const input = document.getElementById('input-senha-secreta');
    const erro = document.getElementById('msg-erro');
    
    // Reseta o visual
    modal.style.display = 'block';
    input.value = ""; // Limpa o campo
    erro.style.display = 'none'; // Esconde erro anterior
    input.focus(); // Já deixa pronto pra digitar
}

function fecharPromptSenha() {
    document.getElementById('janela-senha').style.display = 'none';
}

function verificarSenhaSystem32() {
    const input = document.getElementById('input-senha-secreta');
    const erro = document.getElementById('msg-erro');
    const senhaDigitada = input.value;

    if (senhaDigitada === "meugatinho") {
        // Se acertar
        fecharPromptSenha();
        
        // Confirmação final dramática
        setTimeout(() => {
            const certeza = confirm("⚠️ PERIGO CRÍTICO ⚠️\n\nIsso vai apagar TODO o seu progresso, ranking e formatar o jogo.\n\nTem certeza?");
            
            if (certeza) {
                alert("🗑️ Deletando System32...\n🔥 Queimando memórias...\n💥 Tchau!");
                localStorage.clear();
                location.reload();
            }
        }, 200);

    } else {
        // Se errar
        erro.style.display = 'block'; // Mostra texto vermelho
        erro.innerText = "SENHA INCORRETA! O FBI ESTÁ A CAMINHO.";
        input.value = ""; // Limpa pra tentar de novo
        input.focus();
    }
}

// =================================================
// 4. INICIALIZAÇÃO (Ao carregar a página)
// =================================================
window.onload = function() {
    tempoInicioMissao = Date.now();

    // CARREGAR JOGO SALVO
    const saveAntigo = localStorage.getItem('compuZone_SaveData');
    if (saveAntigo) {
        try {
            const dados = JSON.parse(saveAntigo);
            missaoAtual = dados.missaoIndex;
            pontuacaoTotal = dados.pontuacao;
            
            // Se o jogo já tinha acabado, reseta
            if(missaoAtual >= missoes.length) missaoAtual = 0;

            console.log("Progresso recuperado com sucesso!");
            atualizarHUD(); // Atualiza o texto da missão na tela
        } catch (e) {
            console.log("Erro ao carregar save, começando do zero.");
        }
    }
    
    // Configura nome na janela
    const nomeSalvo = localStorage.getItem('playerName');
    const tituloJanela = document.querySelector('.title-bar span');
    if (nomeSalvo && tituloJanela) tituloJanela.innerText = `Explorer - ${nomeSalvo}`;
    
    // Configura Áudio
    const audio = document.getElementById('musica-fundo');
    if(audio) {
        audio.volume = 0.1;
        audio.play().catch(() => document.body.addEventListener('click', () => audio.play(), { once: true }));
    }

    // --- ARRASTAR JANELA (Drag & Drop) ---
    const janela = document.getElementById("program-manager");
    const barraTitulo = janela.querySelector(".title-bar");
    let isDragging = false, startX, startY, initialLeft, initialTop;

    barraTitulo.addEventListener("mousedown", (e) => {
        isDragging = true;
        startX = e.clientX; startY = e.clientY;
        initialLeft = janela.offsetLeft; initialTop = janela.offsetTop;
        document.body.style.cursor = "move";
    });

    window.addEventListener("mousemove", (e) => {
        if (isDragging) {
            e.preventDefault();
            const dx = e.clientX - startX; const dy = e.clientY - startY;
            janela.style.left = `${initialLeft + dx}px`;
            janela.style.top = `${initialTop + dy}px`;
        }
    });
    window.addEventListener("mouseup", () => { isDragging = false; document.body.style.cursor = "default"; });

    // --- RELÓGIO ---
    function atualizarRelogio() {
        const agora = new Date();
        const divRelogio = document.querySelector('.clock');
        if(divRelogio) divRelogio.innerText = agora.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }
    setInterval(atualizarRelogio, 1000);
    atualizarRelogio();

    const btnMenu = document.querySelector('.start-btn');
    const menuIniciar = document.getElementById('start-menu');
    
    if(btnMenu && menuIniciar) {
        // Ao clicar no botão Menu
        btnMenu.onclick = (e) => { 
            e.stopPropagation(); 
            menuIniciar.classList.toggle('aberto'); 
        }
        
        // Ao clicar fora para fechar
        document.onclick = (e) => { 
            if (!menuIniciar.contains(e.target) && menuIniciar.classList.contains('aberto')) {
                menuIniciar.classList.remove('aberto'); 
            }
        }
    }

    // Atalho para apertar ENTER na senha SECRETA
    const inputSenha = document.getElementById('input-senha-secreta');
    if(inputSenha) {
        inputSenha.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                event.preventDefault();
                verificarSenhaSystem32();
            }
        });
    }

}; 