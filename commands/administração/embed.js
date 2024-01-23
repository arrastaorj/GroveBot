const discord = require("discord.js")
const idioma = require("../../database/models/language")

module.exports = {
    name: 'anunciar',
    description: 'Crie um anúncio utilizando um formato de incorporação personalizável',
    type: discord.ApplicationCommandType.ChatInput,


    run: async (client, interaction) => {

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

        const embedEmpty = new discord.EmbedBuilder()
            .setTitle(`${lang.msg141}`)
            .setDescription(`${lang.msg142}`)

        const buttonCreator = [
            new discord.ActionRowBuilder().addComponents(
                new discord.ButtonBuilder()
                    .setCustomId('CREATOR_SET_TITLE')
                    .setLabel(`${lang.msg143}`)
                    .setStyle(discord.ButtonStyle.Secondary)
                    .setEmoji(`🗨`),
                new discord.ButtonBuilder()
                    .setCustomId('CREATOR_SET_DESCRIPTION')
                    .setLabel(`${lang.msg144}`)
                    .setStyle(discord.ButtonStyle.Secondary)
                    .setEmoji(`📃`),
                new discord.ButtonBuilder()
                    .setCustomId('CREATOR_SET_COLOR')
                    .setLabel(`${lang.msg145}`)
                    .setStyle(discord.ButtonStyle.Secondary)
                    .setEmoji(`🧪`),
                new discord.ButtonBuilder()
                    .setCustomId('CREATOR_SET_IMAGE')
                    .setLabel(`${lang.msg146}`)
                    .setStyle(discord.ButtonStyle.Secondary)
                    .setEmoji(`🖼`),
            ),
            new discord.ActionRowBuilder().addComponents(
                new discord.ButtonBuilder()
                    .setCustomId('CREATOR_SET_THUMBNAIL')
                    .setLabel(`${lang.msg147}`)
                    .setStyle(discord.ButtonStyle.Secondary)
                    .setEmoji(`🖼`),
                new discord.ButtonBuilder()
                    .setCustomId('CREATOR_SET_AUTHOR')
                    .setLabel(`${lang.msg148}`)
                    .setStyle(discord.ButtonStyle.Secondary)
                    .setEmoji(`🧒`),
                new discord.ButtonBuilder()
                    .setCustomId('CREATOR_SET_FOOTER')
                    .setLabel(`${lang.msg149}`)
                    .setStyle(discord.ButtonStyle.Secondary)
                    .setEmoji(`📝`),
                new discord.ButtonBuilder()
                    .setCustomId('CREATOR_MENTION_ROLE')
                    .setLabel(`${lang.msg150}`)
                    .setStyle(discord.ButtonStyle.Secondary)
                    .setEmoji(`📢`)
            ),
            new discord.ActionRowBuilder().addComponents(
                new discord.ButtonBuilder()
                    .setCustomId('CREATOR_IMPORT_JSON')
                    .setLabel(`${lang.msg151}`)
                    .setStyle(discord.ButtonStyle.Primary)
                    .setEmoji(`⬇`),
                new discord.ButtonBuilder()
                    .setCustomId('CREATOR_EXPORT_JSON')
                    .setLabel(`${lang.msg152}`)
                    .setStyle(discord.ButtonStyle.Primary)
                    .setEmoji(`⬆`),
                new discord.ButtonBuilder()
                    .setCustomId('CREATOR_SEND')
                    .setLabel(`${lang.msg153}`)
                    .setStyle(discord.ButtonStyle.Success)
                    .setEmoji(`📤`),
                new discord.ButtonBuilder()
                    .setCustomId('limpa')
                    .setLabel(`Limpar embed`)
                    .setEmoji("🧹")
                    .setStyle(discord.ButtonStyle.Danger)

            )
        ]

        interaction.reply({
            embeds: [embedEmpty],
            components: buttonCreator,
            ephemeral: false
        })


    }
}