let currentQuestion = 0;

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
    quizz.questions.forEach(function (elem){
        element.innerHTML += `<div class="question-section">
        <div class="question"><p>${elem.title}</p></div>
      </div>`;
    });
    // em construção... fiquei com sono rsrs
}

function pickOption(callback, domElem, targetSelector, headSelector, superSelector){
  let headNode = domElem;
  while (!headNode.classList.contains(headSelector)) {
    if (headNode === document.body) break;
    headNode = headNode.parentNode;
  }

  let superNode = headNode;
  while (!headNode.classList.contains(superSelector)) {
    if (superNode === document.body) break;
    superNode = headNode.parentNode;
  }

  const headOptions = headNode.querySelectorAll(targetSelector);
  const superOptions = superNode.querySelectorAll(headSelector);

  callback(domElem, headOptions, superOptions, headNode, superNode, headSelector, targetSelector);
}

function pickAnswer(picked, arrChoices, arrQuestions, headNode, superNode, headSelector, targetSelector){

  const callerIndex = arrQuestions.indexOf(headNode);
  const callerQuestion = arrQuestions[callerIndex];
  if (callerQuestion.querySelector('.picked') !== null) return;

  arrChoices.forEach(choice => choice.classList.add('revealed'));
  picked.classList.add('picked');

  goToNextQuestion(callerIndex, arrQuestions);
}

function goToNextQuestion(callerIndex, arrQuestions){
  const quizzStatusList = [];
  arrQuestions.forEach(question => {
    const picked = question.querySelector('.picked');
    const status = picked !== null ? 1 : 0;
    quizzStatusList.push(status);
  });

  if (quizzStatusList.indexOf(0) === -1){
    endQuizz();
    return;
  }

  const ahead = quizzStatusList.slice(callerIndex,);
  const nextAhead = ahead.indexOf(0);
  const nextBehind = quizzStatusList.indexOf(0);

  if (nextAhead !== -1){
    scrollQuizz(arrQuestions[nextAhead],2000)
  } else {
    scrollQuizz(arrQuestions[nextBehind],2000)
  }
}
