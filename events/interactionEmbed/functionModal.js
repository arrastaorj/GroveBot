const client = require('../../index')
const discord = require("discord.js")
const { ModalBuilder, roleMention, ActionRowBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, codeBlock, ChannelSelectMenuBuilder, ButtonBuilder, ButtonStyle, RoleSelectMenuBuilder } = require("discord.js");
const { isHex, isImage, isLink } = require("./functionsManager");
const { buttonCreator } = require("../../commands/administração/embed");
const idioma = require("../../database/models/language")

client.on("interactionCreate", async (interaction) => {


    if (!interaction.isModalSubmit()) return

    const modal = interaction.fields;
    const message = interaction.message;


    switch (interaction.customId) {

        case 'CREATOR_SET_TITLE': {
            return await creatorSetTitle(interaction, modal);
        }
        case 'CREATOR_SET_DESCRIPTION': {
            return await creatorSetDescription(interaction, modal);
        }
        case 'CREATOR_SET_COLOR': {
            return await creatorSetColor(interaction, modal);
        }
        case 'CREATOR_SET_IMAGE': {
            return await creatorSetImage(interaction, modal);
        }
        case 'CREATOR_SET_THUMBNAIL': {
            return await creatorSetThumbnail(interaction, modal);
        }
        case 'CREATOR_SET_AUTHOR': {
            return await creatorSetAuthor(interaction, modal);
        }
        case 'CREATOR_SET_FOOTER': {
            return await creatorSetFooter(interaction, modal);
        }
        case 'CREATOR_IMPORT_JSON': {
            return await creatorImportJson(interaction, modal);
        }

    }


})

const creatorSetTitle = async (interaction, modal) => {

    let lang = await idioma.findOne({
        guildId: interaction.guild.id
    })
    lang = lang ? require(`../../languages/${lang.language}.js`) : require('../../languages/pt.js')


    const message = interaction.message;

    if (!message.embeds) {
        return await interaction.reply({
            content: `${lang.msg375}`,
            ephemeral: true
        })
    }
    const title = modal.getTextInputValue('TITLE_INPUT');
    const embed = EmbedBuilder.from(message.embeds[0]).setTitle(title);

    await interaction.update({
        embeds: [embed]
    }).catch(() => false);
}

const creatorSetDescription = async (interaction, modal) => {


    let lang = await idioma.findOne({
        guildId: interaction.guild.id
    })
    lang = lang ? require(`../../languages/${lang.language}.js`) : require('../../languages/pt.js')


    const message = interaction.message;

    if (!message.embeds) {
        return await interaction.reply({
            content: `${lang.msg375}`,
            ephemeral: true
        })
    }

    const description = modal.getTextInputValue('DESCRIPTION_INPUT');
    const embed = EmbedBuilder.from(message.embeds[0]).setDescription(description.replaceAll('\\n', '\n'));

    await interaction.update({
        embeds: [embed]
    }).catch(() => false);
}

const creatorSetColor = async (interaction, modal) => {

    let lang = await idioma.findOne({
        guildId: interaction.guild.id
    })
    lang = lang ? require(`../../languages/${lang.language}.js`) : require('../../languages/pt.js')


    const message = interaction.message;

    if (!message.embeds) {
        return await interaction.reply({
            content: `${lang.msg375}`,
            ephemeral: true
        })
    }

    const color = modal.getTextInputValue('COLOR_INPUT');
    const embed = EmbedBuilder.from(message.embeds[0]);

    if (color) {
        if (!isHex(color)) {
            return await interaction.reply({
                content: `${lang.msg390}`,
                ephemeral: true
            });
        }
        embed.setColor(color)
    } else {
        embed.setColor(null);
    }
    await interaction.update({
        embeds: [embed]
    }).catch(() => false);
}

const creatorSetImage = async (interaction, modal) => {


    let lang = await idioma.findOne({
        guildId: interaction.guild.id
    })
    lang = lang ? require(`../../languages/${lang.language}.js`) : require('../../languages/pt.js')


    const message = interaction.message;

    if (!message.embeds) {
        return await interaction.reply({
            content: `${lang.msg375}`,
            ephemeral: true
        })
    }

    const image = modal.getTextInputValue('IMAGE_INPUT');
    const embed = EmbedBuilder.from(message.embeds[0]);

    if (image) {
        if (!isImage(image)) {
            return await interaction.reply({
                content: `${lang.msg391}`,
                ephemeral: true
            });
        }
        embed.setImage(image)
    } else {
        embed.setImage(null);
    }
    await interaction.update({
        embeds: [embed]
    }).catch(() => false);
}

