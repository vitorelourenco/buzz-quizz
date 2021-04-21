function getQuizz(id) {
    const promisse = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/buzzquizz/quizzes/" + id);
    promisse.then(buildQuizz);
}

function buildQuizz(resposta) {
    const quizz = resposta.data;
    const element = document.querySelector(".page-container");
    element.innerHTML = `<div class="page-container">
      <div class="cover">
        <img src="${quizz.image}" alt="image cover">
        <p>${quizz.title}</p>
      </div>`;
    quizz.forEach(quizz.questions => {
        element.innerHTML += `<div class="question-section">
        <div class="question"><p>${quizz.questions[i].title}</p></div>
      </div>;`
    });
    // em construção... fiquei com sono rsrs
}