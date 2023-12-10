const Discord = require("discord.js")
const comandos = require("../../database/models/comandos")
const idioma = require("../../database/models/language")

module.exports = {
  name: "ping",
  description: "Veja o ping do bot.",
  type: Discord.ApplicationCommandType.ChatInput,

  run: async (client, interaction) => {


    let lang = await idioma.findOne({
      guildId: interaction.guild.id
    })

    if (!lang || !lang.language) {
      lang = { language: client.language };
    }
    lang = require(`../../languages/${lang.language}.js`)


    const cmd = await comandos.findOne({
      guildId: interaction.guild.id
    })

    if (!cmd)
      return interaction.reply({
        content: `${lang.alertCommandos}`,
        ephemeral: true
      })

    let cmd1 = cmd.canal1

    if (cmd1 === null || cmd1 === false || !client.channels.cache.get(cmd1) || cmd1 === interaction.channel.id) {


      let Embed2 = new Discord.EmbedBuilder()
        .setDescription(`> \`+\` **👋 ${lang.msg202} ${interaction.user},** ${lang.msg203} \`${client.ws.ping}ms\``)
        .setColor("#6dfef2")

      interaction.reply({ embeds: [Embed2], content: ``, ephemeral: true })
    }

    else if (interaction.channel.id !== cmd1) {
      interaction.reply({
        content: `${lang.alertCanalErrado} <#${cmd1}>.`,
        ephemeral: true
      })
    }
  }

}
