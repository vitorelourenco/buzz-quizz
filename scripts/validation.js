function makeValidationObj(bol, str){
  return {isValid: bol, text: str}
}

function validate(callback, strValidationType, strSource){
  const validationObj = callback(strValidationType);
  if (!validationObj.isValid){
    if (strSource !== undefined){
      alert(`${strSource} : ${validationObj.text}`);
    } else {
      alert(`${validationObj.text}`);
    }
    return false;
  }
  return true;
}

function factoryURL(str){
  if (typeof(str)!=='string') return makeValidationObj(false, 'invalid input source');
  if (!(/^(http:\/\/)/.test(str) || /^(https:\/\/)/.test(str))) return makeValidationObj(false, 'URL da imagem deve comecar com http:// ou https://');
  return makeValidationObj(true, str);
}

function factoryTitle(str){
  if (typeof(str)!=='string') return makeValidationObj(false, 'invalid input source');
  if (str.length < 20) return makeValidationObj(false, 'Titulo tem menos de 20 caracteres');
  if (str.length > 65) return makeValidationObj(false, 'Titulo tem mais de 65 caracteres');
  return makeValidationObj(true, str);
}

function factoryQuestions(str){
  if (typeof(str)!=='string') return makeValidationObj(false, 'invalid input source');
  if (str === '') return makeValidationObj(false, 'Numero de Perguntas esta vazio');
  if (/\D/.test(str)) return makeValidationObj(false, 'Numero de Perguntas nao e um numero inteiro');
  if (parseInt(str,10) < 3) return makeValidationObj(false, 'O quizz deve ter pelo menos 3 perguntas');
  return makeValidationObj(true, str);
}

function factoryLevels(str){
  if (typeof(str) !== 'string') return makeValidationObj(false, 'invalid input source');
  if (str === '') return makeValidationObj(false, 'Numero de Niveis esta vazio');
  if (/\D/.test(str)) return makeValidationObj(false, 'Numero de Niveis nao e um numero inteiro');
  if (parseInt(str, 10) < 2) return makeValidationObj(false, 'O quizz deve ter pelo menos 2 niveis');
  return makeValidationObj(true, str);
}

function factoryQuestionText(str){
  if (typeof(str)!=='string') return makeValidationObj(false, 'invalid input source');
  if (str.length < 20) return makeValidationObj(false, 'Texto da pergunta tem menos de 20 caracteres');
  return makeValidationObj(true, str);
}

