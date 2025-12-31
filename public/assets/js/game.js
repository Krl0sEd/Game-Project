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

        // SALVAR O PROGRESSO AQUI ---
        salvarProgresso();

        if (missaoAtual >= missoes.length) {
            finalizarJogo();
        } else {
            atualizarHUD();
        }
    }
}

function finalizarJogo() {
    alert(`PARABÉNS! Treinamento Concluído.\nSua Pontuação Final: ${pontuacaoTotal}`);
    
    // Salva recorde
    const nome = localStorage.getItem('playerName') || "Anonimo";
    const novoRecorde = { nome: nome, pontos: pontuacaoTotal, data: new Date().toLocaleDateString() };
    
    let leaderboard = JSON.parse(localStorage.getItem('gameLeaderboard')) || [];
    leaderboard.push(novoRecorde);
    leaderboard.sort((a, b) => b.pontos - a.pontos); // Ordena do maior pro menor
    localStorage.setItem('gameLeaderboard', JSON.stringify(leaderboard));

    // Redireciona
    window.location.href = "leaderboard.html";
}

// =================================================
// 3. INICIALIZAÇÃO (Ao carregar a página)
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

    // =================================================
    // 4. FUNÇÕES GLOBAIS (Conectadas ao HTML)
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
        alert("🧮 Calculadora: 1 + 1 = 2 (Sistema funcionando!)");
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
            alert("⚠️ Termine as tarefas anteriores (Email) antes de ver a apresentação!");
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

    // --- CONTROLES DE JANELA (COM SOM AGORA!) ---
    window.fecharJanela = function() { document.getElementById('program-manager').style.display = 'none'; }
    
    // AQUI ESTÁ A CORREÇÃO DO SOM:
    window.minimizarJanela = function() { 
        document.getElementById('program-manager').style.display = 'none';
        
        // Toca o som se ele existir
        const som = document.getElementById('som-minimizar');
        if(som) som.play().catch(e => console.log("Erro som:", e));
    }

    window.fecharEmail = function() { document.getElementById('email-window').style.display = 'none'; }

    // Bônus Minecraft (BLOQUEIO)
    window.abrirAppMinecraft = function() {
        alert("✋ Opa! Foco na missão. Agora não é hora de jogar Minecraft!");
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
            alert("⚠️ Ei! Você ainda tem tarefas pendentes. Termine o dia primeiro!");
        }
    }
    
};