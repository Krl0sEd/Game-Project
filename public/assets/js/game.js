// =================================================
// CONFIGURAÇÃO DAS MISSÕES E PONTUAÇÃO
// =================================================
const missoes = [
    { 
        id: 0, 
        texto: '01) Abra o "Meu Computador"', 
        acaoNecessaria: 'abrir_pc' 
    },
    { 
        id: 1, 
        texto: '02) Acesse a pasta "Ferramentas"', 
        acaoNecessaria: 'abrir_pasta_ferramentas' 
    },
    { 
        id: 2, 
        texto: '03) Tente rodar o "Doom.exe"', 
        acaoNecessaria: 'abrir_doom' 
    }
    // Removi a missão de "Parabéns" da lista, pois vamos redirecionar antes
];

let missaoAtual = 0; 
let pontuacaoTotal = 0;
let tempoInicioMissao = Date.now(); // Marca a hora que o jogo começou

// =================================================
// FUNÇÃO DE CÁLCULO DE PONTOS (A Lógica Time Attack)
// =================================================
function calcularPontosDaRodada() {
    const tempoFinal = Date.now();
    const tempoGastoSegundos = (tempoFinal - tempoInicioMissao) / 1000; // Converte ms para segundos
    
    // FÓRMULA: Cada missão vale 1000 pontos.
    // O jogador perde 20 pontos por cada segundo que demorar.
    // Mínimo de 50 pontos para não frustrar quem é lento.
    let pontosGanhos = 1000 - (tempoGastoSegundos * 20);
    
    if (pontosGanhos < 50) pontosGanhos = 50; // Piso mínimo
    
    // Arredonda para não ficar número quebrado
    pontosGanhos = Math.floor(pontosGanhos);

    console.log(`Levou ${tempoGastoSegundos.toFixed(2)}s. Ganhou: ${pontosGanhos} pts.`);
    return pontosGanhos;
}

// =================================================
// ATUALIZAÇÃO DE TELA (Missão e Score)
// =================================================
function atualizarHUD() {
    const elementoTexto = document.getElementById("mission-text");
    const elementoScore = document.getElementById("score-val");
    const caixaMissao = document.getElementById("mission-box");
    
    // Atualiza o Score na tela
    if(elementoScore) elementoScore.innerText = pontuacaoTotal;

    // Efeito visual de acerto
    if(caixaMissao) {
        caixaMissao.style.backgroundColor = "#00aa00"; 
        setTimeout(() => { caixaMissao.style.backgroundColor = ""; }, 300);
    }

    // Atualiza Texto da Missão
    if (elementoTexto && missaoAtual < missoes.length) {
        elementoTexto.innerText = missoes[missaoAtual].texto;
        elementoTexto.style.color = "#00ff00";
    }
}

// =================================================
// CHECAGEM DE MISSÃO (O Coração do Jogo)
// =================================================
function checarMissao(acaoDoJogador) {
    // Se já acabou as missões, ignora
    if (missaoAtual >= missoes.length) return;

    // Verifica se acertou
    if (acaoDoJogador === missoes[missaoAtual].acaoNecessaria) {
        
        // 1. CALCULA E SOMA PONTOS
        const pontos = calcularPontosDaRodada();
        pontuacaoTotal += pontos;
        
        // 2. RESETA O RELÓGIO PARA A PRÓXIMA MISSÃO
        tempoInicioMissao = Date.now();

        // 3. AVANÇA MISSÃO
        missaoAtual++; 

        // 4. VERIFICA FIM DE JOGO
        if (missaoAtual >= missoes.length) {
            finalizarJogo();
        } else {
            atualizarHUD();
        }
    }
}

