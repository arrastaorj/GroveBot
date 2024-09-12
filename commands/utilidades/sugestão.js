const discord = require('discord.js')
const idioma = require("../../database/models/language")


module.exports = {

    name: 'sugestão',
    description: 'Envie uma sugestão para nossa equipe.',
    type: discord.ApplicationCommandType.ChatInput,


    run: async (client, interaction) => {

        let lang = await idioma.findOne({
            guildId: interaction.guild.id
        })
        lang = lang ? require(`../../languages/${lang.language}.js`) : require('../../languages/pt.js')


        const modal = new discord.ModalBuilder()
            .setCustomId('modal_sugestao')
            .setTitle(`${lang.msg230}`)
        const sugestao3 = new discord.TextInputBuilder()
            .setCustomId('sugestão')
            .setLabel(`${lang.msg231}`)
            .setStyle(discord.TextInputStyle.Paragraph)

        const firstActionRow = new discord.ActionRowBuilder().addComponents(sugestao3)
        modal.addComponents(firstActionRow)
        await interaction.showModal(modal)

    }
}