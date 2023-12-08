const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

const pauseRow = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('play')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('<:rightarrowblacktriangle_38483:1181029039159386202>'),
        new ButtonBuilder()
            .setCustomId('skip')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('<:_4202450:1180472202865414205>'),
        new ButtonBuilder()
            .setCustomId('disconnect')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('<:stop:1182489697327525889>'),
        new ButtonBuilder()
            .setCustomId('autoplay')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('<:autoplay:1182488248019329104>'),

    )

const playRow = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('pause')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('<:pause_37505:1180473260853448835>'),
        new ButtonBuilder()
            .setCustomId('skip')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('<:_4202450:1180472202865414205>'),
        new ButtonBuilder()
            .setCustomId('disconnect')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('<:stop:1182489697327525889>'),
        new ButtonBuilder()
            .setCustomId('autoplay')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('<:autoplay:1182488248019329104>'),

    )

const skipRowDisabled = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('pause')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('<:pause_37505:1180473260853448835>')
            .setDisabled(true),
        new ButtonBuilder()
            .setCustomId('skip')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('<:_4202450:1180472202865414205>')
            .setDisabled(true),
        new ButtonBuilder()
            .setCustomId('disconnect')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('<:stop:1182489697327525889>')
            .setDisabled(true),
        new ButtonBuilder()
            .setCustomId('autoplay')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('<:autoplay:1182488248019329104>')
            .setDisabled(true),
        new ButtonBuilder()
            .setCustomId('skiped')
            .setStyle(ButtonStyle.Success)
            .setLabel('Ignorado')
            .setDisabled(true)
    );


const disconnectRow = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('play')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('<:rightarrowblacktriangle_38483:1181029039159386202>')
            .setDisabled(true),
        new ButtonBuilder()
            .setCustomId('skip')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('<:_4202450:1180472202865414205>')
            .setDisabled(true),
        new ButtonBuilder()
            .setCustomId('disconnect')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('<:stop:1182489697327525889>')
            .setDisabled(true),
        new ButtonBuilder()
            .setCustomId('autoplay')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('<:autoplay:1182488248019329104>')
            .setDisabled(true),
        new ButtonBuilder()
            .setCustomId('skiped')
            .setStyle(ButtonStyle.Danger)
            .setLabel('Desconectado')
            .setDisabled(true)
    )



module.exports = {
    pauseRow,
    playRow,
    skipRowDisabled,
    disconnectRow,
}