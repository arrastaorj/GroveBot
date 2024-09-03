const client = require('../../index')
const fetch = require('node-fetch');
const discord = require("discord.js")
require('colors')



const SQUARE_CLOUD_TOKEN = process.env.TokenSquare;
const CHANNEL_ID = '1278125339985318039';

const TARGET_APP_ID = '0851195bb228438f9b7bc9bf5ce40b63'; // ID do app que queremos monitorar


let lastStatus = null; // Variável para armazenar o último status

client.on(`ready`, async () => {

  client.riffy.init(client.user.id)

  let status = [
    `use /config help`
  ],

    i = 0

  setInterval(() => {
    client.user.setPresence({
      activities: [{ name: `${status[i++ % status.length]}`, type: 3 }],
      status: 'online',
    })
  }, 1000 * 15)
  client.user.setStatus('online')

  console.log("[Bot-Status]".bgBlue, `> Estou online como: ${client.user.username}`.blue)

})
