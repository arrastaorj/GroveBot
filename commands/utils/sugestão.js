const discord = require('discord.js')

module.exports = {

    name: 'sugestão',
    description: 'Envie uma sugestão para nossa equipe.',
    type: discord.ApplicationCommandType.ChatInput,


    run: async (client, interaction) => {

        const modal = new discord.ModalBuilder()
            .setCustomId('modal_sugestao')
            .setTitle(`Olá usuário, Nos diga qual é a sua sugestão.`)
        const sugestao3 = new discord.TextInputBuilder()
            .setCustomId('sugestão')
            .setLabel('Qual sua sugestão?')
            .setStyle(discord.TextInputStyle.Paragraph)

        const firstActionRow = new discord.ActionRowBuilder().addComponents(sugestao3)
        modal.addComponents(firstActionRow)
        await interaction.showModal(modal)

    }
}
