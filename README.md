# 🌱 GaiaSalus Bot - Telegram

O nome GaiaSalus une duas referências simbólicas: Gaia, a deusa grega da Terra, representando o meio ambiente e a natureza; e Salus, a deusa romana da saúde e do bem-estar. Juntas, elas representam o equilíbrio entre cuidar da saúde humana e preservar o planeta.
```
Acesse @gaiaSalusBot no tlegram para usá-lo
```

Um bot para Telegram feito em **Node.js**, que oferece informações educativas sobre **saúde** e **meio ambiente** com uma interface interativa por botões. Ideal para fins educativos e de conscientização.

## ✨ Funcionalidades

- Mensagem de boas-vindas com botões interativos.
- Menu de tópicos sobre **saúde** e **meio ambiente**.
- Subtópicos com conteúdo informativo.
- Atualização contínua via pooling (`getUpdates`).
- Organização modular via JSON.

## 🛠 Tecnologias Utilizadas

- Node.js
- API do Telegram
- JSON para conteúdo
- `dotenv` para variáveis de ambiente

## 📁 Estrutura do Projeto

```text
bot_telegram/
├── messages/
│   ├── environmentTopics.json  # Conteúdo sobre meio ambiente
│   └── healthText.json         # Conteúdo sobre saúde
├── .env                        # Contém o token do bot (não incluído no Git)
├── bot.js                      # Código principal do bot
└── README.md

