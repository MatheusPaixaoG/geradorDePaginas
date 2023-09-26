class ChamarServidorService {
  constructor () {
    this.urlServidor = 'https://geradordepaginas1.onrender.com/'
  }

  chamarServidor(nomeFuncao, nomeParametro) {
    const funcaoParaChamar = nomeFuncao // Nome da função que você deseja chamar
    const parametro = nomeParametro
  
    fetch(this.urlServidor, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ funcao: funcaoParaChamar, parametro })
    })
      .then(response => response.json())
      .then(data => {
        const resultado = data.resultado
        console.log(resultado)
      })
      .catch(error => {
        console.error('Erro:', error)
      })
  }

  async criarZip(nomeTemplate) {
    const funcaoParaChamar = 'makeZip' // Nome da função que você deseja chamar
    const parametro = nomeTemplate

    return new Promise((resolve, reject) => {
      fetch(this.urlServidor, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ funcao: funcaoParaChamar, parametro })
      })
      .then(response => response.json())
      .then(data => {
        const resultadoJson = JSON.stringify(data.resultado)
        resolve(resultadoJson)
      })
      .catch(error => {
        console.error('Erro:', error)
        reject(error)
      })
    })
  }

  async criarZip(nomeTemplate, nomeImg1, nomeImg2) {
    const funcaoParaChamar = 'makeZip' // Nome da função que você deseja chamar
    const parametro = nomeTemplate + ";" + nomeImg1 + ";" + nomeImg2
    console.log(parametro)
    return new Promise((resolve, reject) => {
      fetch(this.urlServidor, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ funcao: funcaoParaChamar, parametro })
      })
      .then(response => response.json())
      .then(data => {
        const resultadoJson = JSON.stringify(data.resultado)
        resolve(resultadoJson)
      })
      .catch(error => {
        console.error('Erro:', error)
        reject(error)
      })
    })
  }

  async criarTemplate(nomeTemplate, slogan, nomeLoja, nomeProduto, texto, frase, nomeImg1, nomeimg2) {

    const funcaoParaChamar = 'chngHtml' // Nome da função que você deseja chamar
    const parametro = nomeTemplate + ";" +  slogan + ";" + nomeLoja + ";" + nomeProduto + ";" + texto + ";" + frase + ";" + nomeImg1 +  ";" + nomeimg2
    return new Promise((resolve, reject) => {
      fetch(this.urlServidor, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ funcao: funcaoParaChamar, parametro })
      })
      .then(response => response.json())
      .then(data => {
        const resultadoJson = JSON.stringify(data.resultado)
        resolve(resultadoJson)
      })
      .catch(error => {
        console.error('Erro:', error)
        reject(error)
      })
    })
  }

  downloadZip() {
    const serverUrl = this.urlServidor + "/download"
    fetch(serverUrl, {
    method: 'GET'
    })
    .then(response => {
    // Verificar se a solicitação foi bem-sucedida
      if (response.ok) {
        // Iniciar o download do arquivo ZIP
        response.blob().then(blob => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'arquivo.zip'; // Nome do arquivo para download
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
        });
      } else {
        // Lida com erros, se necessário
        console.error('Erro ao baixar o arquivo ZIP.');
      }
    })
    .catch(error => {
      // Lida com erros de rede ou outros erros
      console.error('Erro na solicitação: ' + error);
    });
  }
}

function getnome(nome) {
  nome = nome.split("/")
  nome = nome.pop()
  nome = nome.split(".")
  return nome[0]
}

function getnomeImg(nome) {
  nome = nome.split("/")
  nome = nome.pop()
  return nome
}

// const inputImage = document.getElementById('input-image')
// const selectedImage = document.getElementById('selected-image')
const botao = document.getElementById("download")
const chamarServidorService = new ChamarServidorService()

botao.addEventListener("click", async function() {
  const opcoesSelecionadas = JSON.parse(localStorage.getItem('opcoesSelecionadas'));
  const imgProduto1 = opcoesSelecionadas ? opcoesSelecionadas.selectedImage1 : null;
  const imgProduto2 = opcoesSelecionadas ? opcoesSelecionadas.selectedImage2 : null;
  const frase = opcoesSelecionadas ? opcoesSelecionadas.selectedFrase : null;
  const slogan = opcoesSelecionadas ? opcoesSelecionadas.selectedSlogan : null;
  const texto = opcoesSelecionadas ? opcoesSelecionadas.selectedTexto : null;

  const dadosDoProduto = JSON.parse(localStorage.getItem('dadosDoProduto'));
  const nomeProduto = dadosDoProduto ? dadosDoProduto.nome : null;
  const nomeLoja = dadosDoProduto ? dadosDoProduto.lojaNome : null;

  const nomeImg1 = getnomeImg(imgProduto1)
  const nomeImg2 = getnomeImg(imgProduto2)
  let nomeTemplate = localStorage.getItem("templatePath")
  nomeTemplate = getnome(nomeTemplate)
  console.log(nomeImg1)
  console.log(nomeImg2)
  console.log(nomeTemplate)
  await chamarServidorService.criarTemplate(nomeTemplate, slogan, nomeLoja, nomeProduto, texto, frase, nomeImg1, nomeImg2)
  await chamarServidorService.criarZip(nomeTemplate, nomeImg1, nomeImg2)
  await chamarServidorService.downloadZip()
});