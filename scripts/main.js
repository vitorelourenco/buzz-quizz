//replace body with something else later
function buildNewQuizzPageStart(){
  document.querySelector('BODY').innerHTML =
  `
  <section class="new-quizz">
    <h2>Comece pelo comeco</h2>
    <div class="input-group">
        <input type="text" placeholder="Titulo do seu quizz">
        <input type="text" placeholder="URL da imagem do seu quizz">
        <input type="text" placeholder="Quantidade de perguntas do quizz">
        <input type="text" placeholder="Quantidade de niveis do quizz">
    </div>
    <button>Prosseguir para criar perguntas</button>
  </section>
  `
}

buildNewQuizzPageStart();