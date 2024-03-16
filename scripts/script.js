// Importa a classe Briefing do módulo briefing.js
import { Briefing } from './briefing.js';

// URL do servidor NTP
const ntpServerUrl = 'https://worldtimeapi.org/api/ip';

// Inicializa array de briefings
let arrayDeBriefings = new Array();

// Função para formatar data e hora
function formatarDataHora(dataHora) {
    // Obtém os componentes da data
    const dia = dataHora.getDate().toString().padStart(2, '0');
    const mes = (dataHora.getMonth() + 1).toString().padStart(2, '0'); // O mês é baseado em zero
    const ano = dataHora.getFullYear();
    
    // Obtém os componentes da hora
    const horas = dataHora.getHours().toString().padStart(2, '0');
    const minutos = dataHora.getMinutes().toString().padStart(2, '0');
    const segundos = dataHora.getSeconds().toString().padStart(2, '0');
    
    // Monta a string formatada
    const stringDataHora = `${dia}/${mes}/${ano} - ${horas}:${minutos}`;
    
    // Retorna a string formatada
    return stringDataHora;
}

// Função assíncrona para obter a hora atual do servidor NTP
async function getHora() {
    try {
        // Faz uma solicitação GET para o servidor NTP
        const response = await fetch(ntpServerUrl);
        
        // Verifica se a solicitação foi bem-sucedida
        if (!response.ok) {
            throw new Error('Não foi possível obter a hora atual');
        }
        
        // Converte a resposta para JSON
        const data = await response.json();
    
        // Extrai a data e hora atual da resposta
        const dataHoraAtual = new Date(data.datetime);

        // Formata a hora e retorna
        const horaFormatada = formatarDataHora(dataHoraAtual);
        return horaFormatada;
    } catch (error) {
        console.error('Erro ao obter a hora atual:', error);
        return null;
    }
}

// Função para transformar um briefing em uma apresentação em flashcard
function transformFlashcardApresentation(briefing) {
    var status = "";
    if (briefing._state == "negociacao") {
        status = "Em negociação 💬";
    } else if (briefing._state == "aprovado") {
        status = "Aprovado 👍";
    } else {
        status = "Finalizado ✅"
    }
    // Retorna uma string HTML com os dados do briefing formatados
    return`
        <div class="listed-briefing">
            <div class="briefing-main-informations">
                <div class="identifier">#${briefing.identifier.toString().padStart(3, '0')}<span class="creation-time">${briefing.creationTime}</span></div>
                <div class="client-name">${briefing.clientName}</div>
                <div class="brief-description">${briefing.description}</div>
            </div>
            <div class="status-and-edit-briefing">
                <div class="edition-buttons"><span>Editar 📝</span>|<span>Excluir 🗑️</span></div>
                <div class="status">${status}</div>
            </div>
        </div>
    `;
}

// Função para limpar uma div pelo ID
function clearDiv(divId) {
    const divElement = document.getElementById(divId);
    divElement.className = "";
    divElement.innerHTML = ""; // Atribui uma string vazia para remover todos os elementos filhos
}

// Função para exibir o campo de filtro
function showFilterField() {
    document.getElementById("filter-field").classList.remove("hide");
}

//Verifica se há algo diferente a respeito de briefings na sessionStorage e os remove
function checkIfDifferentRegardingBriefingsInSessionStorage(index) {
    if (!(sessionStorage.key(index).startsWith("briefing") || sessionStorage.key(index).startsWith("totalBriefings"))) {
        sessionStorage.removeItem(sessionStorage.key(index));
    }
}

// Função para lidar com a lógica da modal de cadastro
function modalBotaoCadastrar() {
    document.addEventListener("DOMContentLoaded", function() {
        const openModalButton = document.querySelector("#open-modal");
        const closeModalButtons = document.querySelectorAll(".close-modal");
        const modal = document.querySelector("#modal");
        const fade = document.querySelector("#fade");

        const toggleModal = () => {
            modal.classList.toggle("hide");
            fade.classList.toggle("hide");
        };

        // Função para fechar a modal quando o usuário clicar fora dela
        const closeOutsideModal = (event) => {
            if (event.target === fade) {
                toggleModal();
            }
        };

        openModalButton.addEventListener("click", toggleModal);
        closeModalButtons.forEach((button) => {
            button.addEventListener("click", toggleModal);
        });

        fade.addEventListener("click", closeOutsideModal);
    });
}

