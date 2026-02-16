const lista_personagens = document.querySelector("#lista_personagens")
const pesquisar = document.querySelector("#pesquisar")
const formulario = document.querySelector("#formulario")

// funçao para criar os cards com melhorias visuais
function criarCards(lista) {
    lista.forEach((personagem) => {
        const card = document.createElement("div")

        // nome
        const nome = document.createElement("h2")
        nome.textContent = personagem.name

        // imagem
        const img = document.createElement("img")
        img.src = personagem.image
        img.alt = `Imagem do ${personagem.name}`

        // container de status 
        const statusContainer = document.createElement("div")
        statusContainer.classList.add("status-container")
        
        const bola = document.createElement("span")
        bola.classList.add("status-bola", personagem.status.toLowerCase())
        
        const statusTexto = document.createElement("p")
        statusTexto.textContent = `${personagem.status} - ${personagem.species}`
        
        statusContainer.append(bola, statusTexto)

        // localizaçao
        const local = document.createElement("p")
        local.innerHTML = `<strong>Última localização:</strong><br>${personagem.location.name}`

        card.append(nome, img, statusContainer, local)
        lista_personagens.appendChild(card)
    })
}

// busca inicial otimizada (paginas 1, 2 e 3 juntas)
async function buscarDadosIniciais() {
    lista_personagens.innerHTML = ""
    try {
        const paginas = [1, 2, 3]
        const promessas = paginas.map(pg => 
            fetch(`https://rickandmortyapi.com/api/character/?page=${pg}`).then(r => r.json())
        )
        
        const resultados = await Promise.all(promessas)
        resultados.forEach(dado => criarCards(dado.results))
        
    } catch (error) {
        console.error("Erro ao carregar início:", error)
    }
}

buscarDadosIniciais()

// pesquisa com tratamento de erro
formulario.addEventListener("submit", async (e) => {
    e.preventDefault()
    const busca = pesquisar.value.trim()
    
    if(!busca) return // não faz nada se o campo estiver vazio

    lista_personagens.innerHTML = '<p>Buscando...</p>'

    try {
        const resposta = await fetch(`https://rickandmortyapi.com/api/character/?name=${busca}`)
        const dados = await resposta.json()

        lista_personagens.innerHTML = '' // limpa o "Buscando..."

        if (dados.error) {
            lista_personagens.innerHTML = `
                <div class="msg-erro">
                    <p>Wubba Lubba Dub Dub! Personagem não encontrado.</p>
                </div>`
        } else {
            criarCards(dados.results)
        }
    } catch (error) {
        console.error("Erro na busca:", error)
        lista_personagens.innerHTML = `
            <div class="msg-erro">
                <p>Erro de conexão. Verifique sua internet!</p>
            </div>`
    }
})

// evento de clique no painel pra resetar:
const painel = document.querySelector("#painel")

painel.addEventListener("click", () => {
    pesquisar.value = ""
    lista_personagens.innerHTML = ""
    buscarDadosIniciais()
    pesquisar.focus() // facilita para o usuario começar uma nova busca na hora
})

// dark mode
const botaoTema = document.querySelector("#botao-claro-escuro")
const body = document.body

botaoTema.addEventListener("click", () => {
    body.classList.toggle("dark-mode")
    
    // muda o ícone/texto do botão
    if (body.classList.contains("dark-mode")) {
        botaoTema.innerHTML = '<i class="fas fa-sun"></i> Light Mode'
    } else {
        botaoTema.innerHTML = '<i class="fas fa-moon"></i> Dark Mode'
    }
    
    // salva a preferencia do usuário no navegador
    const isDark = body.classList.contains("dark-mode")
    localStorage.setItem("theme", isDark ? "dark" : "light")
})

// localstorage pra manter o dark mode
if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark-mode")
    botaoTema.innerHTML = '<i class="fas fa-sun"></i> Light Mode'
}