const discord = require("discord.js")
const idioma = require("../../database/models/language")
module.exports = {
    name: "destrancar",
    description: "Destrancar esse canal de texto.",
    type: discord.ApplicationCommandType.ChatInput,

    run: async (client, interaction, args) => {

        let lang = await idioma.findOne({
            guildId: interaction.guild.id
        })
        lang = lang ? require(`../../languages/${lang.language}.js`) : require('../../languages/pt.js')


        //Verificação para somente quem tiver permição usar o comando
        if (!interaction.member.permissions.has(discord.PermissionFlagsBits.ManageChannels))
            return interaction.reply({
                content: `${lang.alertNaoTemPermissão}`,
                ephemeral: true
            })

        if (!interaction.member.permissions.has(discord.PermissionFlagsBits.ManageChannels))
            return interaction.reply({
                content: `${lang.alertNaoTemPermissão}`,
                ephemeral: true
            })

        interaction.reply({
            content: `${lang.msg140}`,
            ephemeral: true
        }).then(msg => {
            interaction.channel.permissionOverwrites.edit(interaction.guild.id, { SendMessages: true })
        })

    }
}