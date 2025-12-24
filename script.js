const STORAGE_KEY = 'placar_natal_dark_v3';

let players = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

const listaEl = document.getElementById('listaJogadores');
const inputNome = document.getElementById('inputNome');

// Avatar com seed aleatória
function gerarAvatar() {
    const seed = Date.now().toString() + Math.random().toString(36).substring(7);
    return `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffdfbf,ffd5dc`;
}

function render() {
    listaEl.innerHTML = '';
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
                <span class="name">${player.nome}</span>
            </div>
            
            <div class="score-display">${player.pontos}</div>

            <div class="actions">
                <button class="btn-pt sub-5" onclick="mudarPontos(${index}, -5)">-5</button>
                <button class="btn-pt add-10" onclick="mudarPontos(${index}, 10)">+10</button>
                <button class="btn-pt add-50" onclick="mudarPontos(${index}, 50)">+50</button>
                <button class="btn-pt del" onclick="remover(${index})">✕</button>
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

function mudarPontos(index, qtd) {
    players[index].pontos += qtd;
    render();
}

function remover(index) {
    if (confirm("Remover participante?")) {
        players.splice(index, 1);
        render();
    }
}

function resetarTudo() {
    if (confirm("Isso apagará tudo! Tem certeza?")) {
        players = [];
        render();
    }
}

inputNome.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') adicionar();
});

// --- EFEITO DE NEVE REFINADO ---
function criarNeve() {
    const snowflake = document.createElement('div');
    snowflake.innerHTML = '❄️';
    snowflake.classList.add('snowflake');
    snowflake.style.left = Math.random() * 100 + 'vw';
    snowflake.style.fontSize = (Math.random() * 15 + 10) + 'px'; // Tamanho variado
    snowflake.style.animationDuration = (Math.random() * 3 + 4) + 's'; // Velocidade variada

    document.body.appendChild(snowflake);

    setTimeout(() => { snowflake.remove(); }, 7000);
}

// Inicia tela e efeito
render();
setInterval(criarNeve, 200); // Neve caindo a cada 200ms