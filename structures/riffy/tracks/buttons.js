const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

const pauseRow = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('disconnect')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('⏺'),

        new ButtonBuilder()
            .setCustomId('play')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('▶'),

        new ButtonBuilder()
            .setCustomId('skip')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('⏭')
    )

const playRow = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('disconnect')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('⏺'),

        new ButtonBuilder()
            .setCustomId('pause')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('⏸'),

        new ButtonBuilder()
            .setCustomId('skip')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('⏭')
    )

const skipRowDisabled = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('disconnect')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('⏺')
            .setDisabled(true),

        new ButtonBuilder()
            .setCustomId('pause')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('⏸')
            .setDisabled(true),

        new ButtonBuilder()
            .setCustomId('skip')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('⏭')
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
            .setCustomId('disconnect')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('⏺')
            .setDisabled(true),

        new ButtonBuilder()
            .setCustomId('play')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('▶')
            .setDisabled(true),

        new ButtonBuilder()
            .setCustomId('skip')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('⏭')
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