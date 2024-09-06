const client = require('../../index');
const fetch = require('node-fetch');
const discord = require("discord.js");
require('colors');

client.on('ready', async () => {
  client.riffy.init(client.user.id);

  // Array de frases para o status
  const statuses = [
    { name: '✏️ Personalize com /embed criar', type: discord.ActivityType.Custom },
    { name: '🚫 proteger com /antilink', type: discord.ActivityType.Custom },
    { name: '🎭 gerencie com /cargos', type: discord.ActivityType.Custom },
    { name: '🛡️ moderação com /automod', type: discord.ActivityType.Custom }
  ];

  let index = 0;

  setInterval(() => {
    client.user.setPresence({
      activities: [statuses[index]],
      status: 'online',
    });

    // Incrementa o índice para a próxima frase, voltando ao início se necessário
    index = (index + 1) % statuses.length;

  }, 60000); // Alterna a cada 1 minuto

  client.user.setStatus('online');

  console.log("[Bot-Status]".bgBlue, `> Estou online como: ${client.user.username}`.blue);
});

