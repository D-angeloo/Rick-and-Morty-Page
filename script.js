// selecao dos elementos
const lista_personagens = document.querySelector("#lista_personagens");
const pesquisar = document.querySelector("#pesquisar");
const formulario = document.querySelector("#formulario");
// function pra criar os card
function criarCards(lista) {
    lista.forEach((personagem_da_vez) => {
        const nova_div = document.createElement("div");

        const novo_nome = document.createElement("h2");
        novo_nome.textContent = personagem_da_vez.name;

        const novo_img = document.createElement("img");
        novo_img.src = personagem_da_vez.image;
        novo_img.alt = `Imagem do ${personagem_da_vez.name}`;

        const novo_specie = document.createElement("p");
        novo_specie.textContent = personagem_da_vez.species;

        const novo_status = document.createElement("p");
        novo_status.textContent = personagem_da_vez.status;

        const novo_location = document.createElement("p");
        novo_location.textContent = personagem_da_vez.location.name;

        nova_div.append(novo_nome, novo_img, novo_specie, novo_status, novo_location);
        lista_personagens.appendChild(nova_div);
    });
}

async function buscarDados() {
    try {
        const resposta = await fetch("https://rickandmortyapi.com/api/character");
        const resposta2 = await fetch("https://rickandmortyapi.com/api/character/?page=2");
        const resposta3 = await fetch("https://rickandmortyapi.com/api/character/?page=3");
        const dados = await resposta.json();
        const dados2 = await resposta2.json();
        const dados3 = await resposta3.json();
        criarCards(dados.results);
        criarCards(dados2.results);
        criarCards(dados3.results);
    } catch (error) {
        console.error("Erro ao buscar dados:", error);
    }
}
buscarDados();
// pesquisar os personagens
formulario.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
        const resposta = await fetch(`https://rickandmortyapi.com/api/character/?name=${pesquisar.value}`);
        const dados = await resposta.json();
        lista_personagens.innerHTML = ''; // limpa a lista antes de adicionar novos resultados
        criarCards(dados.results);
    } catch (error) {
        console.error("Erro ao buscar personagens:", error);
    }
});
