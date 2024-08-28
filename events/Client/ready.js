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

  setInterval(checkStatus, 3600000) // 120000 2 minutos

})

async function checkStatus() {
  const options = {
    method: 'GET',
    headers: { Authorization: SQUARE_CLOUD_TOKEN }
  };

  try {
    // Faz a requisição para obter o status detalhado do aplicativo
    const response = await fetch(`https://api.squarecloud.app/v2/apps/${TARGET_APP_ID}/status`, options);
    const data = await response.json();

    // Converta milissegundos para segundos
    const totalSeconds = Math.floor(client.uptime / 1000);

    // Calcula horas, minutos e segundos
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    // Formata o resultado
    const uptimeString = `${hours}h ${minutes}m ${seconds}s`;

    if (response.ok && data.status === 'success') {

      const currentStatus = data.response.running;

      const statusEmoji = currentStatus ? '<a:6209loadingonlinecircle:1278158897487806668> Online' : '<a:7278loadingdonotdisturbcircle:1278158920346763307> Offline';

      const embed = new discord.EmbedBuilder()
        .setTitle(`Grove Status`)
        .setColor(currentStatus ? '#00FF00' : '#FF0000')
        .addFields(
          { name: 'Status', value: `${statusEmoji}`, inline: false },
          { name: 'Uptime', value: `${uptimeString}`, inline: true },
          { name: 'RAM', value: `${data.response.ram}`, inline: true },
          { name: 'Storage', value: `${data.response.storage}`, inline: true },
          { name: 'Requests', value: `${data.response.requests}`, inline: true },
          { name: 'Network', value: `Total: ${data.response.network.total}\nAgora: ${data.response.network.now}`, inline: false },

        )
        .setTimestamp()

      const channel = client.channels.cache.get(CHANNEL_ID);

      if (channel) {

        channel.send({ embeds: [embed] })

      }

    } else {
      console.error(`Erro ao obter status detalhado: ${data.message}`);
    }
  } catch (error) {
    console.error('Erro ao comunicar com a Square Cloud:', error);
  }
}