const creatorSetThumbnail = async (interaction, modal) => {


    let lang = await idioma.findOne({
        guildId: interaction.guild.id
    })
    lang = lang ? require(`../../languages/${lang.language}.js`) : require('../../languages/pt.js')


    const message = interaction.message;

    if (!message.embeds) {
        return await interaction.reply({
            content: `${lang.msg375}`,
            ephemeral: true
        })
    }

    const thumbnail = modal.getTextInputValue('THUMBNAIL_INPUT');
    const embed = EmbedBuilder.from(message.embeds[0]);

    if (thumbnail) {
        if (!isImage(thumbnail)) {
            return await interaction.reply({
                content: `${lang.msg392}`,
                ephemeral: true
            });
        }
        embed.setThumbnail(thumbnail)
    } else {
        embed.setThumbnail(null);
    }

    await interaction.update({
        embeds: [embed]
    }).catch(() => false);
}

const creatorSetAuthor = async (interaction, modal) => {


    let lang = await idioma.findOne({
        guildId: interaction.guild.id
    })
    lang = lang ? require(`../../languages/${lang.language}.js`) : require('../../languages/pt.js')


    const message = interaction.message;

    if (!message.embeds) {
        return await interaction.reply({
            content: `${lang.msg375}`,
            ephemeral: true
        })
    }

    const authorName = modal.getTextInputValue('AUTHOR_INPUT');
    const authorIcon = modal.getTextInputValue('ICON_INPUT');
    const authorUrl = modal.getTextInputValue('URL_INPUT');
    const embed = EmbedBuilder.from(message.embeds[0]);

    if (authorName) {
        embed.setAuthor({ name: authorName });
        if (authorIcon) {
            if (!isImage(authorIcon)) {
                return await interaction.reply({
                    content: `${lang.msg393}`,
                    ephemeral: true
                });
            }
            embed.setAuthor({ name: embed.data.author.name, iconURL: authorIcon, url: embed.data.author.url })
        }
        if (authorUrl) {
            if (!isLink(authorUrl)) {
                return await interaction.reply({
                    content: `${lang.msg394}`,
                    ephemeral: true
                })
            }
            embed.setAuthor({ name: embed.data.author.name, iconURL: embed.data.author.icon_url, url: authorUrl })
        }
    } else {
        embed.setAuthor(null);
    }
    await interaction.update({
        embeds: [embed]
    }).catch(() => false);
}

const creatorSetFooter = async (interaction, modal) => {


    let lang = await idioma.findOne({
        guildId: interaction.guild.id
    })
    lang = lang ? require(`../../languages/${lang.language}.js`) : require('../../languages/pt.js')


    const author = interaction.message.interaction.user;
    const message = interaction.message;

    if (!message.embeds) {
        return await interaction.reply({
            content: `${lang.msg375}`,
            ephemeral: true
        })
    }

    const footerText = modal.getTextInputValue('FOOTER_INPUT');
    const footerIcon = modal.getTextInputValue('ICON_INPUT');
    const embed = EmbedBuilder.from(message.embeds[0]);

    if (footerText) {
        embed.setFooter({ text: footerText });
        if (footerIcon) {
            if (!isImage(footerIcon)) {
                return await interaction.reply({
                    content: `${lang.msg395}`,
                    ephemeral: true
                });
            }
            embed.setFooter({ text: embed.data.footer.text, iconURL: footerIcon })
        }
    } else {
        embed.setFooter(null);
    }
    await interaction.update({
        embeds: [embed]
    }).catch(() => false);
}

const creatorImportJson = async (interaction, modal) => {


    let lang = await idioma.findOne({
        guildId: interaction.guild.id
    })
    lang = lang ? require(`../../languages/${lang.language}.js`) : require('../../languages/pt.js')


    const message = interaction.message;

    if (!message.embeds) {
        return await interaction.reply({
            content: `${lang.msg375}`,
            ephemeral: true
        })
    }

    try {
        const json = modal.getTextInputValue('JSON_INPUT');
        const embed = EmbedBuilder.from(JSON.parse(json));

        await interaction.update({
            embeds: [embed]
        }).catch(() => false);
    } catch (e) {
        await interaction.reply({
            content: `${lang.msg396}`,
            ephemeral: true
        })
    }
}