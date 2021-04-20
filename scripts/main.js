let newQuizzObj;

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

function validateURL(str){
  if (typeof(str)!=='string') return makeValidationObj(false, 'ERR: invalid input source');
  if (!(/^(http:\/\/)/.test(str) || /^(https:\/\/)/.test(str))) return makeValidationObj(false, 'URL da imagem deve comecar com http:// ou https://');
  return makeValidationObj(true, str);
}

function validateTitle(str){
  if (typeof(str)!=='string') return makeValidationObj(false, 'ERR: invalid input source');
  if (str.length < 20) return makeValidationObj(false, 'Titulo tem menos de 20 caracteres');
  if (str.length > 65) return makeValidationObj(false, 'Titulo tem mais de 65 caracteres');
  return makeValidationObj(true, str);
}

function validateQuestions(str){
  if (typeof(str)!=='string') return makeValidationObj(false, 'ERR: invalid input source');
  if (str === '') return makeValidationObj(false, 'Numero de Perguntas esta vazio');
  if (/\D/.test(str)) return makeValidationObj(false, 'Numero de Perguntas nao e um numero inteiro');
  if (parseInt(str,10) < 3) return makeValidationObj(false, 'O quizz deve ter pelo menos 3 perguntas');
  return makeValidationObj(true, str);
}

function validateLevels(str){
  if (typeof(str) !== 'string') return makeValidationObj(false, 'ERR: invalid input source');
  if (str === '') return makeValidationObj(false, 'Numero de Niveis esta vazio');
  if (/\D/.test(str)) return makeValidationObj(false, 'Numero de Niveis nao e um numero inteiro');
  if (parseInt(str, 10) < 2) return makeValidationObj(false, 'O quizz deve ter pelo menos 2 niveis');
  return makeValidationObj(true, str);
}

function validateQuestionText(str){
  if (typeof(str)!=='string') return makeValidationObj(false, 'ERR: invalid input source');
  if (str.length < 20) return makeValidationObj(false, 'Texto da pergunta tem menos de 20 caracteres');
  return makeValidationObj(true, str);
}

function validateQuestionColor(str){
  if (typeof(str)!=='string') return makeValidationObj(false, 'ERR: invalid input source');
  if (!/^#[a-f0-9]{6}$/i.test(str)) return makeValidationObj(false, 'Cor invalida, formato esperado: #xxxxxx');
  return makeValidationObj(true, str);
}

function validateQuestionAnswer(str){
  if (typeof(str)!=='string') return makeValidationObj(false, 'ERR: invalid input source');
  if (str === '') return makeValidationObj(false, 'Texto esta vazio');
  return makeValidationObj(true, str);
}

function toggleCollapsed(elem){
  const parent = elem.parentNode;
  parent.classList.toggle('collapsed');
}

function handleStartSubmit(){
  objNewStart = document.querySelector('.new-quizz');

  const title = objNewStart.querySelector('.new-quizz-title').value;
  if (!validate(validateTitle, title)) return;

  const image = objNewStart.querySelector('.new-quizz-image').value;
  if (!validate(validateURL, image)) return;

  const strQuestions = objNewStart.querySelector('.new-quizz-nQuestions').value;
  if (!validate(validateQuestions, strQuestions)) return;

  const strLevels  = objNewStart.querySelector('.new-quizz-nLevels').value;
  if (!validate(validateLevels, strLevels)) return;

  const nQuestions = parseInt(strQuestions, 10);
  const nLevels = parseInt(strLevels, 10);

  newQuizzObj = {title, image, questions: new Array(nQuestions), levels: new Array(nLevels)}

  buildNewQuizzPageQuestions(newQuizzObj);
}

function handleQuestionsSubmit(){
  objNewQuestions = document.querySelector('.new-quizz');

  const questions = objNewQuestions.querySelectorAll('.collapsible');

  
  for (let i=0; i<questions.length;i++){
    const questionText = questions[i].querySelector('.question-title').value;
    if (!validate(validateQuestionText, questionText, `err Pergunta ${i+1}`)) return;

    const questionColor = questions[i].querySelector('.question-background').value;
    if (!validate(validateQuestionColor, questionColor, `err Pergunta ${i+1}`)) return;

    const questionAnswerText = questions[i].querySelector('.question-answer').value;
    if (!validate(validateQuestionAnswer, questionAnswerText, `err Pergunta ${i+1} (Resposta correta)`)) return;

    const questionAnswerImage = questions[i].querySelector('.question-image').value;
    if (!validate(validateURL, questionAnswerImage, `err Pergunta ${i+1} (Resposta correta)`)) return;

    const answers = questions[i].querySelectorAll('.question-answer');
    const images = questions[i].querySelectorAll('.question-image');

    for (let j=1; j<3; j++){

    }
    
  }

}

function buildNewQuizzPageStart(){
  //replace test with the approptiate div later
  const container = document.querySelector('.test');
  container.innerHTML =
  `
  <section class="new-quizz">
    <h2>Comece pelo comeco</h2>
    <div class="input-group padding-20">
        <input class="new-quizz-title" type="text" placeholder="Titulo do seu quizz">
        <input class="new-quizz-image" type="text" placeholder="URL da imagem do seu quizz">
        <input class="new-quizz-nQuestions" type="text" placeholder="Quantidade de perguntas do quizz">
        <input class="new-quizz-nLevels" type="text" placeholder="Quantidade de niveis do quizz">
    </div>
    <button onclick='handleStartSubmit()'>Prosseguir para criar perguntas</button>
  </section>
  `
}

function buildNewQuizzPageQuestions(newQuizzObj){
  //replace test with the approptiate div later
  const container = document.querySelector('.test');
  container.innerHTML = 
  `
  <section class="new-quizz">
    <h2>Crie suas perguntas</h2>
  </section>
  `;

  const section = container.querySelector('SECTION');
  newQuizzObj.questions.forEach((elem,i)=>{
    section.innerHTML +=
    `
      <div class="input-group collapsed">
        <header onclick='toggleCollapsed(this)'>
          <h3>Pergunta ${i+1}</h3>
          <ion-icon name="aperture-outline"></ion-icon>
        </header>
        <div class="collapsible">
          <input class="question-title" type="text" placeholder="Texto da pergunta">
          <input class="question-background" type="text" placeholder="Cor de fundo da pergunta">
          <h3>Resposta correta</h3>
          <input class="question-answer" type="text" placeholder="Resposta correta">
          <input class="question-image" type="text" placeholder="URL da imagem">
          <h3>Respostas incorretas</h3>
          <input class="question-answer" type="text" placeholder="Resposta incorreta 1">
          <input class="question-image" type="text" placeholder="URL da imagem 1">
          <input class="question-answer" type="text" placeholder="Resposta incorreta 2">
          <input class="question-image" type="text" placeholder="URL da imagem 2">
          <input class="question-answer" type="text" placeholder="Resposta incorreta 3">
          <input class="question-image" type="text" placeholder="URL da imagem 3">
        </div>
      </div>
    `
  });

  section.innerHTML += `<button onclick='handleQuestionsSubmit()'>Prosseguir para criar niveis</button>`
  container
  .querySelector('.collapsed')
  .classList
  .remove('collapsed');
}

// buildNewQuizzPageStart();
buildNewQuizzPageQuestions({title: 1, image: 1, questions: [1,2,3], levels: [1,2,3]})
