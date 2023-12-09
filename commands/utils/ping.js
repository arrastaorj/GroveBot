const Discord = require("discord.js")
const bot = require("../../bot.json")
const comandos = require("../../database/models/comandos")

module.exports = {
  name: "ping",
  description: "Veja o ping do bot.",
  type: Discord.ApplicationCommandType.ChatInput,

  run: async (client, interaction) => {



    const cmd = await comandos.findOne({
      guildId: interaction.guild.id
    })

    if (!cmd) return interaction.reply({ content: `> \`-\` <a:alerta:1163274838111162499> Um Adminitrador ainda não configurou o canal para uso de comandos!`, ephemeral: true })

    let cmd1 = cmd.canal1

    if (cmd1 === null || cmd1 === false || !client.channels.cache.get(cmd1) || cmd1 === interaction.channel.id) {

      logCommand(interaction);


      let Embed2 = new Discord.EmbedBuilder()
        .setDescription(`> \`+\` **👋 Olá ${interaction.user},** meu ping está em \`${client.ws.ping}ms\``)
        .setColor(bot.config.color);

      interaction.reply({ embeds: [Embed2], content: ``, ephemeral: true })
    }
    
    else

      if (interaction.channel.id !== cmd1) { interaction.reply({ content: `> \`-\` <a:alerta:1163274838111162499> Você estar tentando usar um comando no canal de texto errado, tente utiliza-lo no canal de <#${cmd1}>.`, ephemeral: true }) }
  }

}

function logCommand(interaction) {
  const guildId = interaction.guild.name;
  const channelId = '1182895176004423730'; // Substitua pelo ID do canal de logs desejado
  const commandName = interaction.commandName;
  const executor = interaction.member.user.tag;
  const argsUsed = interaction.options.data.map(option => `${option.name}: ${option.value}`).join(', ');

  const channel = interaction.guild.channels.cache.get(channelId);

  if (channel) {
      const logEmbed = new discord.EmbedBuilder()
          .setTitle('Imput Logs')
          .setColor("#6dfef2")
          .addFields(
              {
                  name: "Comando",
                  value: `┕ \`${commandName}\``,
                  inline: false,
              },
              {
                  name: "Executor",
                  value: `┕ \`${executor}\``,
                  inline: false,
              },
              {
                  name: "Servidor",
                  value: `┕ \`${guildId}\``,
                  inline: false,
              },
              {
                  name: "Argumentos",
                  value: `┕ \`${argsUsed}\``,
                  inline: false,
              },
          )
          .setTimestamp()

      channel.send({ embeds: [logEmbed] });
  }
}