const client = require('../../index')
const discord = require("discord.js")
const idioma = require("../../database/models/language")
const { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, codeBlock, ChannelSelectMenuBuilder, ButtonBuilder, ButtonStyle, RoleSelectMenuBuilder } = require("discord.js")


client.on("interactionCreate", async (interaction) => {


    let lang = await idioma.findOne({
        guildId: interaction.guild.id
    })
    lang = lang ? require(`../../languages/${lang.language}.js`) : require('../../languages/pt.js')


    if (!interaction.isButton()) return

    const member = interaction.member
    const modal = interaction.fields



    switch (interaction.customId) {
        case 'CREATOR_SET_TITLE':
            const embedTitle = EmbedBuilder.from(interaction.message.embeds[0])

            const modalTitle = new ModalBuilder()
                .setCustomId('CREATOR_SET_TITLE')
                .setTitle(`${lang.msg353}`)

            const title = new TextInputBuilder()
                .setCustomId('TITLE_INPUT')
                .setLabel(`${lang.msg354}`)
                .setStyle(TextInputStyle.Short)
                .setMinLength(1)
                .setMaxLength(256)
                .setPlaceholder(`${lang.msg355}`)
                .setRequired(true)

            if (embedTitle.data.title) title.setValue(embedTitle.data.title)

            const rowTitle = new ActionRowBuilder().addComponents(title)
            modalTitle.addComponents(rowTitle)

            await interaction.showModal(modalTitle)


            break

        case 'CREATOR_SET_DESCRIPTION':

            const embedDescription = EmbedBuilder.from(interaction.message.embeds[0])

            const modalDescription = new ModalBuilder()
                .setCustomId('CREATOR_SET_DESCRIPTION')
                .setTitle(`${lang.msg353}`)

            const description = new TextInputBuilder()
                .setCustomId('DESCRIPTION_INPUT')
                .setLabel(`${lang.msg356}`)
                .setStyle(TextInputStyle.Paragraph)
                .setMaxLength(4000)
                .setPlaceholder(`${lang.msg357}`)
                .setRequired(true)

            if (embedDescription.data.description) description.setValue(embedDescription.data.description)

            const rowDescription = new ActionRowBuilder().addComponents(description)
            modalDescription.addComponents(rowDescription)

            await interaction.showModal(modalDescription)
            break

        case 'CREATOR_SET_COLOR':
            const embedColor = EmbedBuilder.from(interaction.message.embeds[0])

            const modalColor = new ModalBuilder()
                .setCustomId('CREATOR_SET_COLOR')
                .setTitle(`${lang.msg353}`)

            const color = new TextInputBuilder()
                .setCustomId('COLOR_INPUT')
                .setLabel(`${lang.msg358}`)
                .setMinLength(7)
                .setMaxLength(7)
                .setStyle(TextInputStyle.Short)
                .setPlaceholder(`${lang.msg359}`)
                .setRequired(false)

            if (embedColor.data.color) color.setValue(`#${embedColor.data.color.toString(16).padStart(6, '0')}`)

            const rowColor = new ActionRowBuilder().addComponents(color)
            modalColor.addComponents(rowColor)

            await interaction.showModal(modalColor)
            break

        case 'CREATOR_SET_IMAGE':
            const embedImg = EmbedBuilder.from(interaction.message.embeds[0])

            const modalImg = new ModalBuilder()
                .setCustomId('CREATOR_SET_IMAGE')
                .setTitle(`${lang.msg353}`)

            const image = new TextInputBuilder()
                .setCustomId('IMAGE_INPUT')
                .setLabel(`${lang.msg360}`)
                .setStyle(TextInputStyle.Short)
                .setPlaceholder(`${lang.msg361}`)
                .setRequired(false)

            if (embedImg.data.image) image.setValue(embedImg.data.image.url)

            const rowImg = new ActionRowBuilder().addComponents(image)
            modalImg.addComponents(rowImg)

            await interaction.showModal(modalImg)
            break

        case 'CREATOR_SET_THUMBNAIL':
            const embedThubnail = EmbedBuilder.from(interaction.message.embeds[0])

            const modalThubnail = new ModalBuilder()
                .setCustomId('CREATOR_SET_THUMBNAIL')
                .setTitle(`${lang.msg353}`)

            const thumbnail = new TextInputBuilder()
                .setCustomId('THUMBNAIL_INPUT')
                .setLabel(`${lang.msg362}`)
                .setStyle(TextInputStyle.Short)
                .setPlaceholder(`${lang.msg363}`)
                .setRequired(false)

            if (embedThubnail.data.thumbnail) thumbnail.setValue(embedThubnail.data.thumbnail.url)

            const rowThubnail = new ActionRowBuilder().addComponents(thumbnail)
            modalThubnail.addComponents(rowThubnail)

            await interaction.showModal(modalThubnail)
            break

        case 'CREATOR_SET_AUTHOR':
            const embedAuthor = EmbedBuilder.from(interaction.message.embeds[0])

            const modalAuthor = new ModalBuilder()
                .setCustomId('CREATOR_SET_AUTHOR')
                .setTitle(`${lang.msg353}`)

            const author = new TextInputBuilder()
                .setCustomId('AUTHOR_INPUT')
                .setLabel(`${lang.msg364}`)
                .setMaxLength(256)
                .setStyle(TextInputStyle.Short)
                .setPlaceholder(`${lang.msg365}`)
                .setRequired(false)

            const icon = new TextInputBuilder()
                .setCustomId('ICON_INPUT')
                .setLabel(`${lang.msg366}`)
                .setStyle(TextInputStyle.Short)
                .setPlaceholder(`${lang.msg367}`)
                .setRequired(false)

            const url = new TextInputBuilder()
                .setCustomId('URL_INPUT')
                .setLabel('Url')
                .setStyle(TextInputStyle.Short)
                .setPlaceholder(`${lang.msg368}`)
                .setRequired(false)

            if (embedAuthor.data.author) author.setValue(embedAuthor.data.author.name)
            if (embedAuthor.data.author && embedAuthor.data.author.icon_url) icon.setValue(embedAuthor.data.author.icon_url)
            if (embedAuthor.data.author && embedAuthor.data.author.url) url.setValue(embedAuthor.data.author.url)

            const rowAuthor = new ActionRowBuilder().addComponents(author)
            const rowIcon = new ActionRowBuilder().addComponents(icon)
            const rowUrl = new ActionRowBuilder().addComponents(url)
            modalAuthor.addComponents(rowAuthor, rowIcon, rowUrl)

            await interaction.showModal(modalAuthor)
            break

        case 'CREATOR_SET_FOOTER':
            const embedFooter = EmbedBuilder.from(interaction.message.embeds[0])

            const modalFooter = new ModalBuilder()
                .setCustomId('CREATOR_SET_FOOTER')
                .setTitle(`${lang.msg353}`)

            const footer = new TextInputBuilder()
                .setCustomId('FOOTER_INPUT')
                .setLabel(`${lang.msg369}`)
                .setMaxLength(2048)
                .setStyle(TextInputStyle.Short)
                .setPlaceholder(`${lang.msg370}`)
                .setRequired(false)

            const iconFooter = new TextInputBuilder()
                .setCustomId('ICON_INPUT')
                .setLabel(`${lang.msg371}`)
                .setStyle(TextInputStyle.Short)
                .setPlaceholder(`${lang.msg372}`)
                .setRequired(false)

            if (embedFooter.data.footer) footer.setValue(embedFooter.data.footer.text)
            if (embedFooter.data.footer && embedFooter.data.footer.icon_url) iconFooter.setValue(embedFooter.data.footer.icon_url)

            const rowFooter = new ActionRowBuilder().addComponents(footer)
            const rowIconFooter = new ActionRowBuilder().addComponents(iconFooter)
            modalFooter.addComponents(rowFooter, rowIconFooter)

            await interaction.showModal(modalFooter)
            break

        case 'CREATOR_MENTION_ROLE':

            const buttonCreatorBack2 = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('CREATOR_BACK')
                    .setLabel(`${lang.msg373}`)
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji(`<:1095137898262695937:1166902501572870195>`))

            const menuCreatorRole = new ActionRowBuilder()
                .addComponents(new RoleSelectMenuBuilder()
                    .setCustomId(`CREATOR_MENTION_ROLE`)
                    .setPlaceholder(`${lang.msg374}`)
                )

            const messageRole = interaction.message

            if (!messageRole.embeds) {
                return await interaction.reply({
                    content: `${lang.msg375}`,
                    ephemeral: true
                })
            }

            await interaction.update({
                components: [menuCreatorRole, buttonCreatorBack2]
            })
            break

        case 'CREATOR_EXPORT_JSON':
            const messageExportJson = interaction.message

            if (!messageExportJson.embeds) {
                return await interaction.reply({
                    content: `${lang.msg375}`,
                    ephemeral: true
                })
            }

            const embedExportJson = EmbedBuilder.from(messageExportJson.embeds[0])

            await interaction.reply({
                embeds: [{
                    description: codeBlock(JSON.stringify(embedExportJson.toJSON())),
                    color: 2829617
                }],
                ephemeral: true
            })

            break

        case 'CREATOR_IMPORT_JSON':

            const modalCreatorImportJson = new ModalBuilder()
                .setCustomId('CREATOR_IMPORT_JSON')
                .setTitle(`${lang.msg353}`)
                .setComponents(
                    new ActionRowBuilder().addComponents(
                        new TextInputBuilder()
                            .setCustomId('JSON_INPUT')
                            .setLabel('JSON')
                            .setStyle(TextInputStyle.Paragraph)
                            .setMinLength(1)
                            .setMaxLength(4000)
                            .setPlaceholder(`${lang.msg376}`)
                            .setRequired(true)))

            await interaction.showModal(modalCreatorImportJson)
            break

        case 'CREATOR_SEND':

            const channel = interaction.channel; // Obtém o canal onde a interação ocorreu
            const message = interaction.message;

            const content = message.content;
            const embed = EmbedBuilder.from(message.embeds[0]);

            await channel.send({ content: content, embeds: [embed] });
            return await interaction.update({ content: `${lang.msg398} ${channel}.'`, embeds: [], components: [], ephemeral: true });

            // const menuCreatorSend = new ActionRowBuilder()
            //     .addComponents(new ChannelSelectMenuBuilder()
            //         .setCustomId(`CREATOR_SELECT_CHANNEL`)
            //         .setPlaceholder(`${lang.msg377}`))

            // const buttonCreatorBack = new ActionRowBuilder().addComponents(
            //     new ButtonBuilder()
            //         .setCustomId('CREATOR_BACK')
            //         .setLabel(`${lang.msg378}`)
            //         .setStyle(ButtonStyle.Secondary)
            //         .setEmoji(`<:1095137898262695937:1166902501572870195>`))

            // const messageSend = interaction.message

            // if (!messageSend.embeds) {
            //     return await interaction.reply({
            //         content: `${lang.msg375}`,
            //         ephemeral: true
            //     })
            // }
            // await interaction.update({
            //     components: [menuCreatorSend, buttonCreatorBack]
            // })
            break


        case 'limpa':

            const embedEmpty = new discord.EmbedBuilder()
                .setTitle(`${lang.msg141}`)
                .setDescription(`${lang.msg142}`)

            const buttonCreator = [
                new discord.ActionRowBuilder().addComponents(
                    new discord.ButtonBuilder()
                        .setCustomId('CREATOR_SET_TITLE')
                        .setLabel(`${lang.msg379}`)
                        .setStyle(discord.ButtonStyle.Secondary)
                        .setEmoji(`<:titulo:1284643807576723507>`),
                    new discord.ButtonBuilder()
                        .setCustomId('CREATOR_SET_DESCRIPTION')
                        .setLabel(`${lang.msg380}`)
                        .setStyle(discord.ButtonStyle.Secondary)
                        .setEmoji(`<:descrio:1284643835171045467>`),
                    new discord.ButtonBuilder()
                        .setCustomId('CREATOR_SET_COLOR')
                        .setLabel(`${lang.msg381}`)
                        .setStyle(discord.ButtonStyle.Secondary)
                        .setEmoji(`<:cor:1284643852329943081>`),
                    new discord.ButtonBuilder()
                        .setCustomId('CREATOR_SET_IMAGE')
                        .setLabel(`${lang.msg382}`)
                        .setStyle(discord.ButtonStyle.Secondary)
                        .setEmoji(`<:imagem:1284643867156680788>`),
                ),
                new discord.ActionRowBuilder().addComponents(
                    new discord.ButtonBuilder()
                        .setCustomId('CREATOR_SET_THUMBNAIL')
                        .setLabel(`${lang.msg383}`)
                        .setStyle(discord.ButtonStyle.Secondary)
                        .setEmoji(`<:miniatura:1284643880377253939>`),
                    new discord.ButtonBuilder()
                        .setCustomId('CREATOR_SET_AUTHOR')
                        .setLabel(`${lang.msg384}`)
                        .setStyle(discord.ButtonStyle.Secondary)
                        .setEmoji(`<:autor:1284643891764658229>`),
                    new discord.ButtonBuilder()
                        .setCustomId('CREATOR_SET_FOOTER')
                        .setLabel(`${lang.msg385}`)
                        .setStyle(discord.ButtonStyle.Secondary)
                        .setEmoji(`<:rodape:1284643905152749598>`),
                    new discord.ButtonBuilder()
                        .setCustomId('CREATOR_MENTION_ROLE')
                        .setLabel(`${lang.msg386}`)
                        .setStyle(discord.ButtonStyle.Secondary)
                        .setEmoji(`<:cargo:1284643916594937877>`)
                ),
                new discord.ActionRowBuilder().addComponents(
                    new discord.ButtonBuilder()
                        .setCustomId('CREATOR_IMPORT_JSON')
                        .setLabel(`${lang.msg387}`)
                        .setStyle(discord.ButtonStyle.Primary)
                        .setEmoji(`<:importa:1284643944877265019>`),
                    new discord.ButtonBuilder()
                        .setCustomId('CREATOR_EXPORT_JSON')
                        .setLabel(`${lang.msg388}`)
                        .setStyle(discord.ButtonStyle.Primary)
                        .setEmoji(`<:exporta:1284643930666831872>`),
                    new discord.ButtonBuilder()
                        .setCustomId('CREATOR_SEND')
                        .setLabel(`${lang.msg389}`)
                        .setStyle(discord.ButtonStyle.Success)
                        .setEmoji(`<:envia:1284643956071596153>`),
                    new discord.ButtonBuilder()
                        .setCustomId('limpa')
                        .setLabel(`Limpar embed`)
                        .setEmoji("<:limpa:1284643966838374470>")
                        .setStyle(discord.ButtonStyle.Danger)
                )
            ]


            await interaction.update({
                content: "",
                embeds: [embedEmpty],
                components: buttonCreator
            })

            break


        case 'CREATOR_BACK': {

            const buttonCreator = [
                new discord.ActionRowBuilder().addComponents(
                    new discord.ButtonBuilder()
                        .setCustomId('CREATOR_SET_TITLE')
                        .setLabel(`${lang.msg379}`)
                        .setStyle(discord.ButtonStyle.Secondary)
                        .setEmoji(`<:titulo:1284643807576723507>`),
                    new discord.ButtonBuilder()
                        .setCustomId('CREATOR_SET_DESCRIPTION')
                        .setLabel(`${lang.msg380}`)
                        .setStyle(discord.ButtonStyle.Secondary)
                        .setEmoji(`<:descrio:1284643835171045467>`),
                    new discord.ButtonBuilder()
                        .setCustomId('CREATOR_SET_COLOR')
                        .setLabel(`${lang.msg381}`)
                        .setStyle(discord.ButtonStyle.Secondary)
                        .setEmoji(`<:cor:1284643852329943081>`),
                    new discord.ButtonBuilder()
                        .setCustomId('CREATOR_SET_IMAGE')
                        .setLabel(`${lang.msg382}`)
                        .setStyle(discord.ButtonStyle.Secondary)
                        .setEmoji(`<:imagem:1284643867156680788>`),
                ),
                new discord.ActionRowBuilder().addComponents(
                    new discord.ButtonBuilder()
                        .setCustomId('CREATOR_SET_THUMBNAIL')
                        .setLabel(`${lang.msg383}`)
                        .setStyle(discord.ButtonStyle.Secondary)
                        .setEmoji(`<:miniatura:1284643880377253939>`),
                    new discord.ButtonBuilder()
                        .setCustomId('CREATOR_SET_AUTHOR')
                        .setLabel(`${lang.msg384}`)
                        .setStyle(discord.ButtonStyle.Secondary)
                        .setEmoji(`<:autor:1284643891764658229>`),
                    new discord.ButtonBuilder()
                        .setCustomId('CREATOR_SET_FOOTER')
                        .setLabel(`${lang.msg385}`)
                        .setStyle(discord.ButtonStyle.Secondary)
                        .setEmoji(`<:rodape:1284643905152749598>`),
                    new discord.ButtonBuilder()
                        .setCustomId('CREATOR_MENTION_ROLE')
                        .setLabel(`${lang.msg386}`)
                        .setStyle(discord.ButtonStyle.Secondary)
                        .setEmoji(`<:cargo:1284643916594937877>`)
                ),
                new discord.ActionRowBuilder().addComponents(
                    new discord.ButtonBuilder()
                        .setCustomId('CREATOR_IMPORT_JSON')
                        .setLabel(`${lang.msg387}`)
                        .setStyle(discord.ButtonStyle.Primary)
                        .setEmoji(`<:importa:1284643944877265019>`),
                    new discord.ButtonBuilder()
                        .setCustomId('CREATOR_EXPORT_JSON')
                        .setLabel(`${lang.msg388}`)
                        .setStyle(discord.ButtonStyle.Primary)
                        .setEmoji(`<:exporta:1284643930666831872>`),
                    new discord.ButtonBuilder()
                        .setCustomId('CREATOR_SEND')
                        .setLabel(`${lang.msg389}`)
                        .setStyle(discord.ButtonStyle.Success)
                        .setEmoji(`<:envia:1284643956071596153>`),
                    new discord.ButtonBuilder()
                        .setCustomId('limpa')
                        .setLabel(`Limpar embed`)
                        .setEmoji("<:limpa:1284643966838374470>")
                        .setStyle(discord.ButtonStyle.Danger)
                )
            ]

            const message = interaction.message

            if (!message.embeds) {
                return await interaction.reply({
                    content: `${lang.msg375}`,
                    ephemeral: true
                })
            }

            await interaction.update({
                components: buttonCreator
            })
        }
            break
        default:
            break
    }

})