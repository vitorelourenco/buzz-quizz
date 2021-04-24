let currentQuestion = 0;
let quizz;

function getQuizz(id) {
    //this line should be scrolling the page up, in case you clicked the button to play again, which is in the end of the page.
    const promisse = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/buzzquizz/quizzes/" + id);
    promisse.then(buildQuizz);
    toggleLoading();
}

function comparador() {
    return Math.random() - 0.5;
}

function buildQuizz(resposta) {
    quizz = resposta.data;
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
    scrollQuizz(container, 0);
}

//this is an overly complicated function that takes several parameters
//its meant to be a generic way to handle that kind of ~pick one~ job
//ill work more on it later, it calls another function that doesnt even use all
//the parameters available 
//goal here is to have a generic ~pick one~ function that also accepts a callback
//and figures out groups of possible selections and then runs the callback
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

//and this is the callback
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

//the code will look for the next unanswered question
//maybe the user skipped all questions and answered the last one first?
//well in that case the next unaswered would be the first question
//it does this through the quizzStatusList[] array and checking zeros and ones
//zero not answered , one answered
function goToNextQuestion(callerIndex, arrQuestions) {
    const quizzStatusList = [];
    arrQuestions.forEach(question => {
        const picked = question.querySelector('.picked');
        const status = picked !== null ? 1 : 0;
        quizzStatusList.push(status);
    });

    if (quizzStatusList.indexOf(0) === -1) {
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
    // console.log(quizz.levels);
    let idLevel = 0;
    const nCorrectAnswers = document.querySelectorAll(".picked.right-choice").length;
    const nQuestions = quizz.questions.length;
    const score = Math.round((100 / nQuestions) * nCorrectAnswers);
    const element = document.querySelector(".play-container");

    let threshold = 0;
    quizz.levels.forEach(function(level, i) {
        if (score >= level.minValue && level.minValue >= threshold) {
            threshold = level.minValue;
            idLevel = i;
        }
    });

    element.innerHTML += `
        <div class="score-section">
            <div class="level-title">
                <p>${score}% de acerto: ${quizz.levels[idLevel].title}</p>
            </div>
            <div class="level-image">
                <img src="${quizz.levels[idLevel].image}" alt="score result image">
            </div>
            <div class="level-description">
                <p>${quizz.levels[idLevel].text}</p>
            </div>
        </div>
        <button class="go-to-quizz" onclick="getQuizz(${quizz.id})">Reiniciar Quiz</button>
        <button class="back-to-home" onclick="buildHomePage()">Voltar para home</button>
        `;
    const scoreSection = document.querySelector('.score-section');
    scrollQuizz(scoreSection, 2000);
}

// getQuizz(1);