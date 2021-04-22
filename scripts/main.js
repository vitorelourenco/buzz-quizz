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

function buildHomePage() {
    //change this line when i get the function that returns the local IDs list
    const arrLocalIds = [1,2,3];
    const isThereQuiz = !!arrLocalIds.length;
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
    getQuizzes(arrLocalIds);
}

function getQuizzes(arrLocalIds) {
    const promisse = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/buzzquizz/quizzes");
    promisse.then((resposta)=>buildQuizzList(resposta, arrLocalIds));
}

function buildQuizzList(resposta, arrLocalIds) {
    const quizzList = resposta.data;
    let quizzContainer = document.querySelector(".all-quizzes");
    const localQuizzContainer = document.querySelector(".user-quizzes");
    localQuizzContainer.innerHTML = "";
    quizzContainer.innerHTML = "";
    for (i = 0; i < quizzList.length; i++) {
        if (arrLocalIds.indexOf(quizzList[i].id) !== -1){
            localQuizzContainer.innerHTML += ` <li onclick="getQuizz(${quizzList[i].id})" class="quizz-thumb">
                                    <div></div>
                                    <img src=${quizzList[i].image}" alt="quizz thumbnail">
                                    <p>${quizzList[i].title}</p>
                                </li>`
        } else {
            quizzContainer.innerHTML += ` <li onclick="getQuizz(${quizzList[i].id})" class="quizz-thumb">
                                    <div></div>
                                    <img src=${quizzList[i].image}" alt="quizz thumbnail">
                                    <p>${quizzList[i].title}</p>
                                </li>`
        }
    }
}

buildHomePage();
// buildNewQuizzPageQuestions(newQuizzObj = { title: 'a', image: 'a', questions: [{}, {}, {}], levels: [{}, {}] });