function factoryQuestionColor(str){
  if (typeof(str)!=='string') return makeValidationObj(false, 'invalid input source');
  if (!/^#[a-f0-9]{6}$/i.test(str)) return makeValidationObj(false, 'Cor invalida, formato esperado: #xxxxxx');
  return makeValidationObj(true, str);
}

function factoryQuestionAnswer(str){
  if (typeof(str)!=='string') return makeValidationObj(false, 'invalid input source');
  if (str === '') return makeValidationObj(false, 'Texto esta vazio');
  return makeValidationObj(true, str);
}

function factoryFakeAnswerCount(int){
  if (!Number.isInteger(int)) return makeValidationObj(false, 'invalid input source');
  if (int === 3) return makeValidationObj(false, 'Preencha pelo menos uma resposta incorreta');
  return makeValidationObj(true, `${int}`);
}

function factoryLevelTitle(str){
  if (typeof(str)!=='string') return makeValidationObj(false, 'invalid input source');
  if (str.length < 10) return makeValidationObj(false, 'Titulo do nivel tem menos de 10 caracteres');
  return makeValidationObj(true, str);
}

function factoryPercentage(str){
  if (typeof(str) !== 'string') return makeValidationObj(false, 'invalid input source');
  if (str === '') return makeValidationObj(false, 'Campo de porcentagem esta vazio');
  if (/\D/.test(str)) return makeValidationObj(false, 'Porcentagem deve ser um numero inteiro');
  if (parseInt(str, 10) < 0 || parseInt(str, 10) > 100) return makeValidationObj(false, 'A porcentagem deve ser entre 0 e 100');
  return makeValidationObj(true, str);
}

function factoryDescription(str){
  if (typeof(str)!=='string') return makeValidationObj(false, 'invalid input source');
  if (str.length < 30) return makeValidationObj(false, 'Descricao tem menos de 30 caracteres');
  return makeValidationObj(true, str);
}

function factoryZeroPercentageCount(bol){
  if (typeof(bol) !== 'boolean') return makeValidationObj(false, 'invalid input source');
  if (bol === false) return makeValidationObj(false, 'Ao menos um nivel deve ter porcentagem minima 0');
  return makeValidationObj(true, `${bol}`);
}

function checkStartInput(title, image, strQuestions, strLevels){
  if (!validate(factoryTitle, title)) return false;
  if (!validate(factoryURL, image)) return false;
  if (!validate(factoryQuestions, strQuestions)) return false;
  if (!validate(factoryLevels, strLevels)) return false;
  return true;
}

function checkQuestionCore(i, questionText, questionColor, questionAnswerText, questionAnswerImage){
  if (!validate(factoryQuestionText, questionText, `Pergunta ${i+1}`)) return false;
  if (!validate(factoryQuestionColor, questionColor, `Pergunta ${i+1}`)) return false;
  if (!validate(factoryQuestionAnswer, questionAnswerText, `Pergunta ${i+1} (Resposta correta)`)) return false;
  if (!validate(factoryURL, questionAnswerImage, `Pergunta ${i+1} (Resposta correta)`)) return false;
  return true;
}

function checkQuestionFakeAnswer(i, j, answer, image){
  if (!validate(factoryQuestionAnswer, answer, `Pergunta ${i+1} (Resposta incorreta ${j})`)) return false;
  if (!validate(factoryURL, image, `Pergunta ${i+1} (Resposta incorreta ${j})`)) return false;
  return true;
}

function checkQuestionsInput(questions){
  for (let i=0; i<questions.length;i++){
    const questionText = questions[i].querySelector('.question-title').value;
    const questionColor = questions[i].querySelector('.question-background').value;
    const questionAnswerText = questions[i].querySelector('.question-answer').value;
    const questionAnswerImage = questions[i].querySelector('.question-image').value;

    if (checkQuestionCore(i, questionText, questionColor, questionAnswerText, questionAnswerImage) === false) return false;

    const answers = questions[i].querySelectorAll('.question-answer');
    const images = questions[i].querySelectorAll('.question-image');

    let emptyCount = 0;
    for (let j=1; j<4; j++){
      if (answers[j].value === '' && images[j].value === ''){
        emptyCount++;
      } else {
        if (checkQuestionFakeAnswer(i, j, answers[j].value, images[j].value) === false) return false;
      } 
    }

    if (!validate(factoryFakeAnswerCount, emptyCount, `Pergunta ${i+1}`)) return false;
  }
  return true;
}

function checkLevelInput(i, levelTitle, levelPercentage, levelImage, levelDescription){
  if (!validate(factoryLevelTitle, levelTitle, `Nivel ${i+1}`)) return false;
  if (!validate(factoryPercentage, levelPercentage, `Nivel ${i+1}`)) return false;
  if (!validate(factoryURL, levelImage, `Nivel ${i+1}`)) return false;
  if (!validate(factoryDescription, levelDescription, `Nivel ${i+1}`)) return false;
}

function checkLevelsInput(levels){
  let foundZero = false;
  for (let i=0;i<levels.length;i++){
    const levelTitle = levels[i].querySelector('.level-title').value;
    const levelPercentage = levels[i].querySelector('.level-percentage').value;
    const levelImage = levels[i].querySelector('.level-image').value;
    const levelDescription = levels[i].querySelector('.level-description').value;
    if (checkLevelInput(i, levelTitle, levelPercentage, levelImage, levelDescription) === false) return false;
    if (levelPercentage === '0') foundZero = true;
  }
  if (!validate(factoryZeroPercentageCount, foundZero)) return false;
  return true;
}
