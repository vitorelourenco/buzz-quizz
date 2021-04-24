const container = document.querySelector('.page-container');

//i didnt use scrollintoview because it doesnt
//take the fixed header into account
function scrollQuizz(domElem, delay) {
    const getY = function(elem) {
        const rect = elem.getBoundingClientRect();
        const scrollTop = window.pageYOffset;
        return rect.top + scrollTop;;
    }
    const header = document.querySelector('.main-header');
    const headerHeight = header.offsetHeight;
    setTimeout(() => {
        window.scrollTo(0, getY(domElem) - headerHeight);
    }, delay);
}

let idList = [];

function getUserQuizzes() {
    let stringId = localStorage.getItem("ids");
    idList = JSON.parse(stringId);
    return idList === null ? [] : idList;
}

function buildHomePage() {
    const ids = getUserQuizzes();
    const arrLocalIds = [];
    ids.forEach(elem => {
        arrLocalIds.push(elem.id);
    })

    const isThereQuiz = !!arrLocalIds.length;
    const element = document.querySelector(".page-container");

    element.innerHTML = `
        <div class="loading">
            <img src="assets/images/loading2.gif" alt="loading gif">
            <p>Carregando</p>
        </div>
        <div class="home-container hidden">
            <div class="created-quizzes">
                <div class="empty ${isThereQuiz?"hidden":""}">
                    <p>Você não criou nenhum<br> quizz ainda :(</p>
                    <button onclick="buildNewQuizzPageStart(-1)">Criar Quizz</button>
                </div>
                <div class="not-empty ${isThereQuiz?"":"hidden"}">
                    <p class="section-title">Seus Quizzes<span><ion-icon onclick="buildNewQuizzPageStart(-1)" name="add-circle"></ion-icon></span></p>
                    <ul class="quizzes-list user-quizzes">
                    </ul>
                </div>
            </div>
            <p class="section-title">Todos os Quizzes</p>
            <ul class="quizzes-list all-quizzes"></ul>
        </div>`
    scrollQuizz(container, 0);
    getQuizzes(arrLocalIds);
}

function getQuizzes(arrLocalIds) {
    const promisse = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/buzzquizz/quizzes");
    promisse.then((resposta) => buildQuizzList(resposta, arrLocalIds));
}

function buildQuizzList(resposta, arrLocalIds) {
    let element = document.querySelector(".loading");
    element.parentNode.removeChild(element);
    element = document.querySelector(".home-container");
    element.classList.remove("hidden");
    const quizzList = resposta.data;
    let quizzContainer = document.querySelector(".all-quizzes");
    const localQuizzContainer = document.querySelector(".user-quizzes");
    localQuizzContainer.innerHTML = "";
    quizzContainer.innerHTML = "";
    for (i = 0; i < quizzList.length; i++) {
        if (arrLocalIds.indexOf(quizzList[i].id) !== -1) {
            localQuizzContainer.innerHTML += ` 
                                <li onclick="getQuizz(${quizzList[i].id})" class="quizz-thumb">
                                    <div></div>
                                    <span class="label">
                                        <span  onclick="editQuizz(${quizzList[i].id}, event)" class="edit">
                                            <img src="assets/images/edit-white.svg">
                                        </span>
                                        <div onclick="deleteQuizz(${quizzList[i].id}, event)" class="trash"> 
                                            <ion-icon name="trash-outline"></ion-icon>
                                        </div>
                                    </span>
                                    <img src=${quizzList[i].image}" alt="quizz thumbnail">
                                    <p>${quizzList[i].title}</p>
                                </li>`
        } else
            quizzContainer.innerHTML += ` 
                                <li onclick="getQuizz(${quizzList[i].id})" class="quizz-thumb">
                                    <div></div>
                                    <img src=${quizzList[i].image}" alt="quizz thumbnail">
                                    <p>${quizzList[i].title}</p>
                                </li>`
    }
    element = document.querySelector(".user-quizzes");
    if (element.innerHTML === "") {
        element = document.querySelector(".not-empty");
        element.classList.add("hidden");
        element = document.querySelector(".empty");
        element.classList.remove("hidden");
    }
}

function deleteQuizz(id, event) {
    event.stopPropagation();
    const userAnswer = window.confirm("Você realmente quer deletar esse quizz?");
    if (userAnswer === false) return;
    let key;
    const local = getUserQuizzes();
    local.forEach(elem => {
        if (elem.id === id) {
            key = elem.key;
        }
    })
    axios
        .delete(`https://mock-api.bootcamp.respondeai.com.br/api/v2/buzzquizz/quizzes/${id}`, { headers: { 'Secret-Key': key } })
        .then(() => {
            console.log(`deleted ${id}`);
            buildHomePage();
        })
        .catch((err) => { console.log(err) })
}

function toggleLoading() {
    document.querySelector(".page-container").innerHTML = `
    <div class="loading">
        <img src="assets/images/loading2.gif" alt="loading gif">
        <p>Carregando</p>
    </div>`
}

function goToHome() {
    let confirmHome;
    if ((document.querySelector(".new-quizz") !== null && !(document.querySelector(".new-quizz").classList.contains("done")))) {
        confirmHome = window.confirm("Voltar para a Página inicial fará com que você perca todos os dados do seu Quiz.\n\nVoltar mesmo assim?");
        if (!confirmHome) return;
        else buildHomePage();
    } else buildHomePage();
}


buildHomePage();
// buildNewQuizzPageQuestions(newQuizzObj = { title: 'a', image: 'a', questions: [{}, {}, {}], levels: [{}, {}] });