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
    // i think it makes more sense for a function that uses .all-quizzes  
    // to execute only after .all-quizzes is created regardless of async safety
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

buildHomePage(false);