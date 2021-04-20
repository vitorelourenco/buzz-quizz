//replace body with something else later
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
  if (typeof(str)!=='string') return makeValidationObj(false, 'Input nao e uma string');
  if (!(/^(http:\/\/)/.test(str) || /^(https:\/\/)/.test(str))) return makeValidationObj(false, 'URL da imagem deve comecar com http:// ou https://');
  return makeValidationObj(true, str);
}

function validateTitle(str){
  if (typeof(str)!=='string') return makeValidationObj(false, 'Input nao e uma string');
  if (str.length < 20) return makeValidationObj(false, 'Titulo tem menos de 20 caracteres');
  if (str.length > 65) return makeValidationObj(false, 'Titulo tem mais de 65 caracteres');
  return makeValidationObj(true, str);
}

function validateQuestions(str){
  if (typeof(str)!=='string') return makeValidationObj(false, 'Input de Perguntas  nao e uma string');
  if (str === '') return makeValidationObj(false, 'Input de Perguntas nao e um numero inteiro');
  if (/\D/.test(str)) return makeValidationObj(false, 'Input de Perguntas nao e um numero inteiro');
  if (parseInt(str,10) < 3) return makeValidationObj(false, 'O quizz deve ter pelo menos 3 perguntas');
  return makeValidationObj(true, str);
}

function validateLevels(str){
  if (typeof(str) !== 'string') return makeValidationObj(false, 'Input de Niveis nao e uma string');
  if (str === '') return makeValidationObj(false, 'Input de Niveis nao e um numero inteiro');
  if (/\D/.test(str)) return makeValidationObj(false, 'Input de Niveis nao e um numero inteiro');
  if (parseInt(str, 10) < 2) return makeValidationObj(false, 'O quizz deve ter pelo menos 2 niveis');
  return makeValidationObj(true, str);
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

  const newQuizzObj = {title, image, questions: new Array(nQuestions), levels: new Array(nLevels)}

  buildNewQuizzPageQuestions(newQuizzObj);
}

function buildNewQuizzPageStart(){
  document.querySelector('BODY').innerHTML =
  `
  <section class="new-quizz">
    <h2>Comece pelo comeco</h2>
    <div class="input-group">
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
  console.log(newQuizzObj);
}

buildNewQuizzPageStart();