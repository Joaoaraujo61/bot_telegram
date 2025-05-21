
const healthText = require('./messages/healthText.json')
const environmentText = require('./messages/environmentTopics.json')
require('dotenv').config()

const token = process.env.BOT_TOKEN
const url = `https://api.telegram.org/bot${token}/`
let offSet = 0 

async function sendMessage (chatId, message, replyMarkup = null){
    const body = {
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
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

function getEnvironmentHandlers(idChat){
    return Object.entries(environmentText).reduce((acc, [key, value]) => {
        acc[key] = async()=>{
            await sendContent(idChat, value, 'env')
        }
        return acc
    }, {})
}

function getHealthHandlers(idChat){
    return Object.entries(healthText).reduce((acc, [key, value]) => {
        acc[key] = async()=>{
            await sendContent(idChat, value, 'health')
        }
        return acc
    }, {})
}

async function searchUpdate(){
    try{
        const getUpdates =  await fetch(url + `getUpdates?offset=${offSet}`)
        const data = await getUpdates.json() 
        const lastUpdate = data.result[data.result.length - 1]

        if(data.result.length > 0){
            offSet = lastUpdate.update_id +1

            if(lastUpdate.message){
                const idChat = lastUpdate.message.chat.id
                await writeWelcomeMessage(idChat)
            }else if(lastUpdate.callback_query){
                const idChat = lastUpdate.callback_query.message.chat.id
                const dataQuery = lastUpdate.callback_query.data
                const callbackQueryId = lastUpdate.callback_query.id

                const handlers = {
                    ...getEnvironmentHandlers(idChat),
                    ...getHealthHandlers(idChat),
                    'saude': () => sendHealthOptionsMenu(idChat),
                    'meio_ambiente': () => sendEnvironmentMenu(idChat),
                    'goBack': () => writeWelcomeMessage(idChat)
                }

                if (handlers[dataQuery]) {
                    await handlers[dataQuery]()
                }
                await answerCallbackquery(callbackQueryId)
            }
        }else{
            return 
        } 
    }catch(error){
        console.error('Erro ao buscar updates:', error)
    }
}

async function sendContent(idChat, majorTopic, topic){
    await sendMessage(idChat, majorTopic.title + '\n\n' + majorTopic.content.join('\n'))

    if(topic == 'health'){
        await sendHealthOptionsMenu(idChat)
    }else if(topic == 'env'){
        await sendEnvironmentMenu(idChat)
    }else{
        console.log('Erro: topic em sendContent inválido')
    }
    
}

async function writeWelcomeMessage(idChat){
    const buttons = {
        inline_keyboard:[
            [{ text: 'Sobre Saúde 🌿', callback_data: 'saude' }],
            [{ text: 'Sobre Meio Ambiente 🌎', callback_data: 'meio_ambiente' }]
        ]         
    }

    await sendMessage(idChat, "Olá! Bem-vindo ao GaiaSalus Bot! 🌱🤖. Estou aqui para te ajudar com informações importantes sobre saúde e meio ambiente. ", buttons)
            
}

async function sendHealthOptionsMenu(idChat) {
    const buttons = {
        inline_keyboard:[
            [{text: "Alimentação Saudável 🍎", callback_data: "healthyEating"}],
            [{text: "Saúde Mental 🧠", callback_data: "mentalHealth"}],
            [{text: "Atividade Física 🏃",callback_data: "physicalActivity"}],
            [{text: "Saúde da Criança 👶",callback_data: "childHealth"}],
            [{text: "Saúde do Idoso 🧓", callback_data: "elderlyHealth"}],
            [{text: "Higiene Pessoal 🧼", callback_data: "personalHygiene"}],
            [{text: "Voltar 🔙", callback_data: "goBack"}]
        ]
    }
    await sendMessage(idChat, "Escolha uma das opções abaixo:", buttons)
}

async function sendEnvironmentMenu(idChat) {
    const buttons = {
        inline_keyboard:[
            [{ text: 'Reciclagem ♻️', callback_data: 'recycling' }],
            [{ text: 'Economia de Água 💧', callback_data: 'waterConservation' }],
            [{ text: 'Economia de Energia 💡', callback_data: 'energyConservation' }],
            [{ text: 'Queimadas 🔥', callback_data: 'wildfires' }],
            [{ text: 'Desmatamento 🌳', callback_data: 'deforestation' }],
            [{ text: 'Voltar 🔙', callback_data: 'goBack' }]
        ]
    }
    await sendMessage(idChat, "Escolha uma das opções abaixo:", buttons)
}

setInterval(searchUpdate, 3000)

