let currentQuestion = 0;

function getQuizz(id) {
    const promisse = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/buzzquizz/quizzes/" + id);
    promisse.then(buildQuizz);
}

function comparador() { 
	return Math.random() - 0.5; 
}

function buildQuizz(resposta) {
    const quizz = resposta.data;
    let element = document.querySelector(".page-container");
    element.innerHTML = `<div class="play-container"></div>`;
    element = document.querySelector(".play-container");
    element.innerHTML = `
      <div class="cover">
        <img src="${quizz.image}" alt="image cover">
        <div class="shadow"></div>
        <p>${quizz.title}</p>
      </div>`;
    quizz.questions.forEach(function(elem, i) {
        element.innerHTML += `
        <div class="question-section">
          <div style="background-color: ${elem.color}" class="question">
            <p>${elem.title}</p>
          </div>
          <div class="answer-section">
          </div>
        </div>`;
        let randozimedAnswers = elem.answers.slice();
        randozimedAnswers.sort(comparador);
        let answerElement = element.querySelectorAll(".answer-section")[i];
        randozimedAnswers.forEach(function(answer) {
            answerElement.innerHTML += `
            <div onclick='pickOption(pickAnswer, this, ".choice", ".question-section", ".play-container")'
            class="answer choice ${answer.isCorrectAnswer?"right-choice":"wrong-choice"}">
              <div class="img-wrapper">
                <img src="${answer.image}" alt="answer image">
              </div>
              <p>${answer.text}</p>
            </div>`;
        });
    });
}

// daqui pra baixo vitor

function pickOption(callback, domElem, targetSelector, headSelector, superSelector) {

    let headNode = domElem;
    while (!headNode.classList.contains(headSelector.replace('.', ''))) {
        if (headNode === document.body) break;
        headNode = headNode.parentNode;
    }

    let superNode = headNode;
    while (!headNode.classList.contains(superSelector.replace('.', ''))) {
        if (superNode === document.body) break;
        superNode = superNode.parentNode;
    }

    const headOptions = headNode.querySelectorAll(targetSelector);
    const superOptions = superNode.querySelectorAll(headSelector);

    callback(domElem, headOptions, superOptions, headNode, superNode, headSelector, targetSelector);
}

function pickAnswer(picked, arrChoices, arrQuestions, headNode, superNode, headSelector, targetSelector) {
    let callerIndex = 0;
    while (arrQuestions[callerIndex] !== headNode) {
        callerIndex++;
        if (callerIndex == 1000) break;
    }

    const callerQuestion = arrQuestions[callerIndex];
    if (callerQuestion.querySelector('.picked') !== null) return;

    arrChoices.forEach(choice => choice.classList.add('revealed'));
    picked.classList.add('picked');

    goToNextQuestion(callerIndex, arrQuestions);
}

function goToNextQuestion(callerIndex, arrQuestions) {
    const quizzStatusList = [];
    arrQuestions.forEach(question => {
        const picked = question.querySelector('.picked');
        const status = picked !== null ? 1 : 0;
        quizzStatusList.push(status);
    });

    if (quizzStatusList.indexOf(0) === -1) {
        console.log('the end');
        endQuizz();
        return;
    }

    const ahead = quizzStatusList.slice(callerIndex, );
    const nextAhead = ahead.indexOf(0);
    const nextBehind = quizzStatusList.indexOf(0);

    let targetElement;
    if (nextAhead !== -1) {
        targetElement = arrQuestions[callerIndex + nextAhead].querySelector('.question');
    } else {
        targetElement = arrQuestions[nextBehind].querySelector('.question');
    }

    scrollQuizz(targetElement, 2000)
}

function endQuizz() {

}

getQuizz(1);