const client = require('../../index');
const discord = require("discord.js");
require('colors');

client.on('ready', async () => {
  client.riffy.init(client.user.id);


  const statuses = [
    { name: '✏️ Personalize com /embed criar', type: discord.ActivityType.Custom },
    { name: '🚫 proteger com /antilink', type: discord.ActivityType.Custom },
    { name: '🎭 gerencie com /cargos', type: discord.ActivityType.Custom },
    { name: '🛡️ moderação com /automod', type: discord.ActivityType.Custom }
  ]

  let index = 0;

  setInterval(() => {
    client.user.setPresence({
      activities: [statuses[index]],
      status: 'online',
    })

    index = (index + 1) % statuses.length;

  }, 60000)

  client.user.setStatus('online')

  console.log("[Bot-Status]".bgBlue, `> Estou online como: ${client.user.username}`.blue)
});