// =================================================
// FIM DE JOGO E REDIRECIONAMENTO
// =================================================
function finalizarJogo() {
    alert(`PARABÉNS! Jogo Hackeado.\nSua Pontuação Final: ${pontuacaoTotal}`);

    // 1. Recupera o nome do jogador
    const nomeJogador = localStorage.getItem('playerName') || "Anonimo";

    // 2. Cria o objeto do recorde atual
    const novoRecorde = {
        nome: nomeJogador,
        pontos: pontuacaoTotal,
        data: new Date().toLocaleDateString()
    };

    // 3. Recupera o Leaderboard antigo (ou cria um array vazio se não existir)
    let leaderboard = JSON.parse(localStorage.getItem('gameLeaderboard')) || [];

    // 4. Adiciona o novo recorde e Salva de volta
    leaderboard.push(novoRecorde);
    
    // (Opcional: Ordenar do maior para o menor antes de salvar)
    leaderboard.sort((a, b) => b.pontos - a.pontos);

    localStorage.setItem('gameLeaderboard', JSON.stringify(leaderboard));

    // 5. REDIRECIONA PARA A TELA DE RANKING
    window.location.href = "leaderboard.html";
}


// =================================================
// INICIALIZAÇÃO (Window OnLoad)
// =================================================
window.onload = function() {
    
    // Garante que o relógio comece AGORA
    tempoInicioMissao = Date.now();

    // -- RECUPERAR NOME --
    const nomeSalvo = localStorage.getItem('playerName');
    const tituloJanela = document.querySelector('.title-bar span');
    if (nomeSalvo && tituloJanela) {
        tituloJanela.innerText = `Program Manager - ${nomeSalvo}`;
    }

    // -- SISTEMA DE MÚSICA --
    const audio = document.getElementById('musica-fundo');
    if (audio) {
        audio.volume = 0.1; 
        audio.play().catch(() => {
            document.body.addEventListener('click', () => audio.play(), { once: true });
        });
    }

    // -- ARRASTAR JANELA (Drag logic) --
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

    // -- MENU INICIAR --
    const btnMenu = document.querySelector('.start-btn');
    const menuIniciar = document.getElementById('start-menu');

    btnMenu.addEventListener('click', (e) => {
        e.stopPropagation();
        menuIniciar.classList.toggle('aberto');
        btnMenu.style.borderStyle = menuIniciar.classList.contains('aberto') ? "inset" : "outset";
        btnMenu.style.backgroundColor = menuIniciar.classList.contains('aberto') ? "#ddd" : "";
    });

    document.addEventListener('click', (e) => {
        if (!menuIniciar.contains(e.target) && menuIniciar.classList.contains('aberto')) {
            menuIniciar.classList.remove('aberto');
            btnMenu.style.borderStyle = "outset";
            btnMenu.style.backgroundColor = "";
        }
    });

    // -- RELÓGIO --
    function atualizarRelogio() {
        const agora = new Date();
        const divRelogio = document.querySelector('.clock');
        if(divRelogio) divRelogio.innerText = agora.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }
    setInterval(atualizarRelogio, 1000);
    atualizarRelogio();

    // =================================================
    // FUNÇÕES GLOBAIS (Ações do Jogo)
    // =================================================
    
    window.minimizarJanela = function() {
        const sfx = document.getElementById('som-minimizar');
        if (sfx) sfx.play().catch(e => {});
        document.getElementById('program-manager').style.display = 'none';
    }

    window.abrirJanela = function() {
        const janela = document.getElementById('program-manager');
        janela.style.display = 'flex';
        janela.style.top = '15%'; janela.style.left = '20%';
        checarMissao('abrir_pc');
    }

    window.fecharJanela = function() {
         document.getElementById('program-manager').style.display = 'none';
    }

    window.abrirPastaGames = function() {
        checarMissao('abrir_pasta_ferramentas');
        if (missaoAtual < 2) alert("Siga a ordem das missões!");
    }
    
    window.abrirDoom = function() {
        // Essa é a ultima ação. Ao chamar checarMissao aqui, 
        // ele vai ver que acabou e chamar finalizarJogo()
        checarMissao('abrir_doom'); 
    }
};