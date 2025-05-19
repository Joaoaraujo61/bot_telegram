require('dotenv').config()

const token = process.env.BOT_TOKEN
const url = `https://api.telegram.org/bot${token}/`

const sendMessage = async(chatId, message)=>{
    const res = await fetch(url + 'sendMessage', {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({
            chat_id: chatId,
            text: message,
        }),
    })
}
let offSet = 0 
async function SearchUpdate(){
    const getUpdates =  await fetch(url + `getUpdates?offset=${offSet}`)
    const data = await getUpdates.json() 

    if(data.result.length > 0){
        const lastUpdate = data.result[data.result.length - 1]
        const textReceived = lastUpdate.message.text
        const idChat = lastUpdate.message.chat.id

        await sendMessage(idChat, "Sua mensagem: " + textReceived)
        offSet = lastUpdate.update_id +1
    }else{
        return
    }
    
}

 setInterval(SearchUpdate, 3000)
//sendMessage(idChat, 'Olá, bem-vindo ao GaiaSalus bot! Um bot que te ajudará com informações sobre saúde e meio ambiente!');

