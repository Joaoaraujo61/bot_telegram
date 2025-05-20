const { title } = require('process')

require('dotenv').config()

const token = process.env.BOT_TOKEN
const url = `https://api.telegram.org/bot${token}/`

const sendMessage = async(chatId, message, repyMarkup = null)=>{
    const body = {
        chat_id: chatId,
        text: message,
    }

    if(repyMarkup){
        body.reply_markup = repyMarkup
    }

    const res = await fetch(url + 'sendMessage', {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify(body),
    })
}

let offSet = 0 

async function SearchUpdate(){
    const getUpdates =  await fetch(url + `getUpdates?offset=${offSet}`)
    const data = await getUpdates.json() 

    

    if(data.result.length > 0){
        const lastUpdate = data.result[data.result.length - 1]
       // const textReceived = lastUpdate.message.text
        
        offSet = lastUpdate.update_id +1

        if(lastUpdate.message){
            const idChat = lastUpdate.message.chat.id
            const buttons = {
                inline_keyboard:[
                    [{ text: 'Sobre Saúde 🌿', callback_data: 'saude' }],
                    [{ text: 'Sobre Meio Ambiente 🌎', callback_data: 'meio_ambiente' }]
                    ]         
                }
            await sendMessage(idChat, "Olá! Bem-vindo ao GaiaSalus Bot! 🌱🤖. Estou aqui para te ajudar com informações importantes sobre saúde e meio ambiente. ", buttons)
            
        }else if(lastUpdate.callback_query){
            const idChat = lastUpdate.callback_query.message.chat.id
            const data = lastUpdate.callback_query.data

            switch(data){
                case "saude":
                await sendMessage(idChat, 'Saúde é bom')
                break
            }

            
        }
    
    }else{
        return
    }

    
    
}

 setInterval(SearchUpdate, 3000)

