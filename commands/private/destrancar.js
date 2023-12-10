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

        if (!lang || !lang.language) {
            lang = { language: client.language };
        }
        lang = require(`../../languages/${lang.language}.js`)


        //Verificação para somente quem tiver permição usar o comando
        if (!interaction.member.permissions.has(discord.PermissionFlagsBits.ManageChannels))
            return interaction.reply({
                content: `${lang.alertNaoTemPermissão}`,
                ephemeral: true
            })

        const botMember = interaction.member.guild.members.cache.get(client.user.id)
        const hasPermission = botMember.permissions.has("Administrator")

        if (hasPermission) {

            interaction.reply({
                content: `${lang.msg140}`,
                ephemeral: true
            }).then(msg => {
                interaction.channel.permissionOverwrites.edit(interaction.guild.id, { SendMessages: true })
            })
        } else {

            return interaction.reply({
                content: `${lang.alertPermissãoBot}`,
                ephemeral: true
            })
        }
    }
}