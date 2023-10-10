const Discord = require("discord.js")
const bot = require("../../bot.json")

module.exports = {
  name: "ping",
  description: "Veja o ping do bot.",
  type: Discord.ApplicationCommandType.ChatInput,

  run: async (client, interaction) => {


    let Embed2 = new Discord.EmbedBuilder()
      .setDescription(`**👋 Olá ${interaction.user},** meu ping está em \`${client.ws.ping}ms\``)
      .setColor(bot.config.color);

    interaction.reply({ embeds: [Embed2], content: ``, ephemeral: true })

  }
}