const discord = require('discord.js')
const idioma = require("../../database/models/language")

module.exports = {
    name: 'clear',
    description: 'Limpe as mensagens de um chat.',
    type: discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'numero',
            type: discord.ApplicationCommandOptionType.Number,
            description: 'O número de mensagens a serem limpas (máximo 100)',
            required: true
        },
    ],

    async run(client, interaction, args) {


        let lang = await idioma.findOne({ guildId: interaction.guild.id })
        lang = lang ? require(`../../languages/${lang.language}.js`) : require('../../languages/pt.js')

        const messageCount = interaction.options.getNumber('numero')


        if (messageCount < 1 || messageCount > 100) {
            return interaction.reply({ content: lang.alertNumeroInvalido, ephemeral: true })
        }

        if (!interaction.member.permissions.has(discord.PermissionFlagsBits.ManageMessages)) {
            return interaction.reply({ content: lang.alertNaoTemPermissão, ephemeral: true })
        }

        const botMember = interaction.guild.members.cache.get(client.user.id)
        if (!botMember.permissions.has(discord.PermissionFlagsBits.ManageMessages)) {
            return interaction.reply({ content: lang.alertPermissãoBot, ephemeral: true })
        }

        try {

            const messagesToDelete = await interaction.channel.messages.fetch({ limit: messageCount })

            const deletableMessages = messagesToDelete.filter(message => {
                const daysAgo = (Date.now() - message.createdTimestamp) / (1000 * 60 * 60 * 24)
                return !message.pinned && daysAgo <= 14
            })

            if (deletableMessages.size === 0) {
                return interaction.reply({ content: `${lang.alertMsgClear}`, ephemeral: true })
            }

            await interaction.channel.bulkDelete(messagesToDelete, true)


            const deletedCount = deletableMessages.size
            const notDeletedCount = messageCount - deletedCount

            let responseMessage = ''

            if (deletedCount === 1) {
                responseMessage = `${lang.msg348}`
            } else if (deletedCount > 1) {
                responseMessage = `${deletedCount} ${lang.msg349}`
            }

            if (notDeletedCount === 1) {
                responseMessage += `${lang.msg350}`
            } else if (notDeletedCount > 1) {
                responseMessage += `${lang.msg351} ${notDeletedCount} ${lang.msg352}`
            }

            const embed = new discord.EmbedBuilder()
                .setTitle(lang.msg79)
                .setDescription(`> \`+\` **${responseMessage}**`)
                .setTimestamp()
                .setFooter({ text: `${lang.msg81} ${interaction.member.user.username}`, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })
                .setColor('#41b2b0')

            interaction.reply({ embeds: [embed], ephemeral: true })

        } catch (error) {
            interaction.reply({
                content: `${lang.alert14dias}`,
                ephemeral: true,
            })
        }
    }
}