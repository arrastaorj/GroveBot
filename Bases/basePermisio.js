const botMember = interaction.member.guild.members.cache.get(client.user.id)
const hasPermission = botMember.permissions.has("ManageChannels")

if (hasPermission) {


} else {

    return interaction.reply({ content: "> \`+\` Não posso concluir o comandos pois ainda não recebir permissão para gerenciar este servidor (Administrador)", ephemeral: true })
}