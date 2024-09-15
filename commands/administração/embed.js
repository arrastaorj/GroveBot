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
                    .setEmoji(`<:titulo:1284643807576723507>`),
                new discord.ButtonBuilder()
                    .setCustomId('CREATOR_SET_DESCRIPTION')
                    .setLabel(`${lang.msg144}`)
                    .setStyle(discord.ButtonStyle.Secondary)
                    .setEmoji(`<:descrio:1284643835171045467>`),
                new discord.ButtonBuilder()
                    .setCustomId('CREATOR_SET_COLOR')
                    .setLabel(`${lang.msg145}`)
                    .setStyle(discord.ButtonStyle.Secondary)
                    .setEmoji(`<:cor:1284643852329943081>`),
                new discord.ButtonBuilder()
                    .setCustomId('CREATOR_SET_IMAGE')
                    .setLabel(`${lang.msg146}`)
                    .setStyle(discord.ButtonStyle.Secondary)
                    .setEmoji(`<:imagem:1284643867156680788>`),
            ),
            new discord.ActionRowBuilder().addComponents(
                new discord.ButtonBuilder()
                    .setCustomId('CREATOR_SET_THUMBNAIL')
                    .setLabel(`${lang.msg147}`)
                    .setStyle(discord.ButtonStyle.Secondary)
                    .setEmoji(`<:miniatura:1284643880377253939>`),
                new discord.ButtonBuilder()
                    .setCustomId('CREATOR_SET_AUTHOR')
                    .setLabel(`${lang.msg148}`)
                    .setStyle(discord.ButtonStyle.Secondary)
                    .setEmoji(`<:autor:1284643891764658229>`),
                new discord.ButtonBuilder()
                    .setCustomId('CREATOR_SET_FOOTER')
                    .setLabel(`${lang.msg149}`)
                    .setStyle(discord.ButtonStyle.Secondary)
                    .setEmoji(`<:rodape:1284643905152749598>`),
                new discord.ButtonBuilder()
                    .setCustomId('CREATOR_MENTION_ROLE')
                    .setLabel(`${lang.msg150}`)
                    .setStyle(discord.ButtonStyle.Secondary)
                    .setEmoji(`<:cargo:1284643916594937877>`)
            ),
            new discord.ActionRowBuilder().addComponents(
                new discord.ButtonBuilder()
                    .setCustomId('CREATOR_IMPORT_JSON')
                    .setLabel(`${lang.msg151}`)
                    .setStyle(discord.ButtonStyle.Primary)
                    .setEmoji(`<:importa:1284643944877265019>`),
                new discord.ButtonBuilder()
                    .setCustomId('CREATOR_EXPORT_JSON')
                    .setLabel(`${lang.msg152}`)
                    .setStyle(discord.ButtonStyle.Primary)
                    .setEmoji(`<:exporta:1284643930666831872>`),
                new discord.ButtonBuilder()
                    .setCustomId('CREATOR_SEND')
                    .setLabel(`${lang.msg153}`)
                    .setStyle(discord.ButtonStyle.Success)
                    .setEmoji(`<:envia:1284643956071596153>`),
                new discord.ButtonBuilder()
                    .setCustomId('limpa')
                    .setLabel(`Limpar embed`)
                    .setEmoji("<:limpa:1284643966838374470>")
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