const discord = require('discord.js')


module.exports = {
    name: 'clear',
    description: 'Limpe as mensagens de um chat.',
    type: discord.ApplicationCommandType.ChatInput,

    run: async (client, interaction, args) => {

        let numero = 50 + 49

        if (!interaction.member.permissions.has(discord.PermissionFlagsBits.ManageChannels)) return interaction.reply({ content: "> \`+\` Não posso concluir este comando pois você não possui permissão.", ephemeral: true })

        const botMember = interaction.member.guild.members.cache.get(client.user.id)
        const hasPermission = botMember.permissions.has("Administrator")

        if (hasPermission) {

            interaction.channel.bulkDelete(numero, true)
            let embed = new discord.EmbedBuilder()
                .setTitle(`Limpeza concluida`)
                .setDescription(`**Observação:** > \`+\` Você só pode excluir mensagens em massa com menos de 14 dias.`)
                .setTimestamp()
                .setFooter({ text: `Limpado por: ${interaction.member.user.username}`, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })
                .setColor("#41b2b0")
            interaction.reply({ embeds: [embed], ephemeral: true })
        } else {

            return interaction.reply({ content: "> \`+\` Não posso concluir o comandos pois ainda não recebir permissão para gerenciar este servidor (Administrador)", ephemeral: true })
        }

    }
}
