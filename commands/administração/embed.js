const discord = require("discord.js")
const idioma = require("../../database/models/language")

module.exports = {
    name: 'embed',
    description: 'Abra um painel interativo para criar sua embed personalizada.',
    type: discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "criar",
            type: discord.ApplicationCommandOptionType.Subcommand,
            description: "Abra um painel interativo para criar sua embed personalizada.",
        }
    ],


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
                    .setEmoji(`<:titulo:1284311543915479152>`),
                new discord.ButtonBuilder()
                    .setCustomId('CREATOR_SET_DESCRIPTION')
                    .setLabel(`${lang.msg144}`)
                    .setStyle(discord.ButtonStyle.Secondary)
                    .setEmoji(`<:descrio:1284311528895545365>`),
                new discord.ButtonBuilder()
                    .setCustomId('CREATOR_SET_COLOR')
                    .setLabel(`${lang.msg145}`)
                    .setStyle(discord.ButtonStyle.Secondary)
                    .setEmoji(`<:cores:1284311517713530971>`),
                new discord.ButtonBuilder()
                    .setCustomId('CREATOR_SET_IMAGE')
                    .setLabel(`${lang.msg146}`)
                    .setStyle(discord.ButtonStyle.Secondary)
                    .setEmoji(`<:imagem:1284311502509047839>`),
            ),
            new discord.ActionRowBuilder().addComponents(
                new discord.ButtonBuilder()
                    .setCustomId('CREATOR_SET_THUMBNAIL')
                    .setLabel(`${lang.msg147}`)
                    .setStyle(discord.ButtonStyle.Secondary)
                    .setEmoji(`<:miniatura:1284311491444740096>`),
                new discord.ButtonBuilder()
                    .setCustomId('CREATOR_SET_AUTHOR')
                    .setLabel(`${lang.msg148}`)
                    .setStyle(discord.ButtonStyle.Secondary)
                    .setEmoji(`<:autor:1284311479721394230>`),
                new discord.ButtonBuilder()
                    .setCustomId('CREATOR_SET_FOOTER')
                    .setLabel(`${lang.msg149}`)
                    .setStyle(discord.ButtonStyle.Secondary)
                    .setEmoji(`<:rodape:1284311462814158962>`),
                new discord.ButtonBuilder()
                    .setCustomId('CREATOR_MENTION_ROLE')
                    .setLabel(`${lang.msg150}`)
                    .setStyle(discord.ButtonStyle.Secondary)
                    .setEmoji(`<:cargo:1284311441926652027>`)
            ),
            new discord.ActionRowBuilder().addComponents(
                new discord.ButtonBuilder()
                    .setCustomId('CREATOR_IMPORT_JSON')
                    .setLabel(`${lang.msg151}`)
                    .setStyle(discord.ButtonStyle.Primary)
                    .setEmoji(`<:importa:1284311398960205874>`),
                new discord.ButtonBuilder()
                    .setCustomId('CREATOR_EXPORT_JSON')
                    .setLabel(`${lang.msg152}`)
                    .setStyle(discord.ButtonStyle.Primary)
                    .setEmoji(`<:eporta:1284311419759890452>`),
                new discord.ButtonBuilder()
                    .setCustomId('CREATOR_SEND')
                    .setLabel(`${lang.msg153}`)
                    .setStyle(discord.ButtonStyle.Success)
                    .setEmoji(`<:enviar:1284311377695215777>`),
                new discord.ButtonBuilder()
                    .setCustomId('limpa')
                    .setLabel(`Limpar embed`)
                    .setEmoji("<:limpa:1284311349312098334>")
                    .setStyle(discord.ButtonStyle.Danger)

            )
        ]

        interaction.reply({
            embeds: [embedEmpty],
            components: buttonCreator,
            ephemeral: true
        })


    }
}