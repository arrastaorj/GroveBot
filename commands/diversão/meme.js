const discord = require("discord.js");
const { images } = require("../../plugins/images.json")
const meme = require("../../database/models/meme")
const idioma = require("../../database/models/language")

module.exports = {
    name: "meme",
    description: "Exibe memes aleatórios.",
    type: discord.ApplicationCommandType.ChatInput,

    async run(client, interaction, args) {


        let lang = await idioma.findOne({
            guildId: interaction.guild.id
        })
        lang = lang ? require(`../../languages/${lang.language}.js`) : require('../../languages/pt.js')


        const cmd = await meme.findOne({
            guildId: interaction.guild.id
        })

        if (!cmd) return interaction.reply({ content: `${lang.alertMemes}`, ephemeral: true })

        let cmd1 = cmd.canal1

        if (cmd1 === null || cmd1 === false || !client.channels.cache.get(cmd1) || cmd1 === interaction.channel.id) {

            const random = Math.floor(Math.random() * images.length)
            const randomMeme = images[random];
            const embed = new discord.EmbedBuilder()
                .setColor("#6dfef2")
                .setTimestamp(new Date)
                .setFooter({ text: `${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true, format: "png" }) })
                .setImage(randomMeme);
            interaction.reply({ embeds: [embed] });
        }
        else

            if (interaction.channel.id !== cmd1) { interaction.reply({ content: `${lang.alertMemes2} <#${cmd1}>.`, ephemeral: true }) }

    }
}