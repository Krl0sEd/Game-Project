/* --- ARQUIVO: assets/js/game.js --- */

// Espera a página carregar 100% antes de rodar o script
window.onload = function() {
    
    // =================================================
    // 1. RECUPERAR NOME DO JOGADOR (Login)
    // =================================================
    const nomeSalvo = localStorage.getItem('playerName');
    const tituloJanela = document.querySelector('.title-bar span');

    if (!nomeSalvo) {
        // Se não tiver nome, manda voltar pro login (Segurança)
        // window.location.href = "../index.html"; 
        console.log("Usuário sem nome (Modo de Teste)");
    } else {
        console.log("Jogador logado: " + nomeSalvo);
        // Atualiza o título da janela com o nome do usuário
        if (tituloJanela) {
            tituloJanela.innerText = `Program Manager - ${nomeSalvo}`;
        }
    }

    // =================================================
    // 2. SISTEMA DE MÚSICA (Audio)
    // =================================================
    const audio = document.getElementById('musica-fundo');
    if (audio) {
        audio.volume = 0.1; // 10% de volume
        
        // Tenta dar o Play
        var promessaDePlay = audio.play();

        if (promessaDePlay !== undefined) {
            promessaDePlay.catch(error => {
                console.log("Autoplay bloqueado. Aguardando clique...");
                // Liga o som no primeiro clique em qualquer lugar
                document.body.addEventListener('click', function() {
                    audio.play();
                }, { once: true });
            });
        }
    }

    // =================================================
    // 3. ARRASTAR JANELA (Drag and Drop)
    // =================================================
    const janela = document.getElementById("program-manager");
    const barraTitulo = janela.querySelector(".title-bar");
    
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;

    barraTitulo.addEventListener("mousedown", (e) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        initialLeft = janela.offsetLeft;
        initialTop = janela.offsetTop;
        // Muda o cursor para indicar movimento
        document.body.style.cursor = "move";
    });

    window.addEventListener("mousemove", (e) => {
        if (isDragging) {
            e.preventDefault(); // Evita selecionar texto
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            janela.style.left = `${initialLeft + dx}px`;
            janela.style.top = `${initialTop + dy}px`;
        }
    });

    window.addEventListener("mouseup", () => {
        isDragging = false;
        document.body.style.cursor = "default";
    });

    // =================================================
    // 4. MENU INICIAR (Lógica de Abrir/Fechar)
    // =================================================
    const btnMenu = document.querySelector('.start-btn');
    const menuIniciar = document.getElementById('start-menu');

    // Clicou no botão "Menu"
    btnMenu.addEventListener('click', function(e) {
        e.stopPropagation(); // Não deixa o clique passar pro fundo
        
        // Abre ou fecha
        menuIniciar.classList.toggle('aberto');
        
        // Efeito visual no botão (Afunda/Levanta)
        if (menuIniciar.classList.contains('aberto')) {
            btnMenu.style.borderStyle = "inset";
            btnMenu.style.backgroundColor = "#ddd";
        } else {
            btnMenu.style.borderStyle = "outset";
            btnMenu.style.backgroundColor = "";
        }
    });

    // Clicou fora do menu (para fechar)
    document.addEventListener('click', function(e) {
        if (!menuIniciar.contains(e.target) && menuIniciar.classList.contains('aberto')) {
            menuIniciar.classList.remove('aberto');
            
            // Restaura o botão
            btnMenu.style.borderStyle = "outset";
            btnMenu.style.backgroundColor = "";
        }
    });

    // Função para minimizar a janela COM SOM
    window.minimizarJanela = function() {
        const janela = document.getElementById('program-manager');
        const sfx = document.getElementById('som-minimizar');
        
        // 1. Toca o som (se o elemento de áudio existir)
        if (sfx) {
            sfx.currentTime = 0; // Reinicia o som para o começo (caso clique rápido)
            sfx.volume = 0.3;    // Volume 30% pra não estourar o ouvido
            sfx.play().catch(e => console.log("Erro ao tocar SFX:", e));
        }

        // 2. Esconde a janela
        janela.style.display = 'none';
    }

    // =================================================
    // 5. RELÓGIO (Bônus: Faz o horário andar)
    // =================================================
    function atualizarRelogio() {
        const agora = new Date();
        let horas = agora.getHours();
        let minutos = agora.getMinutes();
        const ampm = horas >= 12 ? 'PM' : 'AM';
        
        horas = horas % 12;
        horas = horas ? horas : 12; 
        minutos = minutos < 10 ? '0' + minutos : minutos;
        
        const horarioFormatado = horas + ':' + minutos + ' ' + ampm;
        const divRelogio = document.querySelector('.clock');
        if(divRelogio) divRelogio.innerText = horarioFormatado;
    }
    
    setInterval(atualizarRelogio, 1000);
    atualizarRelogio();
};

// =================================================
    // 6. LÓGICA DE JANELAS E MISSÕES
    // =================================================
    
    // Função global para abrir a janela (chamada pelo onclick do HTML)
    window.abrirJanela = function() {
        const janela = document.getElementById('program-manager');
        const missaoTexto = document.getElementById('mission-text');
        
        // 1. Abre a janela
        janela.style.display = 'flex';
        
        // 2. Centraliza ela bonitinho (Reset de posição)
        janela.style.top = '15%';
        janela.style.left = '20%';

        // 3. Atualiza a Missão (Se a missão for a número 1)
        if (missaoTexto && missaoTexto.innerText.includes("01)")) {
            // Toca um efeito visual ou sonoro aqui se quiser depois
            missaoTexto.style.color = "#00ff00"; // Pisca verde
            
            // Espera meio segundo para trocar o texto (efeito dramático)
            setTimeout(() => {
                missaoTexto.innerText = "02) Acesse a pasta 'Games'";
                missaoTexto.style.color = "#00ff00"; // Mantém verde matrix
            }, 500);
        }
    }

    // Função global para fechar a janela
    window.fecharJanela = function() {
         const janela = document.getElementById('program-manager');
         janela.style.display = 'none';
    }

    // Função para quando clicar na pasta Games
    window.abrirPastaGames = function() {
        const missaoTexto = document.getElementById('mission-text');
        
        // Verifica se o jogador está na missão certa
        if (missaoTexto && missaoTexto.innerText.includes("02)")) {
            
            // 1. Efeito visual (Pode ser um alert ou mudar a cor da pasta)
            alert("ACESSO AUTORIZADO! Iniciando Doom.exe...");
            
            // 2. Atualiza a missão para a final
            missaoTexto.style.color = "#ff00ff"; // Rosa choque
            missaoTexto.innerText = "03) Execute o arquivo DOOM.EXE";
            
            // Opcional: Aqui você poderia abrir uma segunda janela "Games"
            // Mas por enquanto, só validar a missão já dá a sensação de progresso.
        } else {
            // Se tentar abrir antes da hora
            alert("Erro: Você precisa abrir o 'My Computer' antes!");
        }
    }