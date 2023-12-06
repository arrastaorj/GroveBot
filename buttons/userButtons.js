const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

const btnInfo = new ActionRowBuilder().addComponents([
    new ButtonBuilder()
        .setStyle(ButtonStyle.Primary)
        .setLabel("Mais Informação")
        .setCustomId("infos"),
])
const btnPaginaInicial = new ActionRowBuilder().addComponents([
    new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setLabel("Pagina Inicial")
        .setCustomId("inicial"),
])
const btnAvatarBannerPermissão = new ActionRowBuilder().addComponents([

    new ButtonBuilder()
        .setStyle(ButtonStyle.Primary)
        .setLabel("Avatar")
        .setCustomId("avatar"),

    new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setLabel("Banner")
        .setCustomId("banner"),

    new ButtonBuilder()
        .setLabel('Permissões do Membro')
        .setEmoji("<:9081settings:1167219166898557029>")
        .setStyle(ButtonStyle.Danger)
        .setCustomId('verPerms')

])
const btnVoltar = new ActionRowBuilder().addComponents([

    new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setLabel("Voltar")
        .setCustomId("voltar"),

])
const btnAvatarPermissão = new ActionRowBuilder().addComponents([
    new ButtonBuilder()
        .setStyle(ButtonStyle.Primary)
        .setLabel("Avatar")
        .setCustomId("avatar"),

    new ButtonBuilder()
        .setLabel('Permissões do Membro')
        .setEmoji("<:9081settings:1167219166898557029>")
        .setStyle(ButtonStyle.Danger)
        .setCustomId('verPerms')
])

module.exports = {
    btnInfo,
    btnPaginaInicial,
    btnAvatarBannerPermissão,
    btnVoltar,
    btnAvatarPermissão
}