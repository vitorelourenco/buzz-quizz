function validate(callback, objSource, str){
  const arrErr = callback(str);
  divErr = objSource.nextElementSibling;
  divErr.innerHTML = "";
  if (arrErr.length !== 0){
    objSource.classList.add('error-field')
    arrErr.forEach((err)=>{
      divErr.innerHTML+=`<p class="error-message">${err}</p>`
    })
    return false;
  }
  objSource.classList.remove('error-field');
  return true;
}

function factoryURL(str){
  const arrErr = [];
  const urlRegexp =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
  if (!urlRegexp.test(str)) arrErr.push('URL da imagem deve ser valida');
  return arrErr;
}

function factoryTitle(str){
  const arrErr = [];
  if (str.length < 20) arrErr.push('Titulo tem menos de 20 caracteres');
  if (str.length > 65) arrErr.push('Titulo tem mais de 65 caracteres');
  return arrErr;
}

function factoryQuestions(str){
  const arrErr = [];
  if (str === '') {
    arrErr.push('Numero de Perguntas esta vazio');
    arrErr.push('Numero de Perguntas nao e um numero inteiro');
    arrErr.push('O quizz deve ter pelo menos 3 perguntas');
    return arrErr;
  }
  if (/\D/.test(str)) arrErr.push('Numero de Perguntas nao e um numero inteiro');
  if (parseInt(str,10) < 3) arrErr.push('O quizz deve ter pelo menos 3 perguntas');
  return arrErr;
}

function factoryLevels(str){
  const arrErr = [];
  if (str === '') {
    arrErr.push('Numero de Niveis esta vazio');
    arrErr.push('Numero de Niveis nao e um numero inteiro');
    arrErr.push('O quizz deve ter pelo menos 2 niveis');
    return arrErr;
  }
  if (/\D/.test(str)) arrErr.push('Numero de Niveis nao e um numero inteiro');
  if (parseInt(str, 10) < 2) arrErr.push('O quizz deve ter pelo menos 2 niveis');
  return arrErr;
}

function factoryQuestionText(str){
  const arrErr = [];
  if (str.length < 20) arrErr.push('Texto da pergunta tem menos de 20 caracteres');
  return arrErr;
}

