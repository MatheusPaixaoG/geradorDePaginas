from flask import Flask, request, jsonify, send_from_directory, send_file
import json
from apiClip import apiChangeBackGround
from apiChat import apiChatGpt, gerarFrase, gerarTexto, gerarSlogan, gerarDescricao
from createZip import makeZip
from changeHtml import chngHtml
from flask_cors import CORS, cross_origin

app = Flask(__name__)

api_v1_cors_config = {
    "origins": "*",
    "methods": ["OPTIONS", "GET", "POST", "DELETE", "PUT"],
    "allow_headers": ["Authorization", "Content-Type"]
}

CORS(app, resources={
    r"/*": api_v1_cors_config
})
UPLOAD_FOLDER = 'imagensBackground/'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
urlServidor = 'https://geradordepaginas1.onrender.com'

def funcao_1(parametro):
    resultado = f"Olá da Função 1, {parametro}!"
    return resultado

@app.route("/upload", methods=["POST"])
def upload_image():
    try:
        image_file = request.files["image"]  # Obtém o arquivo de imagem do formulário

        # Faça algo com o arquivo de imagem, como salvar no servidor
        # Por exemplo, para salvar a imagem em um diretório chamado "uploads":
        image_file.save("imagensSaida/teste.jpeg")

        return jsonify({"message": "Imagem enviada com sucesso!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/change-background", methods=["POST"])
def change_img_bg():
    try:
        image_file = request.files["image"]  # Obtém o arquivo de imagem do formulário
        prompt = request.form["prompt"]  # Obtém o texto do formulário
        apiKey = request.form["apiKey"]

        if image_file:
            # Faça algo com o arquivo de imagem, como salvar no servidor
            # Por exemplo, para salvar a imagem em um diretório chamado "uploads":
            pathImagem = apiChangeBackGround(image_file, prompt, app.config['UPLOAD_FOLDER'], apiKey)
            # URL da imagem
            image_url = f"{urlServidor}/change-background/{pathImagem}"
            return jsonify({"message": "Imagem enviada com sucesso!", "image_url": image_url})
        else:
            return jsonify({"error": "Nenhum arquivo de imagem recebido"}), 400
    except Exception as e:
        print("Erro no change img background")
        return jsonify({"error": str(e)}), 500

# Rota para acessar a imagem
@app.route("/change-background/<filename>", methods=["GET"])
def get_image(filename):
    try:
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)
    except Exception as e:
        print("Erro no get img")
        return jsonify({"error": str(e)}), 500

# Rota para enviar o zip para o front
@app.route("/download")
@cross_origin()
def download():
    arquivo_zip = "zips/arquivo.zip"  # nome do arquivo ZIP
    return send_file(
        arquivo_zip,
        as_attachment=True,
        download_name='arquivo.zip',  # O nome que o usuário verá ao baixar
        mimetype='application/zip'
    )


@app.route('/', methods=['POST', 'OPTIONS'])
def handle_request():
    if request.method == 'OPTIONS':
        response = app.response_class(
            response=json.dumps({}),
            status=200,
            mimetype='application/json'
        )
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        return response
    elif request.method == 'POST':
        data = request.get_json()
        funcao = data.get('funcao')
        parametro = data.get('parametro')
        apiKey = data.get('apiKey')
        
        try:
            if funcao == "apiChatGpt":
                resultado = apiChatGpt(parametro, apiKey)
            elif funcao == "gerarFrase":
                resultado = gerarFrase(parametro, apiKey)
            elif funcao == "gerarTexto":
                resultado = gerarTexto(parametro, apiKey)
            elif funcao == "gerarSlogan":
                resultado = gerarSlogan(parametro, apiKey)
            elif funcao == "gerarDescricao":
                resultado = gerarDescricao(parametro, apiKey)
            elif funcao == "makeZip":
                resultado = makeZip(parametro)
            elif funcao == "chngHtml":
                resultado = chngHtml(parametro)
            else:
                resultado = "Função desconhecida"
            
            response = app.response_class(
                response=json.dumps({'resultado': resultado}),
                status=200,
                mimetype='application/json'
            )
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response
        except Exception as e:
            print("Erro no servidor")
            print(e)
            return jsonify({"error": str(e)}), 500