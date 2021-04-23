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
    const arrLocalIds = getUserQuizzes();
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
                    <button onclick="buildNewQuizzPageStart()">Criar Quizz</button>
                </div>
                <div class="not-empty ${isThereQuiz?"":"hidden"}">
                    <p class="section-title">Seus Quizzes<span><ion-icon onclick="buildNewQuizzPageStart()" name="add-circle"></ion-icon></span></p>
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
                                        <img class="svg" src="assets/images/edit.svg">
                                        <ion-icon name="trash"></ion-icon>
                                    </span>
                                    <img src=${quizzList[i].image}" alt="quizz thumbnail">
                                    <p>${quizzList[i].title}</p>
                                </li>`
        } else {
            quizzContainer.innerHTML += ` 
                                <li onclick="getQuizz(${quizzList[i].id})" class="quizz-thumb">
                                    <div></div>
                                    <img src=${quizzList[i].image}" alt="quizz thumbnail">
                                    <p>${quizzList[i].title}</p>
                                </li>`
        }
    }
}

function toggleLoading() {
    document.querySelector(".page-container").innerHTML = `
    <div class="loading">
        <img src="assets/images/loading2.gif" alt="loading gif">
        <p>Carregando</p>
    </div>`
}

buildHomePage();
// buildNewQuizzPageQuestions(newQuizzObj = { title: 'a', image: 'a', questions: [{}, {}, {}], levels: [{}, {}] });