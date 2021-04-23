let newQuizzObj;
let idList = [];

function selectUnique(domElem, headSelector) {
    const headNode = document.querySelector(headSelector);

    if (headNode.querySelector('.input-group:not(.collapsed)') !== null) {
        const oldSelected = headNode.querySelector('.input-group:not(.collapsed)');
        oldSelected.classList.add('collapsed');
    }

    let currentNode = domElem;
    while (!currentNode.classList.contains('input-group')) {
        currentNode = currentNode.parentNode;
    }
    currentNode.classList.remove('collapsed');
    scrollQuizz(currentNode, 520);
}

function handleStartSubmit() {
    function getArrQuestions(){
        const arrQuestions = [];
        let k = 0;
        if (objNewStart.hasOwnProperty('questions')){
            while (k < objNewStart.questions.length){
                arrQuestions.push(objNewStart.questions[k]);
                k++;
            }
        }
    
        while (k < nQuestions){
            arrQuestions.push({});
            k++;
        }
        return arrQuestions;
    }

    function getArrLevels(){
        const arrLevels = [];
        let k = 0;
        if (objNewStart.hasOwnProperty('levels')){
            while (k < objNewStart.levels.length){
                arrLevels.push(objNewStart.levels[k]);
                k++;
            }
        }
    
        while (k < nLevels){
            arrLevels.push({});
            k++;
        }
        return arrLevels;
    }

    objNewStart = document.querySelector('.new-quizz');

    const title = objNewStart.querySelector('.new-quizz-title');
    const image = objNewStart.querySelector('.new-quizz-image');
    const strQuestions = objNewStart.querySelector('.new-quizz-nQuestions');
    const strLevels = objNewStart.querySelector('.new-quizz-nLevels');

    if (checkStartInput(title, image, strQuestions, strLevels) === false) return;

    const nQuestions = parseInt(strQuestions, 10);
    const nLevels = parseInt(strLevels, 10);

    newQuizzObj = { title, image, questions: getArrQuestions(), levels: getArrLevels() };

    buildNewQuizzPageQuestions();
}

function handleQuestionsSubmit() {
    const objNewQuestions = document.querySelector('.new-quizz');
    const questions = objNewQuestions.querySelectorAll('.collapsible');

    if (checkQuestionsInput(questions) === false) return;

    for (let i = 0; i < questions.length; i++) {
        const question = {};

        question.title = questions[i].querySelector('.question-title').value;
        question.color = questions[i].querySelector('.question-background').value;

        //populating with the correct answer
        const answers = questions[i].querySelectorAll('.question-answer');
        const images = questions[i].querySelectorAll('.question-image');
        question.answers = [{ text: answers[0].value, image: images[0].value, isCorrectAnswer: true }];

        //populating with the wrong answers
        for (let j = 1; j < 4; j++) {
            if (answers[j].value !== '') {
                question.answers.push({ text: answers[j].value, image: images[j].value, isCorrectAnswer: false })
            }
        }

        newQuizzObj.questions[i] = question;
    }

    buildNewQuizzPageLevels();
}

function handleLevelsSubmit() {
    const objNewQuestions = document.querySelector('.new-quizz');
    const levels = objNewQuestions.querySelectorAll('.collapsible');

    if (checkLevelsInput(levels) === false) return;

    for (let i = 0; i < levels.length; i++) {
        const level = {};
        level.title = levels[i].querySelector('.level-title').value;
        level.image = levels[i].querySelector('.level-image').value;
        level.text = levels[i].querySelector('.level-description').value;
        level.minValue = parseInt(levels[i].querySelector('.level-percentage').value, 10);
        newQuizzObj.levels[i] = level;
    }

    axios
        .post('https://mock-api.bootcamp.respondeai.com.br/api/v2/buzzquizz/quizzes', newQuizzObj)
        .then(({ data }) => {
            buildNewQuizzPageDone(data.id);
        })
        .catch((error) => {
            alert(`error ${error.response.status}`);
        })
}


function buildNewQuizzPageStart(id) {
    function buildHTML(){
        container.innerHTML =
        `
        <section class="new-quizz">
        <h2>Comece pelo comeco</h2>
        <div class="input-group padding-20">
            <input class="new-quizz-title" type="text" placeholder="Titulo do seu quizz">
            <div></div>
            <input class="new-quizz-image" type="text" placeholder="URL da imagem do seu quizz">
            <div></div>
            <input class="new-quizz-nQuestions" type="text" placeholder="Quantidade de perguntas do quizz">
            <div></div>
            <input class="new-quizz-nLevels" type="text" placeholder="Quantidade de niveis do quizz">
            <div></div>
        </div>
        <button onclick='handleStartSubmit()'>Prosseguir para criar perguntas</button>
        </section>
        `;
        scrollQuizz(container, 0);
    }

    if (id === -1) {
        newQuizzObj = {};
        buildHTML();
    } else {
        const promisse = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/buzzquizz/quizzes/" + id);
        promisse.then(({data})=>{
            buildHTML();
            const title = container.querySelector('.new-quizz-title');
            const image = container.querySelector('.new-quizz-image');
            const nQuestions = container.querySelector('.new-quizz-nQuestions');
            const nLevels = container.querySelector('.new-quizz-nLevels');
            newQuizzObj = data;
            title.value = newQuizzObj.title;
            image.value = newQuizzObj.image;
            //fix this later!!!!
            nQuestions.value = `${newQuizzObj.questions.length}`;
            nLevels.value = `${newQuizzObj.levels.length}`;
        });
    }

}

