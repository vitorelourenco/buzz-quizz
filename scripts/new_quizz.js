//newQuizzObj is used for both new quizes and editing quizes
//this is the main variable (type object) of the script
let newQuizzObj;
let isEdit;
let idEditing;
let keyEditing;


//this function is used on the questions screen of the new quizz
//and on the levels screen. basically it takes some of element of the dom
//and a selector and collapses all items except for the one that has been clicked
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


//handlestart submit gets called when the user clicks the NEXT button 
//on the 1st page of creating a new quizz
//its job is to figure out how to manipulate newQuizzObj
//and to give directions on how to build the questions page and the levels page
function handleStartSubmit() {
    function getArrQuestions(nQuestions) {
        const arrQuestions = [];
        let k = 0;

        //this IF is only ever true during an edit. never during the creation of a new quiz
        //the goal here is to pass forward the original data from the unedited quiz
        if (newQuizzObj.hasOwnProperty('questions')) {
            while (k < newQuizzObj.questions.length && k < nQuestions) {
                arrQuestions.push(newQuizzObj.questions[k]);
                k++;
            }
        }

        while (k < nQuestions) {
            arrQuestions.push({});
            k++;
        }

        return arrQuestions;
    }

    function getArrLevels(nLevels) {
        const arrLevels = [];
        let k = 0;

        //this IF is only ever true during an edit. never during the creation of a new quiz
        //the goal here is to pass forward the original data from the unedited quiz
        if (newQuizzObj.hasOwnProperty('levels')) {
            while (k < newQuizzObj.levels.length && k < nLevels) {
                arrLevels.push(newQuizzObj.levels[k]);
                k++;
            }
        }

        while (k < nLevels) {
            arrLevels.push({});
            k++;
        }
        return arrLevels;
    }

    objNewStart = document.querySelector('.new-quizz');

    const objTitle = objNewStart.querySelector('.new-quizz-title');
    const objImage = objNewStart.querySelector('.new-quizz-image');
    const objQuestions = objNewStart.querySelector('.new-quizz-nQuestions');
    const objLevels = objNewStart.querySelector('.new-quizz-nLevels');

    if (checkStartInput(objTitle, objImage, objQuestions, objLevels) === false) return;

    const nQuestions = parseInt(objQuestions.value, 10);
    const nLevels = parseInt(objLevels.value, 10);

    newQuizzObj = { title: objTitle.value, image: objImage.value, questions: getArrQuestions(nQuestions), levels: getArrLevels(nLevels) };
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

    if (isEdit) {
        axios
            .put(`https://mock-api.bootcamp.respondeai.com.br/api/v2/buzzquizz/quizzes/${idEditing}`, newQuizzObj, { headers: { 'Secret-Key': keyEditing } })
            .then(({ data }) => {
                console.log(data.key);
                console.log(data.id);
                buildNewQuizzPageDone(data.id, `${data.key}`);
                toggleLoading();
            })
            .catch((error) => {
                console.log(error);
            })
    } else {
        axios
            .post('https://mock-api.bootcamp.respondeai.com.br/api/v2/buzzquizz/quizzes', newQuizzObj)
            .then(({ data }) => {
                buildNewQuizzPageDone(data.id, `${data.key}`);
            })
            .catch((error) => {
                console.log(error);
            })
    }
}


