let newQuizzObj;

function toggleCollapsed(elem){
  const parent = elem.parentNode;
  parent.classList.toggle('collapsed');
}

function handleStartSubmit(){
  objNewStart = document.querySelector('.new-quizz');

  const title = objNewStart.querySelector('.new-quizz-title').value;
  const image = objNewStart.querySelector('.new-quizz-image').value;
  const strQuestions = objNewStart.querySelector('.new-quizz-nQuestions').value;
  const strLevels  = objNewStart.querySelector('.new-quizz-nLevels').value;

  if (checkStartInput(title, image, strQuestions, strLevels) === false) return ;

  const nQuestions = parseInt(strQuestions, 10);
  const nLevels = parseInt(strLevels, 10);

  newQuizzObj = {title, image, questions: new Array(nQuestions), levels: new Array(nLevels)};

  buildNewQuizzPageQuestions();
}

function handleQuestionsSubmit(){
  const objNewQuestions = document.querySelector('.new-quizz');
  const questions = objNewQuestions.querySelectorAll('.collapsible');

  if (checkQuestionsInput(questions) === false) return;

  for (let i=0; i<questions.length;i++){
    const question = {};

    question.title = questions[i].querySelector('.question-title').value;
    question.image = questions[i].querySelector('.question-background').value;

    const answers = questions[i].querySelectorAll('.question-answer');
    const images = questions[i].querySelectorAll('.question-image');
    question.answers = [{text: answers[0].value, image: images[0].value, isCorrectAnswer: true }];
    
    for (let j=1; j<4; j++){
      if (answers[j].value !== ''){
        question.answers.push({text: answers[j].value, image: images[j].value, isCorrectAnswer: false })
      }
    }

    newQuizzObj.questions[i] = question;
  }

  buildNewQuizzPageLevels();
}

function handleLevelsSubmit(){

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

function buildNewQuizzPageQuestions(){
  //replace test with the approptiate div later
  const container = document.querySelector('.test');
  container.innerHTML = 
  `
  <section class="new-quizz">
    <h2>Crie suas perguntas</h2>
  </section>
  `;

  const section = container.querySelector('SECTION');
  for (let i=0; i<newQuizzObj.questions.length; i++){
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
  }

  section.innerHTML += `<button onclick='handleQuestionsSubmit()'>Prosseguir para criar niveis</button>`
  container
  .querySelector('.collapsed')
  .classList
  .remove('collapsed');
}

function buildNewQuizzPageLevels(){
  //replace test with the approptiate div later
  const container = document.querySelector('.test');
  container.innerHTML = 
  `
  <section class="new-quizz">
    <h2>Agora, decida os niveis!</h2>
  </section>
  `;

  const section = container.querySelector('SECTION');
  // for (let i=0; i<newQuizzObj.questions.length; i++){
  for (let i=0; i<2; i++){
    section.innerHTML +=
    `
      <div class="input-group collapsed">
        <header onclick='toggleCollapsed(this)'>
          <h3>Nivel ${i+1}</h3>
          <ion-icon name="aperture-outline"></ion-icon>
        </header>
        <div class="collapsible">
          <input class="level-title" type="text" placeholder="Titulo do nivel">
          <input class="level-percentage" type="text" placeholder="% de acerto minima">
          <input class="level-image" type="text" placeholder="URL da imagem do nivel">
          <textarea class="level-description" type="text" placeholder="Descricao do nivel"></textarea>
        </div>
      </div>
    `
  }

  section.innerHTML += `<button onclick='handleLevelsSubmit()'>Finalizar Quizz</button>`
  container
  .querySelector('.collapsed')
  .classList
  .remove('collapsed');
}

// buildNewQuizzPageStart();
buildNewQuizzPageLevels();
// buildNewQuizzPageQuestions({title: 1, image: 1, questions: [1,2,3], levels: [1,2,3]})