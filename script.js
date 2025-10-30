// =============================================================
//  EsToDoList - Script Base Adaptável
//  Autor: Assistente de Desenvolvimento Front-end
//  Objetivo: Fornecer um JS limpo, modular e compatível com qualquer HTML
// =============================================================

// -------------------------------
// 1. Selecionar elementos da página (ajuste conforme seu HTML)
// -------------------------------
// Dica: quando você criar seu HTML, mantenha esses IDs para evitar ajustes.
const campoNovaTarefa = document.getElementById('nova-tarefa-input')
const botaoAdicionar = document.getElementById('adicionar-btn')
const listaTarefas = document.getElementById('lista-de-tarefas')
const campoPesquisa = document.getElementById('pesquisa-input')
const seletorFiltro = document.getElementById('filtro-select')

// -------------------------------
// 2. Array principal e carregamento inicial
// -------------------------------
let tarefas = []

// Função para carregar tarefas do localStorage
function carregarTarefasSalvas() {
  const tarefasSalvas = localStorage.getItem('tarefas')

  if (tarefasSalvas) {
    tarefas = JSON.parse(tarefasSalvas)
    exibirTarefas(tarefas)
  }
}

// Função para salvar tarefas no localStorage
function salvarTarefas() {
  localStorage.setItem('tarefas', JSON.stringify(tarefas))
}

// -------------------------------
// 3. Adicionar nova tarefa
// -------------------------------
function adicionarTarefa() {
  if (!campoNovaTarefa) return // evita erro se o campo não existir
  const texto = campoNovaTarefa.value.trim()

  if (texto === '') {
    alert('Digite uma tarefa antes de adicionar!')
    return
  }

  const novaTarefa = {
    id: Date.now(),
    texto: texto,
    concluida: false
  }

  tarefas.push(novaTarefa)
  salvarTarefas()
  exibirTarefas(tarefas)

  campoNovaTarefa.value = ''
}

// -------------------------------
// 4. Exibir tarefas na tela
// -------------------------------
function exibirTarefas(listaParaMostrar) {
  if (!listaTarefas) return // evita erro se o elemento não existir
  listaTarefas.innerHTML = ''

  listaParaMostrar.forEach(tarefa => {
    const item = document.createElement('li')
    item.className = 'item-tarefa' // use a classe que preferir no seu HTML

    if (tarefa.concluida) item.classList.add('concluida')

    // Texto da tarefa
    const textoTarefa = document.createElement('span')
    textoTarefa.textContent = tarefa.texto
    textoTarefa.className = 'tarefa-texto'
    textoTarefa.onclick = () => alternarConclusao(tarefa.id)

    // Botões
    const botoes = document.createElement('div')
    botoes.className = 'botoes-tarefa'

    const botaoEditar = document.createElement('button')
    botaoEditar.textContent = '✏️'
    botaoEditar.onclick = () => editarTarefa(tarefa.id)

    const botaoExcluir = document.createElement('button')
    botaoExcluir.textContent = '🗑️'
    botaoExcluir.onclick = () => excluirTarefa(tarefa.id)

    botoes.appendChild(botaoEditar)
    botoes.appendChild(botaoExcluir)

    item.appendChild(textoTarefa)
    item.appendChild(botoes)
    listaTarefas.appendChild(item)
  })
}

// -------------------------------
// 5. Alternar status (concluída / ativa)
// -------------------------------
function alternarConclusao(id) {
  tarefas = tarefas.map(tarefa =>
    tarefa.id === id ? { ...tarefa, concluida: !tarefa.concluida } : tarefa
  )

  salvarTarefas()
  exibirTarefas(tarefas)
}

// -------------------------------
// 6. Editar uma tarefa
// -------------------------------
function editarTarefa(id) {
  const novaDescricao = prompt('Edite a tarefa:')

  if (novaDescricao === null || novaDescricao.trim() === '') return

  tarefas = tarefas.map(tarefa =>
    tarefa.id === id ? { ...tarefa, texto: novaDescricao.trim() } : tarefa
  )

  salvarTarefas()
  exibirTarefas(tarefas)
}

// -------------------------------
// 7. Excluir uma tarefa
// -------------------------------
function excluirTarefa(id) {
  const confirmar = window.confirm('Tem certeza que deseja excluir esta tarefa?')
  if (!confirmar) return

  tarefas = tarefas.filter(tarefa => tarefa.id !== id)
  salvarTarefas()
  exibirTarefas(tarefas)
}

// -------------------------------
// 8. Pesquisar tarefas (filtro por texto)
// -------------------------------
function pesquisarTarefas() {
  if (!campoPesquisa) return
  const termo = campoPesquisa.value.toLowerCase()

  const filtradas = tarefas.filter(tarefa =>
    tarefa.texto.toLowerCase().includes(termo)
  )

  exibirTarefas(filtradas)
}

// -------------------------------
// 9. Filtro: todos / ativos / concluídos
// -------------------------------
function filtrarTarefas() {
  if (!seletorFiltro) return
  const tipo = seletorFiltro.value
  let filtradas = []

  switch (tipo) {
    case 'ativos':
      filtradas = tarefas.filter(t => !t.concluida)
      break
    case 'concluidos':
      filtradas = tarefas.filter(t => t.concluida)
      break
    default:
      filtradas = tarefas
  }

  exibirTarefas(filtradas)
}

// -------------------------------
// 10. Eventos do usuário
// -------------------------------
if (botaoAdicionar) botaoAdicionar.addEventListener('click', adicionarTarefa)
if (campoPesquisa) campoPesquisa.addEventListener('input', pesquisarTarefas)
if (seletorFiltro) seletorFiltro.addEventListener('change', filtrarTarefas)

if (campoNovaTarefa) {
  campoNovaTarefa.addEventListener('keydown', event => {
    if (event.key === 'Enter') adicionarTarefa()
  })
}

// -------------------------------
// 11. Inicialização automática
// -------------------------------
window.addEventListener('load', carregarTarefasSalvas)
