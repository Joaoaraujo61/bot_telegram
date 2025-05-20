const healthText = require('./messages/healthText.json')
require('dotenv').config()

const token = process.env.BOT_TOKEN
const url = `https://api.telegram.org/bot${token}/`
let offSet = 0 

async function sendMessage (chatId, message, replyMarkup = null){
    const body = {
        chat_id: chatId,
        text: message,
    }

    if(replyMarkup){
        body.reply_markup = replyMarkup
    }

    const res = await fetch(url + 'sendMessage', {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify(body),
    })
}

async function answerCallbackquery(callbackQueryId, text = '') {
    await fetch(url + 'answerCallbackQuery', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
            callback_query_id: callbackQueryId,
            text: text,
            show_alert: false
        })
    })
}

async function searchUpdate(){
    const getUpdates =  await fetch(url + `getUpdates?offset=${offSet}`)
    const data = await getUpdates.json() 
    const lastUpdate = data.result[data.result.length - 1]

    if(data.result.length > 0){
        offSet = lastUpdate.update_id +1

        if(lastUpdate.message){
            writeWelcomeMessage(lastUpdate)
            
        }else if(lastUpdate.callback_query){
            const idChat = lastUpdate.callback_query.message.chat.id
            const data = lastUpdate.callback_query.data
             const callbackQueryId = lastUpdate.callback_query.id

            switch(data){
                case "saude":
                await sendHealthOptionsMenu(idChat, data)
                break
            }
            await answerCallbackquery(callbackQueryId)
        }
    }else{
        return 
    }
}



async function writeWelcomeMessage(lastUpdate){
    const idChat = lastUpdate.message.chat.id
    const buttons = {
        inline_keyboard:[
            [{ text: 'Sobre Saúde 🌿', callback_data: 'saude' }],
            [{ text: 'Sobre Meio Ambiente 🌎', callback_data: 'meio_ambiente' }]
        ]         
    }

    await sendMessage(idChat, "Olá! Bem-vindo ao GaiaSalus Bot! 🌱🤖. Estou aqui para te ajudar com informações importantes sobre saúde e meio ambiente. ", buttons)
            
}

async function sendHealthOptionsMenu(idChat, data) {
    const buttons = {
        inline_keyboard:[
            [{text: 'Alimentação Saudável', callback_data: 'alimentacao-saudavel'}],
            [{text: 'Saúde Mental', callback_data: 'saude-mental'}]
        ]
    }
    if(!data){
        await sendMessage(idChat, "Escolha uma das opções abaixo:", buttons)
    }
    
    switch(data){
        case 'alimentacao-saudavel':
            console.log('clicou')//sendMessage(idChat, healthText.healthyEating.content)
            break
    }
}


 setInterval(searchUpdate, 3000)