// Função assíncrona para salvar um briefing
async function saveBriefing() {
    // Limpa o sessionStorage, mantendo apenas os briefings salvos e o total de briefings
    for (let i = 0; i < sessionStorage.length; i++) {
        checkIfDifferentRegardingBriefingsInSessionStorage(i);
    }

    let totalBriefings = parseInt(sessionStorage.getItem("totalBriefings")) || 0;
    totalBriefings++;

    // Obtém os dados do formulário
    var identifier = totalBriefings;
    var name = document.getElementById("input-field-name").value;
    var description = document.getElementById("input-field-description").value;
    var creationHour = await getHora();
    var status = document.getElementById("input-field-status").value;

    // Cria um novo briefing
    const briefing = new Briefing(identifier, name, description, creationHour, status);

    // Salva o briefing no sessionStorage
    sessionStorage.setItem(`briefing${identifier}`, JSON.stringify(briefing));
    sessionStorage.setItem("totalBriefings", totalBriefings);
}

// Função para listar os briefings
function listBriefing() {
    let listedBriefingField = null;
    clearDiv("nothing-found");
    clearDiv("list-here");

    listedBriefingField = document.getElementById("list-here");

    if (sessionStorage.length > 0) {
        let newHtml = "";
        for (let i = 0; i < sessionStorage.length; i++) {
            checkIfDifferentRegardingBriefingsInSessionStorage(i);
        }
        
        for (let i = 0; i < sessionStorage.length; i++) {
            if (sessionStorage.getItem(`briefing${i}`)) {
                let dadoRecuperado = sessionStorage.getItem(`briefing${i}`);
                dadoRecuperado = JSON.parse(dadoRecuperado);
                const briefing = new Briefing();
                briefing._identifier = dadoRecuperado._identifier;
                briefing._clientName = dadoRecuperado._clientName;
                briefing._description = dadoRecuperado._description;
                briefing._creationTime = dadoRecuperado._creationTime;
                briefing._state = dadoRecuperado._state;

                newHtml += transformFlashcardApresentation(briefing);
            } else {
                
            }
        }
        
        if (newHtml !== "") {
            showFilterField();
        }

        listedBriefingField.innerHTML = newHtml;
    }

    if (sessionStorage.length === 0) {
        listedBriefingField = document.getElementById("nothing-found");
        listedBriefingField.innerText = "- - - Nenhum resultado encontrado - - -";
        listedBriefingField.classList.add("padding2");
        return;
    }
}

// Função para filtrar os briefings
function filterBriefings() {
    let listedBriefingField = null;
    clearDiv("nothing-found");
    clearDiv("list-here");

    var valorASerFiltrado = document.getElementById("input-filter-status").value
    listedBriefingField = document.getElementById("list-here");

    let newHtml = "";
    for (let i = 0; i < sessionStorage.length; i++) {
        if ((sessionStorage.key(i).startsWith("briefing"))) {
            var objetoASerRecuperado = sessionStorage.getItem(sessionStorage.key(i));
            objetoASerRecuperado = JSON.parse(objetoASerRecuperado)
            if (objetoASerRecuperado._state == valorASerFiltrado) {
                let dadoRecuperado = sessionStorage.getItem(sessionStorage.key(i));
                dadoRecuperado = JSON.parse(dadoRecuperado);
                const briefing = new Briefing();
                briefing._identifier = dadoRecuperado._identifier;
                briefing._clientName = dadoRecuperado._clientName;
                briefing._description = dadoRecuperado._description;
                briefing._creationTime = dadoRecuperado._creationTime;
                briefing._state = dadoRecuperado._state;

                newHtml += transformFlashcardApresentation(briefing);
            }
        } else {

        }
    }
    listedBriefingField.innerHTML = newHtml;
}

// Função de inicialização
function init() {
    modalBotaoCadastrar();

    // Adiciona listeners aos botões
    const saveButton = document.getElementById("saveButton");
    saveButton.addEventListener("click", saveBriefing);
    const listButton = document.getElementById("listButton");
    listButton.addEventListener("click", listBriefing);
    const filterButton = document.getElementById("filter-button");
    filterButton.addEventListener("click", filterBriefings);
}

// Inicializa o código
init();