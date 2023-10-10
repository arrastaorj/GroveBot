const discord = require("discord.js")

module.exports = {
    name: "destrancar",
    description: "Destrancar esse canal de texto.",
    type: discord.ApplicationCommandType.ChatInput,

    run: async (client, interaction, args) => {
        if (!interaction.member.permissions.has(discord.PermissionFlagsBits.ManageChannels)) return interaction.reply({ content: "> \`+\` Não posso concluir este comando pois você não possui permissão.", ephemeral: true })

        const botMember = interaction.member.guild.members.cache.get(client.user.id)
        const hasPermission = botMember.permissions.has("Administrator")

        if (hasPermission) {

            interaction.reply({ content: "> \`+\` Acabei de destrancar o canal de texto como você pediu.", ephemeral: true }).then(msg => {
                interaction.channel.permissionOverwrites.edit(interaction.guild.id, { SendMessages: true })

            })
        } else {

            return interaction.reply({ content: "> \`+\` Não posso concluir o comandos pois ainda não recebir permissão para gerenciar este servidor (Administrador)", ephemeral: true })
        }
    }
}