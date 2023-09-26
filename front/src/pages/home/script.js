class ChamarServidorService {
  constructor () {
    this.urlServidor = 'https://geradordepaginas1.onrender.com'
  }

  enviarNomeEDescricaoProduto(nome, what, descricao) {
    const funcaoParaChamar = 'apiChatGpt' // Nome da função que você deseja chamar
    const parametro = "Nome: " + nome + "\n" + "Produto: " + what + "\n" + "Descrição: " + descricao
    const urlServidor = this.urlServidor
    const apiKey = localStorage.getItem('openAIKey');
    console.log("ENVIAR NOME E DESCRIÇÃO")

    return new Promise((resolve, reject) => {
      fetch(urlServidor, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ funcao: funcaoParaChamar, parametro, apiKey })
      })
      .then(response => response.json())
      .then(data => {
          console.log("data")
          console.log(data)
          console.log("data.resultado")
          console.log(data.resultado)
          const resultadoJson = data.resultado // REMOVER O STRINGIFY QUANDO FOR USAR A API
          localStorage.setItem("ResultadoGpt", resultadoJson)
          resolve(resultadoJson)
        })
        .catch(error => {
          console.error('Erro:', error)
          reject(error)
        })
    })
  }

  mudarBackground(formData) {
    const urlServidor = this.urlServidor + '/change-background'
    const apiKey = localStorage.getItem('keyClipdrop');
    formData.append('apiKey', apiKey);

    return new Promise((resolve, reject) => {
      fetch(urlServidor, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if(data.image_url) {
            resolve(data.image_url)
          } else {
            throw Error("URL da imagem não encontrada na resposta.");
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

// Resetar a página caso o usuário volte para ela
window.addEventListener('pageshow', function(event) {
  // Verifique se a origem do evento é a página 1 (use a URL da página para isso)
  if (event.target.location.href.includes('index.html')) {
    // Limpe o formulário da página 1
    document.getElementById('form').reset();
  }
});

function showImg() {
  const inputImagem = document.getElementById('input-image');
  const imagemPreview = document.getElementById('selected-image');
  // Verifica se um arquivo foi selecionado
  if (inputImagem.files && inputImagem.files[0]) {
    const leitor = new FileReader();

    // Configura um ouvinte de evento para quando o arquivo estiver pronto para ser exibido
    leitor.onload = function(e) {
      imagemPreview.src = e.target.result;
      imagemPreview.style.display = 'inline-block'; // Mostra a imagem
    };

    // Lê o arquivo selecionado como uma URL de dados (data URL)
    leitor.readAsDataURL(inputImagem.files[0]);
  }
}

function armazenarKey() {
  const openAIKey = document.getElementById('keyOpenAI').value;
  localStorage.setItem('openAIKey', openAIKey);
  const keyClipdrop = document.getElementById('keyClipdrop').value;
  localStorage.setItem('keyClipdrop', keyClipdrop);
}

function armazenarVariaveis(nome, oQueEh, descricao, lojaNome, imageFile) {
  // Criar um objeto JSON com as variáveis
  const dados = {
    nome: nome,
    oQueEh: oQueEh,
    descricao: descricao,
    lojaNome: lojaNome
  };

  // Converter o objeto JSON para uma string JSON
  const dadosJSON = JSON.stringify(dados);

  // Armazenar a string JSON no localStorage com uma chave específica
  localStorage.setItem('dadosDoProduto', dadosJSON);

  const reader = new FileReader();

  reader.addEventListener('load', () => {
    localStorage.setItem('imagemProduto', reader.result);
  });

  if (imageFile) {
    reader.readAsDataURL(imageFile);
  }
}

function makeRequests(nome, oQueEh, descricao, imageFile, opcao1Selecionada, opcao2Selecionada, lojaNome) {
  armazenarVariaveis(nome, oQueEh, descricao, lojaNome, imageFile);
  armazenarKey();

  const caminhoDoArquivo = determinarCaminhoDoArquivo(opcao1Selecionada, opcao2Selecionada);
  localStorage.setItem('templatePath', caminhoDoArquivo);
  
  // Mostrar a sobreposição escura e o spinner
  document.body.classList.add('overlay-visible');

  // Criação das Promises (chamadas para o servidor)
  chamarServidorService.enviarNomeEDescricaoProduto(nome, oQueEh, descricao)
    .then((resultado) => {
      const resultadoGpt = JSON.parse(resultado) || []
      const chaves = Object.keys(resultadoGpt)
      const descricao1 = resultadoGpt[chaves[3]][0]
      const descricao2 = resultadoGpt[chaves[3]][1]
      const descricao3 = resultadoGpt[chaves[3]][2]
      const descricao4 = resultadoGpt[chaves[3]][3]
      var prompt1 = descricao1
      var prompt2 = descricao2
      var prompt3 = descricao3
      var prompt4 = descricao4

      // Cria um formData para enviar a imagem para o backend
      var formData1 = new FormData();
      formData1.append('image', imageFile);
      formData1.append('prompt', prompt1);
      // Fazer a primeira chamada de geração de imagem
      const mudarBackgroundPromise1 = chamarServidorService.mudarBackground(formData1);

      // Cria um formData para enviar a imagem para o backend
      var formData2 = new FormData();
      formData2.append('image', imageFile);
      formData2.append('prompt', prompt2);
      // Fazer a segunda chamada de geração de imagem
      const mudarBackgroundPromise2 = chamarServidorService.mudarBackground(formData2);

      // Cria um formData para enviar a imagem para o backend
      var formData3 = new FormData();
      formData3.append('image', imageFile);
      formData3.append('prompt', prompt3);
      // Fazer a segunda chamada de geração de imagem
      const mudarBackgroundPromise3 = chamarServidorService.mudarBackground(formData3);

      // Cria um formData para enviar a imagem para o backend
      var formData4 = new FormData();
      formData4.append('image', imageFile);
      formData4.append('prompt', prompt4);
      // Fazer a segunda chamada de geração de imagem
      const mudarBackgroundPromise4 = chamarServidorService.mudarBackground(formData4);

      // Usar Promise.all para aguardar ambas as chamadas
      return Promise.all([mudarBackgroundPromise1, mudarBackgroundPromise2, mudarBackgroundPromise3, mudarBackgroundPromise4]);
    })
    .then(([image_url1, image_url2, image_url3, image_url4]) => {
      // Ocultar a sobreposição escura e o spinner
      document.body.classList.remove('overlay-visible');
      const urls = JSON.stringify({"imagesUrl": [image_url1, image_url2, image_url3, image_url4]});
      localStorage.setItem('imagesUrl', urls);
      window.location.href = `../userInteraction/userInteraction.html?image_url1=${encodeURIComponent(image_url1)}&image_url2=${encodeURIComponent(image_url2)}`
    })
    .catch((error) => {
      // Ocultar a sobreposição escura e o spinner
      document.body.classList.remove('overlay-visible');
      console.error("Erro ao fazer chamadas ao servidor:", error)
    })
}

function submitForm(event) {
  event.preventDefault()

  if (localStorage.getItem('opcoesSelecionadas')) {
    // Se estiver, remova-o do localStorage
    localStorage.removeItem('opcoesSelecionadas');
  }

  // Obtém o formulário
  const form = document.getElementById('form')

  // Obtém os dados inseridos
  const lojaNome = form.querySelector('#storeName').value
  const nome = form.querySelector('#input-word').value
  const oQueEh = form.querySelector('#input-what').value
  const descricao = form.querySelector('#prodDescr').value
  const openAIKey = document.getElementById('keyOpenAI').value;
  const inputImage = document.getElementById('input-image');
  const imageFile = inputImage.files[0]

  // Valida os dados inseridos
  if (nome.trim() === '' || oQueEh.trim() === '' || descricao.trim() === '' || imageFile === undefined || openAIKey.trim() === '') {
  alert('Por favor, preencha todos os campos antes de avançar.');
  } else if (imageFile.size > 3 * 1024 * 1024) { // Limite de 3 MB
  alert('A imagem selecionada é muito grande. Selecione uma imagem menor (limite de 3 MB).'); 
  } else {
    // Determina qual template foi escolhido
    const opcao1Selecionada = document.getElementById('option1').checked;
    const opcao2Selecionada = document.getElementById('option2').checked;
    // Faz as chamadas para o servidor
    makeRequests(nome, oQueEh, descricao, imageFile, opcao1Selecionada, opcao2Selecionada, lojaNome)
  }
}

// Função para determinar o caminho do arquivo com base nas opções selecionadas
function determinarCaminhoDoArquivo(opcao1Selecionada, opcao2Selecionada) {
  if (opcao1Selecionada) {
    return "../../../assets/HOME_TEMPLATE1.html";
  } else if (opcao2Selecionada) {
    return "../../../assets/HOME_TEMPLATE2.html";
  } else {
    return "../../../assets/HOME_TEMPLATE1.html";
  }
}