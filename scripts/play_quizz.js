function getQuizz(id) {
    const promisse = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/buzzquizz/quizzes/" + id);
    promisse.then(buildQuizz);
}

function buildQuizz(resposta) {
    const quizz = resposta.data;
    let element = document.querySelector(".page-container");
    element.innerHTML = `<div class="play-container"></div>`;
    element = document.querySelector(".play-container");
    element.innerHTML = `<div class="cover">
        <img src="${quizz.image}" alt="image cover">
        <div class="shadow"></div>
        <p>${quizz.title}</p>
      </div>`;
    quizz.questions.forEach(function(elem) {
        element.innerHTML += `<div class="question-section">
        <div class="question"><p>${elem.title}</p></div>
        <div
    </div>`;
    });
}

getQuizz(1);