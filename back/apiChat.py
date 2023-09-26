import requests
import json
from convertJson import convert_to_json

def apiChatGpt(textoEntrada, apiKey):
    headers = {"Authorization": f"Bearer {apiKey}", "Content-Type":"application/json"}
    link = "https://api.openai.com/v1/chat/completions"
    id_modelo = "gpt-4"

    body_mensagem = {
        "model": id_modelo,
        "messages": [
            {
                "role": "system",
                "content": """Você é um ótimo vendedor, alguém que conhece muito sobre publicidade e que consegue convencer qualquer pessoa a realizar uma compra. Vou te dar o nome do produto, o que é o produto e uma breve descrição, nessa ordem. Seu objetivo é gerar 4 frases persuasivas, 2 textos persuasivos e 4 slogans que eu possa colocar em uma landing page de vendas. Além disso, tenho uma imagem do produto e quero mudar o background dela. Dê 4 descrições em detalhes sobre como deve ser o background para a imagem considerando o contexto de uso do produto. Mantenha as frases concisas. Cada texto deve possuir 1 parágrafo e ser feito para retratar a situação de uso do produto e sua proposta de valor. Além disso, não comece o texto pedindo para imaginar algo. Os slogans devem ser feitos de forma bem criativa. As descrições de background devem ser feitas em inglês, limitadas a 1 frase e deve conter: Local onde o produto deve estar, características desse local, tipo de iluminação e sentimento que a imagem deve passar. 
                Responda no seguinte template JSON:
                {
                "Frases Persuasivas": ["Frase"],
                "Textos Persuasivos": ["Texto"],
                "Slogans": ["Slogan"],
                "Descricao": ["Description"]
                }
                """
            },
            {
                "role": "user", 
                "content": textoEntrada
            }
        ]
    }

    body_mensagem = json.dumps(body_mensagem)

    requisicao = requests.post(link, headers=headers, data=body_mensagem)
    resposta = requisicao.json()
    mensagem = resposta["choices"][0]["message"]["content"]
    texto_limpo = mensagem.split('{', 1)
    texto_limpo = "{" + texto_limpo[1]
    return texto_limpo
    # mensagem = """
    # "Frases Persuasivas:
    # 1. "Com o barber+, fazer a barba nunca foi tão fácil e confortável."
    # 2. "Experimente a sensação suave e sem irritações que só nosso barber+ pode oferecer."
    # 3. "Não perca mais tempo! Com o barber+, obtenha um corte rápido e preciso para se manter sempre bem aparentado."
    # 4. "Desfrute de uma experiência de barbear luxuosa com o nosso inovador barber+."
    # 5. "Barber+, a resposta para uma barba bem feita e sem esforço."

    # Texto Persuasivo:
    # 1. "Não há nada como começar o dia com uma cara fresca e limpa, é por isso que apresentamos o Barber+. Este barbeador premium não é apenas um produto, mas sim um investimento em sua aparência pessoal. Fácil de usar, rápido no corte e suave na pele, você sentirá a diferença desde o primeiro uso. Com o Barber+ você estará sempre pronto para encarar seu dia da melhor maneira possível!"
    # 2. "O Barber+ redefine o ato de fazer a barba. Diga adeus às lâminas antigas que puxam e irritam a pele. Nosso barbeador dá-lhe um corte suave e perfeito todas as vezes, tornando sua rotina matinal mais rápida e menos dolorosa. Agora você pode ter uma barba bem feita e sem esforço, deixando mais tempo para as coisas que realmente importam."

    # Slogans:
    # 1. "Barber+: Sua melhor imagem começa aqui."
    # 2. "Alcance a perfeição em cada corte com Barber+."
    # 3. "Barber+, elevando sua experiência de barbear ao máximo.""
    # """
    
    # json_msg = convert_to_json(mensagem)

    # return json_msg

def gerarFrase(textoEntrada, apiKey):
    headers = {"Authorization": f"Bearer {apiKey}", "Content-Type":"application/json"}
    link = "https://api.openai.com/v1/chat/completions"
    id_modelo = "gpt-4"

    body_mensagem = {
        "model": id_modelo,
        "messages": [
            {
                "role": "system",
                "content": """Você é um ótimo vendedor, alguém que conhece muito sobre publicidade e que consegue convencer qualquer pessoa a realizar uma compra. Vou te dar o nome do produto, o que é o produto e uma breve descrição, nessa ordem. Seu objetivo é gerar 4 frases persuasivas que eu possa colocar em uma landing page de vendas. Mantenha as frases concisas. 
                Responda no seguinte template JSON:
                {
                "result": ["Frase"]
                }
                """
            },
            {
                "role": "user", 
                "content": textoEntrada
            }
        ]
    }

    body_mensagem = json.dumps(body_mensagem)

    requisicao = requests.post(link, headers=headers, data=body_mensagem)
    resposta = requisicao.json()
    mensagem = resposta["choices"][0]["message"]["content"]
    texto_limpo = mensagem.split('{', 1)
    texto_limpo = "{" + texto_limpo[1]
    return texto_limpo

    # json_response = {
    #     "result": ["Com o barber+, fazer a barba nunca foi tão fácil e confortável.", "Experimente a sensação suave e sem irritações que só nosso barber+ pode oferecer.", "Não perca mais tempo! Com o barber+, obtenha um corte rápido e preciso para se manter sempre bem aparentado.", "Desfrute de uma experiência de barbear luxuosa com o nosso inovador barber+."]
    # }
    # return json_response