function factoryQuestionColor(str){
  const arrErr = [];
  if (!/^#[a-f0-9]{6}$/i.test(str)) arrErr.push('Cor invalida, formato esperado: #xxxxxx');
  return arrErr;
}

function factoryQuestionAnswer(str){
  const arrErr = [];
  if (str === '') arrErr.push('Texto esta vazio');
  return arrErr;
}

function factoryFakeAnswerCount(int){
  const arrErr = [];
  if (int === 3) arrErr.push('Preencha pelo menos uma resposta incorreta');
  return arrErr;
}

function factoryLevelTitle(str){
  const arrErr = [];
  if (str.length < 10) arrErr.push('Titulo do nivel tem menos de 10 caracteres');
  return arrErr;
}

function factoryPercentage(str){
  const arrErr = [];
  if (str === '') {
    arrErr.push('Campo de porcentagem esta vazio');
    arrErr.push('Porcentagem deve ser um numero inteiro');
    arrErr.push('A porcentagem deve ser entre 0 e 100');
    return arrErr;
  }
  if (/\D/.test(str)) arrErr.push('Porcentagem deve ser um numero inteiro');
  if (parseInt(str, 10) < 0 || parseInt(str, 10) > 100) arrErr.push('A porcentagem deve ser entre 0 e 100');
  return arrErr;
}

function factoryDescription(str){
  const arrErr = [];
  if (str.length < 30) arrErr.push('Descricao tem menos de 30 caracteres');
  return arrErr;
}

function factoryZeroPercentageCount(bol){
  const arrErr = [];
  if (bol === false) arrErr.push('Ao menos um nivel deve ter porcentagem minima 0');
  return arrErr;
}

function checkStartInput(objTitle, objImage, objQuestions, objLevels){
  let failed = false;
  if (!validate(factoryTitle, objTitle, objTitle.value)) failed = true;
  if (!validate(factoryURL, objImage, objImage.value)) failed = true;
  if (!validate(factoryQuestions, objQuestions, objQuestions.value)) failed = true;
  if (!validate(factoryLevels, objLevels, objLevels.value)) failed = true;
  return failed ? false : true;
}

function checkQuestionCore(objText, objColor, objAnswerText, objAnswerImage){
  let failed = false;
  if (!validate(factoryQuestionText, objText, objText.value)) failed = true;
  if (!validate(factoryQuestionColor, objColor, objColor.value)) failed = true;
  if (!validate(factoryQuestionAnswer, objAnswerText, objAnswerText.value)) failed = true;
  if (!validate(factoryURL, objAnswerImage, objAnswerImage.value)) failed = true;
  return failed ? false : true;
}

function checkQuestionFakeAnswer(objAnswer, objImage){
  let failed = false;
  if (!validate(factoryQuestionAnswer, objAnswer, objAnswer.value)) failed = true;
  if (!validate(factoryURL, objImage, objImage.value)) failed = true;
  return failed ? false : true;
}

function checkQuestionsInput(questions){
  let passed = true;
  for (let i=0; i<questions.length;i++){
    const objText = questions[i].querySelector('.question-title');
    const objColor = questions[i].querySelector('.question-background');
    const objAnswerText = questions[i].querySelector('.question-answer');
    const objAnswerImage = questions[i].querySelector('.question-image');

    passed = checkQuestionCore(objText, objColor, objAnswerText, objAnswerImage) && passed;

    const objAnswers = questions[i].querySelectorAll('.question-answer');
    const objImages = questions[i].querySelectorAll('.question-image');

    let emptyCount = 0;
    for (let j=1; j<4; j++){
      if (objAnswers[j].value === '' && objImages[j].value === ''){
        emptyCount++;
      } else {
        passed = checkQuestionFakeAnswer(objAnswers[j], objImages[j]) && passed;
      }
    }

    if (emptyCount === 3){
      passed = false;
      objAnswers[1].classList.add('error-field');
      objImages[1].classList.add('error-field');
      objAnswers[1].nextElementSibling.innerHTML = `<p class="error-message">Preencha pelo menos uma resposta incorreta</p>`;
      objImages[1].nextElementSibling.innerHTML = `<p class="error-message">Preencha pelo menos uma resposta incorreta</p>`;
    }
  }
  return passed ? true : false;
}

function checkLevelInput(objTitle, objPercentage, objImage, objDescription){
  let failed = false;
  if (!validate(factoryLevelTitle, objTitle, objTitle.value)) failed = true;
  if (!validate(factoryPercentage, objPercentage, objPercentage.value)) failed = true;
  if (!validate(factoryURL, objImage, objImage.value)) failed = true;
  if (!validate(factoryDescription, objDescription, objDescription.value)) failed = true;
  return failed ? false : true;
}

function checkLevelsInput(levels){
  let passed = true;
  let foundZero = false;
  for (let i=0;i<levels.length;i++){
    const objTitle = levels[i].querySelector('.level-title');
    const objPercentage = levels[i].querySelector('.level-percentage');
    const objImage = levels[i].querySelector('.level-image');
    const objDescription = levels[i].querySelector('.level-description');
    passed = checkLevelInput(objTitle, objPercentage, objImage, objDescription) && passed;
    if (objPercentage.value === '0') foundZero = true;
  }
  if (!foundZero){
    passed = false;
    levels.forEach(level => {
      percentageField = level.querySelector('.level-percentage');
      percentageField.classList.add('error-field');
      divErr = percentageField.nextElementSibling;
      const errRegex = /<p class="error-message">Ao menos um nivel deve ter porcentagem minima 0<\/p>/;
      if (!errRegex.test(divErr.innerHTML)){
        divErr.innerHTML += `<p class="error-message">Ao menos um nivel deve ter porcentagem minima 0</p>`;
      }
    });  
  }
  return passed ? true : false;
}
