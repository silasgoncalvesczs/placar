// Chave nova para não misturar com dados antigos
const STORAGE_KEY = 'placar_games_v2';

let players = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

const listaEl = document.getElementById('listaJogadores');
const inputNome = document.getElementById('inputNome');

// Gerar Avatar (Estilo Notionists - Preto e Branco Artístico)
function gerarAvatar() {
    const seed = Date.now().toString() + Math.random().toString(36).substring(7);
    return `https://api.dicebear.com/7.x/notionists/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffdfbf`;
}

function render() {
    listaEl.innerHTML = '';
    // Ordena do maior para o menor
    players.sort((a, b) => b.pontos - a.pontos);

    players.forEach((player, index) => {
        if (!player.avatar) { player.avatar = gerarAvatar(); }

        const div = document.createElement('div');
        const classeRank = index === 0 ? 'card top-1' : 'card';

        div.className = classeRank;
        div.innerHTML = `
            <div class="info">
                <span class="rank">${index + 1}º</span>
                <img src="${player.avatar}" alt="Avatar" class="avatar-img">
                
                <span class="name" onclick="editarNome(${index})" title="Clique para editar o nome">
                    ${player.nome}
                </span>
            </div>
            
            <div class="score-display">${player.pontos}</div>

            <div class="actions">
                <button class="btn-pt sub-5" onclick="mudarPontos(${index}, -5)">-5</button>
                <button class="btn-pt add-10" onclick="mudarPontos(${index}, 10)">+10</button>
                <button class="btn-pt add-50" onclick="mudarPontos(${index}, 50)">+50</button>
                <button class="btn-pt del" onclick="remover(${index})" title="Remover jogador">✕</button>
            </div>
        `;
        listaEl.appendChild(div);
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
}

function adicionar() {
    const nome = inputNome.value.trim();
    if (!nome) return alert("Digite um nome!");

    players.push({ nome: nome, pontos: 0, avatar: gerarAvatar() });
    inputNome.value = '';
    inputNome.focus();
    render();
}

function editarNome(index) {
    const nomeAtual = players[index].nome;
    const novoNome = prompt("Editar nome:", nomeAtual);

    if (novoNome !== null && novoNome.trim() !== "") {
        players[index].nome = novoNome.trim();
        render();
    }
}

function mudarPontos(index, qtd) {
    players[index].pontos += qtd;
    render();
}

function remover(index) {
    if (confirm("Remover este jogador?")) {
        players.splice(index, 1);
        render();
    }
}

function resetarTudo() {
    if (confirm("ATENÇÃO: Isso apagará todo o ranking. Continuar?")) {
        players = [];
        render();
    }
}

// --- FUNÇÃO DE VITÓRIA E CONFETES ---
function encerrarJogo() {
    if (players.length === 0) return alert("Não há jogadores para premiar!");

    const campeao = players[0];
    dispararConfetes();

    setTimeout(() => {
        alert(`🏆 PARABÉNS ${campeao.nome.toUpperCase()}!\n\nVocê venceu com ${campeao.pontos} pontos!`);
    }, 300);
}

function dispararConfetes() {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 999 };
    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { 
            particleCount, 
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } 
        }));
        confetti(Object.assign({}, defaults, { 
            particleCount, 
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } 
        }));
    }, 250);
}

inputNome.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') adicionar();
});

// Inicializa
render();