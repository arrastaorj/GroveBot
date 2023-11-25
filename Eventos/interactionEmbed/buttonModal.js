const client = require('../../index')
const discord = require("discord.js")
const { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, codeBlock, ChannelSelectMenuBuilder, ButtonBuilder, ButtonStyle, RoleSelectMenuBuilder } = require("discord.js");


client.on("interactionCreate", async (interaction) => {

    if (!interaction.isButton()) return;

    const member = interaction.member;
    const modal = interaction.fields;


    switch (interaction.customId) {
        case 'CREATOR_SET_TITLE':
            const embedTitle = EmbedBuilder.from(interaction.message.embeds[0]);

            const modalTitle = new ModalBuilder()
                .setCustomId('CREATOR_SET_TITLE')
                .setTitle(`Criador de mensagem`)

            const title = new TextInputBuilder()
                .setCustomId('TITLE_INPUT')
                .setLabel('Título')
                .setStyle(TextInputStyle.Short)
                .setMinLength(1)
                .setMaxLength(256)
                .setPlaceholder('Insira o título que deseja definir')
                .setRequired(true);

            if (embedTitle.data.title) title.setValue(embedTitle.data.title);

            const rowTitle = new ActionRowBuilder().addComponents(title);
            modalTitle.addComponents(rowTitle);

            await interaction.showModal(modalTitle);


            break;

        case 'CREATOR_SET_DESCRIPTION':

            const embedDescription = EmbedBuilder.from(interaction.message.embeds[0]);

            const modalDescription = new ModalBuilder()
                .setCustomId('CREATOR_SET_DESCRIPTION')
                .setTitle(`Criador de mensagem`)

            const description = new TextInputBuilder()
                .setCustomId('DESCRIPTION_INPUT')
                .setLabel('Descrição')
                .setStyle(TextInputStyle.Paragraph)
                .setMaxLength(4000)
                .setPlaceholder('Insira a descrição que deseja definir')
                .setRequired(true)

            if (embedDescription.data.description) description.setValue(embedDescription.data.description);

            const rowDescription = new ActionRowBuilder().addComponents(description);
            modalDescription.addComponents(rowDescription);

            await interaction.showModal(modalDescription);
            break;

        case 'CREATOR_SET_COLOR':
            const embedColor = EmbedBuilder.from(interaction.message.embeds[0]);

            const modalColor = new ModalBuilder()
                .setCustomId('CREATOR_SET_COLOR')
                .setTitle(`Criador de mensagem`);

            const color = new TextInputBuilder()
                .setCustomId('COLOR_INPUT')
                .setLabel('Código Hex')
                .setMinLength(7)
                .setMaxLength(7)
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('Insira a cor que deseja definir')
                .setRequired(false);

            if (embedColor.data.color) color.setValue(`#${embedColor.data.color.toString(16).padStart(6, '0')}`);

            const rowColor = new ActionRowBuilder().addComponents(color);
            modalColor.addComponents(rowColor);

            await interaction.showModal(modalColor);
            break;

        case 'CREATOR_SET_IMAGE':
            const embedImg = EmbedBuilder.from(interaction.message.embeds[0]);

            const modalImg = new ModalBuilder()
                .setCustomId('CREATOR_SET_IMAGE')
                .setTitle(`Criador de mensagem`);

            const image = new TextInputBuilder()
                .setCustomId('IMAGE_INPUT')
                .setLabel('Url da imagem')
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('Insira a imagem que deseja definir')
                .setRequired(false);

            if (embedImg.data.image) image.setValue(embedImg.data.image.url);

            const rowImg = new ActionRowBuilder().addComponents(image);
            modalImg.addComponents(rowImg);

            await interaction.showModal(modalImg);
            break;

        case 'CREATOR_SET_THUMBNAIL':
            const embedThubnail = EmbedBuilder.from(interaction.message.embeds[0]);

            const modalThubnail = new ModalBuilder()
                .setCustomId('CREATOR_SET_THUMBNAIL')
                .setTitle(`Criador de mensagem`);

            const thumbnail = new TextInputBuilder()
                .setCustomId('THUMBNAIL_INPUT')
                .setLabel('Url da miniatura')
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('Insira a miniatura que deseja definir')
                .setRequired(false);

            if (embedThubnail.data.thumbnail) thumbnail.setValue(embedThubnail.data.thumbnail.url);

            const rowThubnail = new ActionRowBuilder().addComponents(thumbnail);
            modalThubnail.addComponents(rowThubnail);

            await interaction.showModal(modalThubnail);
            break;

        case 'CREATOR_SET_AUTHOR':
            const embedAuthor = EmbedBuilder.from(interaction.message.embeds[0]);

            const modalAuthor = new ModalBuilder()
                .setCustomId('CREATOR_SET_AUTHOR')
                .setTitle(`Criador de mensagem`);

            const author = new TextInputBuilder()
                .setCustomId('AUTHOR_INPUT')
                .setLabel('Autor')
                .setMaxLength(256)
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('Insira o autor que deseja definir')
                .setRequired(false);

            const icon = new TextInputBuilder()
                .setCustomId('ICON_INPUT')
                .setLabel('Icone')
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('Insira o icone que deseja definir')
                .setRequired(false);

            const url = new TextInputBuilder()
                .setCustomId('URL_INPUT')
                .setLabel('Url')
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('Insira o url que deseja definir')
                .setRequired(false);

            if (embedAuthor.data.author) author.setValue(embedAuthor.data.author.name);
            if (embedAuthor.data.author && embedAuthor.data.author.icon_url) icon.setValue(embedAuthor.data.author.icon_url);
            if (embedAuthor.data.author && embedAuthor.data.author.url) url.setValue(embedAuthor.data.author.url);

            const rowAuthor = new ActionRowBuilder().addComponents(author);
            const rowIcon = new ActionRowBuilder().addComponents(icon);
            const rowUrl = new ActionRowBuilder().addComponents(url);
            modalAuthor.addComponents(rowAuthor, rowIcon, rowUrl);

            await interaction.showModal(modalAuthor);
            break;

        case 'CREATOR_SET_FOOTER':
            const embedFooter = EmbedBuilder.from(interaction.message.embeds[0]);

            const modalFooter = new ModalBuilder()
                .setCustomId('CREATOR_SET_FOOTER')
                .setTitle(`Criador de mensagem`);

            const footer = new TextInputBuilder()
                .setCustomId('FOOTER_INPUT')
                .setLabel('Rodapé')
                .setMaxLength(2048)
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('Insira o rodapé que deseja definir')
                .setRequired(false);

            const iconFooter = new TextInputBuilder()
                .setCustomId('ICON_INPUT')
                .setLabel('Icone')
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('Insira o icone que deseja definir')
                .setRequired(false);

            if (embedFooter.data.footer) footer.setValue(embedFooter.data.footer.text);
            if (embedFooter.data.footer && embedFooter.data.footer.icon_url) iconFooter.setValue(embedFooter.data.footer.icon_url);

            const rowFooter = new ActionRowBuilder().addComponents(footer);
            const rowIconFooter = new ActionRowBuilder().addComponents(iconFooter);
            modalFooter.addComponents(rowFooter, rowIconFooter);

            await interaction.showModal(modalFooter);
            break;

        case 'CREATOR_MENTION_ROLE':

            const buttonCreatorBack2 = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('CREATOR_BACK')
                    .setLabel('Voltar')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji(`<:1095137898262695937:1166902501572870195>`));

            const menuCreatorRole = new ActionRowBuilder()
                .addComponents(new RoleSelectMenuBuilder()
                    .setCustomId(`CREATOR_MENTION_ROLE`)
                    .setPlaceholder(`Clique para selecionar uma opção.`)
                );

            const messageRole = interaction.message;

            if (!messageRole.embeds) {
                return await interaction.reply({ content: 'A mensagem não contém nenhuma mensagem personalizada.', ephemeral: true })
            }

            await interaction.update({ components: [menuCreatorRole, buttonCreatorBack2] });
            break;

        case 'CREATOR_EXPORT_JSON':
            const messageExportJson = interaction.message;

            if (!messageExportJson.embeds) {
                return await interaction.reply({ content: 'A mensagem não contém nenhuma mensagem personalizada.', ephemeral: true })
            }

            const embedExportJson = EmbedBuilder.from(messageExportJson.embeds[0]);

            await interaction.reply({ embeds: [{ description: codeBlock(JSON.stringify(embedExportJson.toJSON())), color: 2829617 }], ephemeral: true })

            break;

        case 'CREATOR_IMPORT_JSON':

            const modalCreatorImportJson = new ModalBuilder()
                .setCustomId('CREATOR_IMPORT_JSON')
                .setTitle(`Criador de mensagem`)
                .setComponents(
                    new ActionRowBuilder().addComponents(
                        new TextInputBuilder()
                            .setCustomId('JSON_INPUT')
                            .setLabel('JSON')
                            .setStyle(TextInputStyle.Paragraph)
                            .setMinLength(1)
                            .setMaxLength(4000)
                            .setPlaceholder('Insira o JSON que deseja definir')
                            .setRequired(true)));

            await interaction.showModal(modalCreatorImportJson);
            break;

        case 'CREATOR_SEND':

            const menuCreatorSend = new ActionRowBuilder()
                .addComponents(new ChannelSelectMenuBuilder()
                    .setCustomId(`CREATOR_SELECT_CHANNEL`)
                    .setPlaceholder(`Clique para selecionar um canal.`));

            const buttonCreatorBack = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('CREATOR_BACK')
                    .setLabel('Voltar')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji(`<:1095137898262695937:1166902501572870195>`));

            const messageSend = interaction.message;

            if (!messageSend.embeds) {
                return await interaction.reply({ content: 'A mensagem não contém nenhuma mensagem personalizada.', ephemeral: true })
            }
            await interaction.update({ components: [menuCreatorSend, buttonCreatorBack] });
            break;


        case 'CREATOR_BACK': {

            const buttonCreator = [
                new discord.ActionRowBuilder().addComponents(
                    new discord.ButtonBuilder()
                        .setCustomId('CREATOR_SET_TITLE')
                        .setLabel('Definir titulo')
                        .setStyle(discord.ButtonStyle.Secondary)
                        .setEmoji(`🗨`),
                    new discord.ButtonBuilder()
                        .setCustomId('CREATOR_SET_DESCRIPTION')
                        .setLabel('Definir descrição')
                        .setStyle(discord.ButtonStyle.Secondary)
                        .setEmoji(`📃`),
                    new discord.ButtonBuilder()
                        .setCustomId('CREATOR_SET_COLOR')
                        .setLabel('Definir cor')
                        .setStyle(discord.ButtonStyle.Secondary)
                        .setEmoji(`🧪`),
                    new discord.ButtonBuilder()
                        .setCustomId('CREATOR_SET_IMAGE')
                        .setLabel('Definir imagem')
                        .setStyle(discord.ButtonStyle.Secondary)
                        .setEmoji(`🖼`),
                ),
                new discord.ActionRowBuilder().addComponents(
                    new discord.ButtonBuilder()
                        .setCustomId('CREATOR_SET_THUMBNAIL')
                        .setLabel('Definir miniatura')
                        .setStyle(discord.ButtonStyle.Secondary)
                        .setEmoji(`🖼`),
                    new discord.ButtonBuilder()
                        .setCustomId('CREATOR_SET_AUTHOR')
                        .setLabel('Definir autor')
                        .setStyle(discord.ButtonStyle.Secondary)
                        .setEmoji(`🧒`),
                    new discord.ButtonBuilder()
                        .setCustomId('CREATOR_SET_FOOTER')
                        .setLabel('Definir rodape')
                        .setStyle(discord.ButtonStyle.Secondary)
                        .setEmoji(`📝`),
                    new discord.ButtonBuilder()
                        .setCustomId('CREATOR_MENTION_ROLE')
                        .setLabel('Mencionar cargo')
                        .setStyle(discord.ButtonStyle.Secondary)
                        .setEmoji(`📢`)
                ),
                new discord.ActionRowBuilder().addComponents(
                    new discord.ButtonBuilder()
                        .setCustomId('CREATOR_IMPORT_JSON')
                        .setLabel('Importar JSON')
                        .setStyle(discord.ButtonStyle.Primary)
                        .setEmoji(`⬇`),
                    new discord.ButtonBuilder()
                        .setCustomId('CREATOR_EXPORT_JSON')
                        .setLabel('Exportar JSON')
                        .setStyle(discord.ButtonStyle.Primary)
                        .setEmoji(`⬆`),
                    new discord.ButtonBuilder()
                        .setCustomId('CREATOR_SEND')
                        .setLabel('Enviar mensagem')
                        .setStyle(discord.ButtonStyle.Success)
                        .setEmoji(`📤`),
                )
            ];


            const message = interaction.message;

            if (!message.embeds) {
                return await interaction.reply({ content: 'A mensagem não contém nenhuma mensagem personalizada.', ephemeral: true })
            }

            await interaction.update({ components: buttonCreator });
        }
            break;


        default:
            break;
    }

})