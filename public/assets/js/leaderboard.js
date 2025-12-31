document.addEventListener('DOMContentLoaded', () => {
    const corpoTabela = document.getElementById('corpo-tabela');
    const btnLimpar = document.getElementById('btn-limpar');
    const NOME_DO_SAVE = 'officeSimRanking'; // A chave onde salvamos os dados

    // --- FUNÇÃO PARA CARREGAR E EXIBIR OS DADOS ---
    function carregarLeaderboard() {
        // 1. Tenta pegar os dados salvos. Se não tiver nada, cria uma lista vazia.
        const dadosSalvos = localStorage.getItem(NOME_DO_SAVE);
        let ranking = dadosSalvos ? JSON.parse(dadosSalvos) : [];

        // 2. Limpa a tabela (remove o "Carregando..." ou dados antigos)
        corpoTabela.innerHTML = '';

        // 3. Se a lista estiver vazia, mostra mensagem
        if (ranking.length === 0) {
            corpoTabela.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align: center; color: #666;">
                        Nenhum registro encontrado. Vá trabalhar!
                    </td>
                </tr>
            `;
            return;
        }

        // 4. Ordena a lista: Quem tem mais pontos (pontos) fica em cima
        ranking.sort((a, b) => b.pontos - a.pontos);

        // 5. Cria as linhas da tabela (Top 10 apenas para não travar)
        ranking.slice(0, 50).forEach((item, index) => {
            const linha = document.createElement('tr');
            
            // Define ícone para os top 3
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

    // --- FUNÇÃO PARA LIMPAR O HISTÓRICO ---
    btnLimpar.addEventListener('click', () => {
        // Pergunta de confirmação estilo Windows
        const confirmar = confirm("Atenção!\n\nVocê está prestes a deletar todos os registros do RH.\nO Chefe não vai gostar disso.\n\nDeseja continuar?");
        
        if (confirmar) {
            localStorage.removeItem(NOME_DO_SAVE); // Apaga do navegador
            carregarLeaderboard(); // Atualiza a tela (vai ficar vazia)
            alert("Arquivos deletados com sucesso. Ninguém viu nada. 🤫");
        }
    });

    // Inicia tudo
    carregarLeaderboard();
});