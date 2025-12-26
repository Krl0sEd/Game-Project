function entrar() {
    // Pega o valor que o usuário digitou no input
    const inputNome = document.getElementById('nickname');
    const nomeDoJogador = inputNome.value;

    // Validação simples: Se estiver vazio, dá um alerta
    if (nomeDoJogador.trim() === "") {
        alert("Ei! Você precisa de um crachá (nome) para entrar na empresa!");
        return; // Para a função aqui
    }

    // Salva o nome no localStorage para usar depois no jogo
    localStorage.setItem('playerName', nomeDoJogador);

    // 4. Redireciona para a tela do jogo (a área de trabalho retrô)
    // OBS: Verifique se o nome do seu arquivo principal é 'game.html' ou 'desktop.html'
    window.location.href = "game.html"; 
}

    // Permitir apertar ENTER para entrar
document.getElementById('nickname').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        entrar();
    }
});