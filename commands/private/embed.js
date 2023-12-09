const discord = require("discord.js")

module.exports = {
    name: 'anunciar',
    description: 'Crie um anúncio utilizando um formato de incorporação personalizável',
    type: discord.ApplicationCommandType.ChatInput,


    run: async (client, interaction) => {


        if (!interaction.member.permissions.has(discord.PermissionFlagsBits.ManageChannels)) return interaction.reply({ content: "> \`-\` <a:alerta:1163274838111162499> Não posso concluir este comando pois você não possui permissão.", ephemeral: true })


        const botMember = interaction.member.guild.members.cache.get(client.user.id)
        const hasPermission = botMember.permissions.has("Administrator")

        if (hasPermission) {


            logCommand(interaction);


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

function logCommand(interaction) {
    const guildId = interaction.guild.name;
    const channelId = '1182895176004423730'; // Substitua pelo ID do canal de logs desejado
    const commandName = interaction.commandName;
    const executor = interaction.member.user.tag;
    const argsUsed = interaction.options.data.map(option => `${option.name}: ${option.value}`).join(', ');

    const channel = interaction.guild.channels.cache.get(channelId);

    if (channel) {
        const logEmbed = new discord.EmbedBuilder()
            .setTitle('Imput Logs')
            .setColor("#6dfef2")
            .addFields(
                {
                    name: "Comando",
                    value: `┕ \`${commandName}\``,
                    inline: false,
                },
                {
                    name: "Executor",
                    value: `┕ \`${executor}\``,
                    inline: false,
                },
                {
                    name: "Servidor",
                    value: `┕ \`${guildId}\``,
                    inline: false,
                },
                {
                    name: "Argumentos",
                    value: `┕ \`${argsUsed}\``,
                    inline: false,
                },
            )
            .setTimestamp()

        channel.send({ embeds: [logEmbed] });
    }
}