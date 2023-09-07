class ChamarServidorService {
  constructor () {}

  enviarNomeEDescricaoProduto(nome, descricao) {
    const funcaoParaChamar = 'apiChatGpt' // Nome da função que você deseja chamar
    const parametro = "Nome: " + nome + "\n" + "Descrição: " + descricao

    return new Promise((resolve, reject) => {
      fetch('http://localhost:8000', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ funcao: funcaoParaChamar, parametro })
      })
      .then(response => response.json())
      .then(data => {
          const resultado = data.resultado
          localStorage.setItem("NomeDescricao", data.resultado)
          resolve(resultado)
        })
        .catch(error => {
          console.error('Erro:', error)
          reject(error)
        })
    })
  }

  enviarImagem(imagem) {
    fetch("http://localhost:8000/upload", {
      method: "POST",
      body: imagem,
    })
      .then((response) => response.json())
      .then((data) => {
        // Manipule a resposta do backend, se necessário
        console.log(data);
      })
      .catch((error) => {
        console.error("Erro ao enviar imagem:", error);
      })
  }

  mudarBackground(imagem) {
    return new Promise((resolve, reject) => {
      fetch("http://localhost:8000//change-background", {
        method: "POST",
        body: imagem,
      })
        .then((response) => response.json())
        .then((data) => {
          if(data.image_url) {
            resolve(data.image_url)
          } else {
            console.error("URL da imagem não encontrada na resposta.");
          }
        })
        .catch((error) => {
          console.error("Erro ao enviar imagem:", error);
          reject(error)
        })
    })
  }
}

const chamarServidorService = new ChamarServidorService()
// Get image
const inputImage = document.getElementById('input-image')
const selectedImage = document.getElementById('selected-image')
inputImage.addEventListener('change', function () {
  const file = inputImage.files[0]
  if (file) {
    selectedImage.src = URL.createObjectURL(file)
  }
})

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('form')
  const btnAvancar = document.getElementById('btn-avancar')
  
  btnAvancar.addEventListener('click', function (event) {
    event.preventDefault() // Impede o envio do formulário padrão

    // Get name and description
    const inputWord = form.querySelector('#input-word')
    const inputDescription = form.querySelector('#prodDescr')

    // Obtém os dados inseridos
    const word = inputWord.value
    const description = inputDescription.value
    const imageFile = inputImage.files[0]
    // Cria um formData para enviar a imagem para o backend
    var formData = new FormData()
    formData.append('image', imageFile)
    
    // Criação das Promises (chamadas para o servidor)
    var nomeDescricaoPromise = chamarServidorService.enviarNomeEDescricaoProduto(word, description)
    var mudarBackgroundPromise = chamarServidorService.mudarBackground(formData)
  
    // Tomar uma ação apenas quando as promises forem concluídas
    Promise.all([nomeDescricaoPromise, mudarBackgroundPromise])
      .then(function(results) {
        // Redirecionar para a segunda página e passar a imagem como parâmetro
        var image_url = results[1];
        window.location.href = `../userInteraction/userInteraction.html?image_url=${encodeURIComponent(image_url)}`
      })
      .catch(function(error){
        console.error("Erro ao fazer chamadas ao servidor:", error)
      }) 
  })
})