function buildNewQuizzPageQuestions() {
    container.innerHTML =
        `
    <section class="new-quizz">
      <h2>Crie suas perguntas</h2>
    </section>
    `;

    const section = container.querySelector('SECTION');
    for (let i = 0; i < newQuizzObj.questions.length; i++) {
        section.innerHTML +=
            `
        <div class="input-group collapsed">
          <header onclick='selectUnique(this, ".new-quizz")'>
            <h3>Pergunta ${i+1}</h3>
            <img class="svg" src="assets/images/edit.svg">
          </header>
          <div class="collapsible">
            <div class='sub-group'>
                <input class="question-title" type="text" placeholder="Texto da pergunta">
                <div></div>
                <input class="question-background" type="text" placeholder="Cor de fundo da pergunta">
                <div></div>
            </div>
            <h3>Resposta correta</h3>
            <div class='sub-group'>
                <input class="question-answer" type="text" placeholder="Resposta correta">
                <div></div>
                <input class="question-image" type="text" placeholder="URL da imagem">
                <div></div>
            </div>
            <h3>Respostas incorretas</h3>
            <div class='sub-group'>
                <input class="question-answer" type="text" placeholder="Resposta incorreta 1">
                <div></div>
                <input class="question-image" type="text" placeholder="URL da imagem 1">
                <div></div>
            </div>
            <div class='sub-group'>
                <input class="question-answer" type="text" placeholder="Resposta incorreta 2">
                <div></div>
                <input class="question-image" type="text" placeholder="URL da imagem 2">
                <div></div>
            </div>
            <div class='sub-group'>
                <input class="question-answer" type="text" placeholder="Resposta incorreta 3">
                <div></div>
                <input class="question-image" type="text" placeholder="URL da imagem 3">
                <div></div>
            </div>
          </div>
        </div>
        `
    }

    section.innerHTML += `<button onclick='handleQuestionsSubmit()'>Prosseguir para criar niveis</button>`
    container
        .querySelector('.collapsed')
        .classList
        .remove('collapsed');

    scrollQuizz(container, 0);
}

function buildNewQuizzPageLevels() {
    container.innerHTML =
        `
    <section class="new-quizz">
      <h2>Agora, decida os niveis!</h2>
    </section>
    `;

    const section = container.querySelector('SECTION');
    for (let i = 0; i < newQuizzObj.levels.length; i++) {
        section.innerHTML +=
            `
      <div class="input-group collapsed">
        <header onclick='selectUnique(this, ".new-quizz")'>
          <h3>Nivel ${i+1}</h3>
          <img class="svg" src="assets/images/edit.svg">
        </header>
        <div class="collapsible">
          <input class="level-title" type="text" placeholder="Titulo do nivel">
          <div></div>
          <input class="level-percentage" type="text" placeholder="% de acerto minima">
          <div></div>
          <input class="level-image" type="text" placeholder="URL da imagem do nivel">
          <div></div>
          <textarea class="level-description" type="text" placeholder="Descricao do nivel"></textarea>
          <div></div>
        </div>
      </div>
      `
    }

    section.innerHTML += `<button onclick='handleLevelsSubmit()'>Finalizar Quizz</button>`
    container
        .querySelector('.collapsed')
        .classList
        .remove('collapsed');

    scrollQuizz(container, 0);
}

function buildNewQuizzPageDone(id) {
    storeUserQuizz(id);
    let imgSrc;
    let title;
    axios
        .get(`https://mock-api.bootcamp.respondeai.com.br/api/v2/buzzquizz/quizzes/${id}`)
        .then(({ data }) => {
            imgSrc = data.image;
            title = data.title;
            container.innerHTML =
                `
            <section class="new-quizz">
              <h2>Seu quizz esta pronto!</h2>
              <figure>
                <img src="${imgSrc}" alt=${title}>
                <figcaption>${title}</figcaption>
              </figure>
              <button class="go-to-quizz" onclick='getQuizz(${id})'>Acessar Quizz</button>
              <button class="back-to-home" onclick='buildHomePage(true)'>Voltar para home</button>
            </section>
            `;
        })
        .catch((error) => {
            alert(`error ${error.response.status}`);
        });

    scrollQuizz(container, 0);
};


function storeUserQuizz(id) {
    idList.push(id);
    let stringId = JSON.stringify("id", idList);
    localStorage.setItem(stringId);
}
