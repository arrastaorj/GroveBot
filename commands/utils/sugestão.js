const discord = require('discord.js')

module.exports = {

    name: 'sugestão',
    description: 'Envie uma sugestão para nossa equipe.',
    type: discord.ApplicationCommandType.ChatInput,


    run: async (client, interaction) => {

        logCommand(interaction);

        
        const modal = new discord.ModalBuilder()
            .setCustomId('modal_sugestao')
            .setTitle(`Olá usuário, Nos diga qual é a sua sugestão.`)
        const sugestao3 = new discord.TextInputBuilder()
            .setCustomId('sugestão')
            .setLabel('Qual sua sugestão?')
            .setStyle(discord.TextInputStyle.Paragraph)

        const firstActionRow = new discord.ActionRowBuilder().addComponents(sugestao3)
        modal.addComponents(firstActionRow)
        await interaction.showModal(modal)

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
