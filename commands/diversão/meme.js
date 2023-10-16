const discord = require("discord.js");
const { images } = require("../../plugins/images.json")
const meme = require("../../database/models/meme")

module.exports = {
    name: "meme",
    description: "Exibe memes aleatórios.",
    type: discord.ApplicationCommandType.ChatInput,

    async run(client, interaction, args) {


        const cmd = await meme.findOne({
            guildId: interaction.guild.id
        })

        if (!cmd) return interaction.reply({content: `> \`-\` <a:alerta:1163274838111162499> Um Adminitrador ainda não configurou o canal para uso de memes!`, ephemeral: true})

        let cmd1 = cmd.canal1

        if (cmd1 === null || cmd1 === false || !client.channels.cache.get(cmd1) || cmd1 === interaction.channel.id) {

            const random = Math.floor(Math.random() * images.length)
            const randomMeme = images[random];
            const embed = new discord.EmbedBuilder()
                .setColor("#41b2b0")
                .setTimestamp(new Date)
                .setFooter({ text: `${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true, format: "png" }) })
                .setImage(randomMeme);
            interaction.reply({ embeds: [embed] });

        }
        else

            if (interaction.channel.id !== cmd1) { interaction.reply({ content: `> \`-\` <a:alerta:1163274838111162499> Você estar tentando usar um comando no canal de texto errado, tente utiliza-lo no canal de <#${cmd1}>.`, ephemeral: true }) }

    }
}