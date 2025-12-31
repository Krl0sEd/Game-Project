document.addEventListener('DOMContentLoaded', () => {
    const corpoTabela = document.getElementById('corpo-tabela');
    const btnLimpar = document.getElementById('btn-limpar');
    const NOME_DO_SAVE = 'officeSimRanking';
    
    // --- ELEMENTOS DA NOVA JANELA DE SENHA ---
    const janelaSenha = document.getElementById('janela-senha');
    const inputSenha = document.getElementById('input-senha-rh');
    const msgErro = document.getElementById('msg-erro-rh');
    const btnFechar = document.getElementById('btn-fechar-senha');
    const btnCancelar = document.getElementById('btn-cancelar-apagar');
    const btnConfirmar = document.getElementById('btn-confirmar-apagar');

    // --- FUNÇÃO PARA CARREGAR E EXIBIR OS DADOS ---
    function carregarLeaderboard() {
        const dadosSalvos = localStorage.getItem(NOME_DO_SAVE);
        let ranking = dadosSalvos ? JSON.parse(dadosSalvos) : [];

        corpoTabela.innerHTML = '';

        if (ranking.length === 0) {
            corpoTabela.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align: center; color: #666; padding: 20px;">
                        Nenhum registro encontrado. Vá trabalhar!
                    </td>
                </tr>
            `;
            return;
        }

        ranking.sort((a, b) => b.pontos - a.pontos);

        ranking.slice(0, 50).forEach((item, index) => {
            const linha = document.createElement('tr');
            
            let rankIcone = index + 1;
            if (index === 0) rankIcone = '🥇';
            if (index === 1) rankIcone = '🥈';
            if (index === 2) rankIcone = '🥉';

            linha.innerHTML = `
                <td>${rankIcone}</td>
                <td>${item.nome}</td>
                <td>R$ ${item.pontos}</td>
                <td>${item.data}</td>
            `;
            corpoTabela.appendChild(linha);
        });
    }

    // --- LÓGICA DA SENHA SECRETA ---
    
    // 1. Abrir a janela ao clicar em Limpar
    btnLimpar.addEventListener('click', () => {
        janelaSenha.style.display = 'flex';
        inputSenha.value = '';
        msgErro.style.display = 'none';
        inputSenha.focus(); // Já deixa pronto pra digitar
    });

    // 2. Fechar a janela (X ou Cancelar)
    function fecharJanela() {
        janelaSenha.style.display = 'none';
    }
    btnFechar.addEventListener('click', fecharJanela);
    btnCancelar.addEventListener('click', fecharJanela);

    // 3. Verificar a senha e Apagar
    function verificarEApagar() {
        const senhaDigitada = inputSenha.value;

        if (senhaDigitada === "meugatinho") {
            // 
            // Senha Correta
            localStorage.removeItem(NOME_DO_SAVE);
            fecharJanela();
            carregarLeaderboard(); // Atualiza a tabela (vai ficar vazia)
            alert("🧹 O Histórico do RH foi deletado com sucesso.");
        } else {
             // 
            // Senha Errada
            msgErro.style.display = 'block';
            inputSenha.value = '';
            inputSenha.focus();
        }
    }

    // Clique no botão Apagar
    btnConfirmar.addEventListener('click', verificarEApagar);

    // Atalho: Apertar ENTER na caixa de senha
    inputSenha.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') verificarEApagar();
    });

    // Inicia carregando os dados
    carregarLeaderboard();
});