const { ApplicationCommandType } = require("discord.js")
const discord = require("discord.js")

module.exports = {
    name: "trancar",
    description: "Trancar esse canal de texto.",
    type: ApplicationCommandType.ChatInput,

    run: async (client, interaction, args) => {
        if (!interaction.member.permissions.has(discord.PermissionFlagsBits.ManageChannels)) return interaction.reply({ content: "> \`-\` <a:alerta:1163274838111162499> Não posso concluir este comando pois você não possui permissão.", ephemeral: true })

        const botMember = interaction.member.guild.members.cache.get(client.user.id)
        const hasPermission = botMember.permissions.has("Administrator")

        if (hasPermission) {


            interaction.reply({ content: `> \`+\` Acabei de trancar o canal de texto como você pediu.`, ephemeral: true }).then(msg => {
                interaction.channel.permissionOverwrites.edit(interaction.guild.id, { SendMessages: false })
            })
        } else {

            return interaction.reply({ content: "> \`-\` <a:alerta:1163274838111162499> Não posso concluir o comandos pois ainda não recebir permissão para gerenciar este servidor (Administrador)", ephemeral: true })
        }
    }
}