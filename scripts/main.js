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

function getQuizzes() {
    const promisse = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/buzzquizz/quizzes");
    promisse.then(buildQuizzList);
}

function buildHomePage(isThereQuiz) {
    const element = document.querySelector(".page-container");
    element.innerHTML = `<div class="home-container">
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
    getQuizzes();
}

function buildQuizzList(resposta) {
    const quizzList = resposta.data;
    let quizzContainer = document.querySelector(".all-quizzes");
    quizzContainer.innerHTML = "";
    for (i = 0; i < quizzList.length; i++) {
        console.log(quizzList[i]);
        quizzContainer.innerHTML += ` <li onclick="getQuizz(${quizzList[i].id})" class="quizz-thumb">
                                <div></div>
                                <img src=${quizzList[i].image}" alt="quizz thumbnail">
                                <p>${quizzList[i].title}</p>
                            </li>`
    }
}

buildHomePage(true);
// buildNewQuizzPageQuestions(newQuizzObj = { title: 'a', image: 'a', questions: [{}, {}, {}], levels: [{}, {}] });