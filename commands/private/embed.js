const discord = require("discord.js")

module.exports = {
    name: 'criador',
    description: 'Sem descrição',
    type: discord.ApplicationCommandType.ChatInput,


    run: async (client, interaction) => {


        const botMember = interaction.member.guild.members.cache.get(client.user.id)
        const hasPermission = botMember.permissions.has("Administrator")

        if (hasPermission) {


            const embedEmpty = new discord.EmbedBuilder()
                .setTitle('Titulo Defaut')
                .setDescription('Descrição Defaut.')


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

            interaction.reply({ embeds: [embedEmpty], components: buttonCreator, ephemeral: true });

        } else {

            return interaction.reply({ content: "> \`+\` Não posso concluir o comandos pois ainda não recebir permissão para gerenciar este servidor (Administrador)", ephemeral: true })
        }

    }
}
