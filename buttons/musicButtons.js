const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

const pauseRow = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('voltar')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('<:voltar:1183481878313967758>'),
        new ButtonBuilder()
            .setCustomId('play')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('<:play:1183481874115461190>'),
        new ButtonBuilder()
            .setCustomId('skip')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('<:pular:1183481876447506552>'),
    )

const pauseRow2 = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('disconnect')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('<:encerra:1183505672252440687>'),
        new ButtonBuilder()
            .setCustomId('autoplay')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('<:autoplay:1183505674328604743>'),
        new ButtonBuilder()
            .setCustomId('fila')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('<:filas:1183481870051201184>'),
    )


const playRow = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('voltar')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('<:voltar:1183481878313967758>'),
        new ButtonBuilder()
            .setCustomId('pause')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('<:pause:1183481872374845531>'),
        new ButtonBuilder()
            .setCustomId('skip')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('<:pular:1183481876447506552>'),
    )
const playRow2 = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('disconnect')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('<:encerra:1183505672252440687>'),
        new ButtonBuilder()
            .setCustomId('autoplay')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('<:autoplay:1183505674328604743>'),

        new ButtonBuilder()
            .setCustomId('fila')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('<:filas:1183481870051201184>'),
    )


const skipRowDisabled = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('voltar')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('<:voltar:1183481878313967758>')
            .setDisabled(true),
        new ButtonBuilder()
            .setCustomId('pause')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('<:pause:1183481872374845531>')
            .setDisabled(true),
        new ButtonBuilder()
            .setCustomId('skip')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('<:pular:1183481876447506552>')
            .setDisabled(true),

    );

const skipRowDisabled2 = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('disconnect')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('<:encerra:1183505672252440687>')
            .setDisabled(true),
        new ButtonBuilder()
            .setCustomId('autoplay')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('<:autoplay:1183505674328604743>')
            .setDisabled(true),
        new ButtonBuilder()
            .setCustomId('skiped')
            .setStyle(ButtonStyle.Success)
            .setLabel('Ignorado')
            .setDisabled(true)

    )

const disconnectRow = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('voltar')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('<:voltar:1183481878313967758>')
            .setDisabled(true),
        new ButtonBuilder()
            .setCustomId('play')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('<:play:1183481874115461190>')
            .setDisabled(true),
        new ButtonBuilder()
            .setCustomId('skip')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('<:pular:1183481876447506552>')
            .setDisabled(true),




    )
const disconnectRow2 = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('disconnect')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('<:encerra:1183505672252440687>')
            .setDisabled(true),
        new ButtonBuilder()
            .setCustomId('autoplay')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('<:autoplay:1183505674328604743>')
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
    pauseRow2,
    playRow2,
    skipRowDisabled2,
    disconnectRow2,
}