def gerarTexto(textoEntrada, apiKey):
    headers = {"Authorization": f"Bearer {apiKey}", "Content-Type":"application/json"}
    link = "https://api.openai.com/v1/chat/completions"
    id_modelo = "gpt-4"

    body_mensagem = {
        "model": id_modelo,
        "messages": [
            {
                "role": "system",
                "content": """Você é um ótimo vendedor, alguém que conhece muito sobre publicidade e que consegue convencer qualquer pessoa a realizar uma compra. Vou te dar o nome do produto, o que é o produto e uma breve descrição, nessa ordem. Seu objetivo é gerar 2 textos persuasivos que eu possa colocar em uma landing page de vendas. Cada texto deve possuir 1 parágrafo e ser feito para retratar a situação de uso do produto e sua proposta de valor. Além disso, não comece o texto pedindo para imaginar algo. 
                Responda no seguinte template JSON:
                {
                "result": ["Texto"]
                }
                """
            },
            {
                "role": "user", 
                "content": textoEntrada
            }
        ]
    }

    body_mensagem = json.dumps(body_mensagem)

    requisicao = requests.post(link, headers=headers, data=body_mensagem)
    resposta = requisicao.json()
    mensagem = resposta["choices"][0]["message"]["content"]
    texto_limpo = mensagem.split('{', 1)
    texto_limpo = "{" + texto_limpo[1]
    return texto_limpo

    # json_response = {
    #     "result": ["1Não há nada como começar o dia com uma cara fresca e limpa, é por isso que apresentamos o Barber+. Este barbeador premium não é apenas um produto, mas sim um investimento em sua aparência pessoal. Fácil de usar, rápido no corte e suave na pele, você sentirá a diferença desde o primeiro uso. Com o Barber+ você estará sempre pronto para encarar seu dia da melhor maneira possível!", "1O Barber+ redefine o ato de fazer a barba. Diga adeus às lâminas antigas que puxam e irritam a pele. Nosso barbeador dá-lhe um corte suave e perfeito todas as vezes, tornando sua rotina matinal mais rápida e menos dolorosa. Agora você pode ter uma barba bem feita e sem esforço, deixando mais tempo para as coisas que realmente importam."]
    # }
    # return json_response

def gerarSlogan(textoEntrada, apiKey):
    headers = {"Authorization": f"Bearer {apiKey}", "Content-Type":"application/json"}
    link = "https://api.openai.com/v1/chat/completions"
    id_modelo = "gpt-4"

    body_mensagem = {
        "model": id_modelo,
        "messages": [
            {
                "role": "system",
                "content": """Você é um ótimo vendedor, alguém que conhece muito sobre publicidade e que consegue convencer qualquer pessoa a realizar uma compra. Vou te dar o nome do produto, o que é o produto e uma breve descrição, nessa ordem. Seu objetivo é gerar 4 slogans que eu possa colocar em uma landing page de vendas. Os slogans devem ser feitos de forma bem criativa. 
                Responda no seguinte template JSON:
                {
                "result": ["Slogan"]
                }
                """
            },
            {
                "role": "user", 
                "content": textoEntrada
            }
        ]
    }

    body_mensagem = json.dumps(body_mensagem)

    requisicao = requests.post(link, headers=headers, data=body_mensagem)
    resposta = requisicao.json()
    mensagem = resposta["choices"][0]["message"]["content"]
    texto_limpo = mensagem.split('{', 1)
    texto_limpo = "{" + texto_limpo[1]
    return texto_limpo

    # json_response = {
    #     "result": ["1Barber+: Sua melhor imagem começa aqui.", "1Alcance a perfeição em cada corte com Barber+.", "1Barber+, elevando sua experiência de barbear ao máximo."]
    # }
    # return json_response

def gerarDescricao(textoEntrada, apiKey):
    headers = {"Authorization": f"Bearer {apiKey}", "Content-Type":"application/json"}
    link = "https://api.openai.com/v1/chat/completions"
    id_modelo = "gpt-4"

    body_mensagem = {
        "model": id_modelo,
        "messages": [
            {
                "role": "system",
                "content": """Você é um ótimo vendedor, alguém que conhece muito sobre publicidade e que consegue convencer qualquer pessoa a realizar uma compra. Vou te dar o nome do produto, o que é o produto e uma breve descrição, nessa ordem. Tenho uma imagem do produto e quero mudar o background dela. Seu objetivo é gerar 4 descrições em detalhes sobre como deve ser o background para a imagem considerando o contexto de uso do produto. As descrições de background devem ser feitas em inglês, limitadas a 1 frase e deve conter: Local onde o produto deve estar, características desse local, tipo de iluminação e sentimento que a imagem deve passar. 
                Responda no seguinte template JSON:
                {
                "result": ["Description"]
                }
                """
            },
            {
                "role": "user", 
                "content": textoEntrada
            }
        ]
    }

    body_mensagem = json.dumps(body_mensagem)

    requisicao = requests.post(link, headers=headers, data=body_mensagem)
    resposta = requisicao.json()
    mensagem = resposta["choices"][0]["message"]["content"]
    texto_limpo = mensagem.split('{', 1)
    texto_limpo = "{" + texto_limpo[1]
    return texto_limpo

    # json_response = {
    #     "result": ["A classy barbershop setting, boasting a vintage appeal with polished wooden countertops, under the soft yet focused light that casts an inviting and professional ambiance.", "A minimalist bathroom setup, drenched in soft white light that highlights the product, creating a sense of cleanliness and sophistication.", "An outdoor setup during golden hour with the product placed on a rustic wooden table, creating a sense of adventure and independence.", "A close-up shot against a black textured background under focused studio lights, highlighting the sleek design of the razor, evoking a sense of luxury and precision."]
    # }
    # return json_response

# texto = "crie 5 frases de efeito curtas para vender bolsa"
# textoSaida =  apiChatGpt(texto)
# print(textoSaida)