function buildNewQuizzPageStart(id) {
    function buildHTML() {
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

    //when a new quizz is being created, the function gets called with id=-1
    if (id === -1) {
        isEdit = false;
        newQuizzObj = {};
        buildHTML();
    } else {
        const local = getUserQuizzes();
        local.forEach(elem => {
            if (elem.id === id) {
                keyEditing = `${elem.key}`;
            }
        })

        isEdit = true;
        idEditing = id;
        const promisse = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/buzzquizz/quizzes/" + id);
        promisse.then(({ data }) => {
            buildHTML();
            const title = container.querySelector('.new-quizz-title');
            const image = container.querySelector('.new-quizz-image');
            const nQuestions = container.querySelector('.new-quizz-nQuestions');
            const nLevels = container.querySelector('.new-quizz-nLevels');
            //this is newQuizzObj, the variable that holds a quiz being created or edited
            newQuizzObj = data;
            title.value = newQuizzObj.title;
            image.value = newQuizzObj.image;
            nQuestions.value = `${newQuizzObj.questions.length}`;
            nLevels.value = `${newQuizzObj.levels.length}`;
        });
    }

}

function buildNewQuizzPageQuestions() {
    //all these getXXXX functions do is figure out if newQuizzObj 
    //has the info for some indexes 
    //if its a new quiz, it wont have the info for sure
    //if its a quiz being edited, it might have the info
    //they return either the info or an empty string
    function getTitle(i) {
        if (newQuizzObj.questions[i].hasOwnProperty('title')) {
            return newQuizzObj.questions[i].title;
        }
        return '';
    }

    function getColor(i) {
        if (newQuizzObj.questions[i].hasOwnProperty('color')) {
            return newQuizzObj.questions[i].color;
        }
        return '';
    }

    function getAnswerText(i, j) {
        if (newQuizzObj.questions[i].hasOwnProperty('answers')) {
            if (newQuizzObj.questions[i].answers[j] !== undefined) {
                return newQuizzObj.questions[i].answers[j].text;
            }
        }
        return '';
    }

    function getAnswerImage(i, j) {
        if (newQuizzObj.questions[i].hasOwnProperty('answers')) {
            if (newQuizzObj.questions[i].answers[j] !== undefined) {
                return newQuizzObj.questions[i].answers[j].image;
            }
        }
        return '';
    }

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
        `;
    }

    section.innerHTML += `<button onclick='handleQuestionsSubmit()'>Prosseguir para criar niveis</button>`

    //this for is putting the info from newQuizzObj into the input fields
    //of the page. thats really all it does
    //the getXXXX functions return an empty string if newQuizzObj doesnt have the value
    for (let i = 0; i < newQuizzObj.questions.length; i++) {

        const allDivs = section.querySelectorAll('.input-group');
        const currentSection = allDivs[i];

        const questionTitle = currentSection.querySelector('.question-title');
        const questionColor = currentSection.querySelector('.question-background');
        questionTitle.value = getTitle(i);
        questionColor.value = getColor(i);

        const answers = currentSection.querySelectorAll('.sub-group');
        //why j<5? , well, because when i was building the html for the page
        //i used the .sub-group selector for things that arent questions
        //like this : <div class='sub-group'><input class="question-title" type="text" placeholder="Texto da pergunta"></input>
        //thats just a question title...
        for (let j = 1; j < 5; j++) {
            const answer = answers[j].querySelector('.question-answer');
            const image = answers[j].querySelector('.question-image');
            answer.value = getAnswerText(i, j - 1);
            image.value = getAnswerImage(i, j - 1);

        }
    }

    container
        .querySelector('.collapsed')
        .classList
        .remove('collapsed');

    scrollQuizz(container, 0);
}

//this function is buildNewQuizzPageQuestions()`s cousin, they work the same . boilerplate copypasta
function buildNewQuizzPageLevels() {
    function getTitle(i) {
        if (newQuizzObj.levels[i].hasOwnProperty('title')) {
            return newQuizzObj.levels[i].title;
        }
        return '';
    }

    function getPercentage(i) {
        if (newQuizzObj.levels[i].hasOwnProperty('minValue')) {
            return newQuizzObj.levels[i].minValue;
        }
        return '';
    }

    function getImage(i) {
        if (newQuizzObj.levels[i].hasOwnProperty('image')) {
            return newQuizzObj.levels[i].image;
        }
        return '';
    }

    function getDescription(i) {
        if (newQuizzObj.levels[i].hasOwnProperty('text')) {
            return newQuizzObj.levels[i].text;
        }
        return '';
    }

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

    section.innerHTML += `<button onclick='handleLevelsSubmit()'>Finalizar Quizz</button>`;

    for (let i = 0; i < newQuizzObj.levels.length; i++) {
        const allDivs = section.querySelectorAll('.input-group');
        const currentSection = allDivs[i];

        const levelTitle = currentSection.querySelector('.level-title');
        const levelPercentage = currentSection.querySelector('.level-percentage');
        const levelImage = currentSection.querySelector('.level-image');
        const levelDescription = currentSection.querySelector('.level-description');
        levelTitle.value = getTitle(i);
        levelPercentage.value = getPercentage(i);
        levelImage.value = getImage(i);
        levelDescription.value = getDescription(i);
    }

    container
        .querySelector('.collapsed')
        .classList
        .remove('collapsed');

    scrollQuizz(container, 0);
}

//key is already a string by this point
function buildNewQuizzPageDone(id, key) {
    if (!isEdit) {
        storeUserQuizz(id, key);
    }
    let imgSrc;
    let title;
    axios
        .get(`https://mock-api.bootcamp.respondeai.com.br/api/v2/buzzquizz/quizzes/${id}`)
        .then(({ data }) => {
            imgSrc = data.image;
            title = data.title;
            container.innerHTML =
                `
            <section class="new-quizz done">
              <h2>Seu quizz esta pronto!</h2>
              <figure>
                <img src="${imgSrc}" alt=${title}>
                <figcaption>${title}</figcaption>
              </figure>
              <button class="go-to-quizz" onclick='getQuizz(${id})'>Acessar Quizz</button>
              <button class="back-to-home" onclick='buildHomePage()'>Voltar para home</button>
            </section>
            `;
        })
        .catch((error) => {
            console.log(error);
        });

    scrollQuizz(container, 0);
};

//key is already a string by this point
//id is still a number tho, but it should be
function storeUserQuizz(id, key) {
    if (idList !== null) {
        idList.push({ id, key });
        let stringId = JSON.stringify(idList);
        localStorage.setItem("ids", stringId);
    } else {
        const obj = [{ id, key }];
        const str = JSON.stringify(obj);
        localStorage.setItem("ids", str);
    }
}

//this function gets called when the user clicks the edit icon 
function editQuizz(id, event) {
    event.stopPropagation();
    buildNewQuizzPageStart(id);
}

// these functions can be used for testing stuff from the console
// buildNewQuizzPageStart(-1);
// buildNewQuizzPageDone(1);
// buildNewQuizzPageQuestions(newQuizzObj = {title:'a', image:'a', questions:[{},{},{}], levels:[{},{}]});
// buildNewQuizzPageLevels(newQuizzObj = { title: 'a', image: 'a', questions: [{}, {}, {}, {}], levels: [{}, {}, {}, {}] });