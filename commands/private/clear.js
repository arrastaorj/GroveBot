const discord = require('discord.js');

module.exports = {
    name: 'clear',
    description: 'Limpe as mensagens de um chat.',
    type: discord.ApplicationCommandType.ChatInput,

    run: async (client, interaction, args) => {
        let numero = 50 + 49;

        if (!interaction.member.permissions.has(discord.PermissionFlagsBits.ManageChannels)) {
            return interaction.reply({
                content: "> \`-\` <a:alerta:1163274838111162499> Não posso concluir este comando pois você não possui permissão.",
                ephemeral: true,
            });
        }

        const botMember = interaction.member.guild.members.cache.get(client.user.id);
        const hasPermission = botMember.permissions.has("Administrator");

        if (hasPermission) {
            interaction.channel.bulkDelete(numero, true);

            // Log do comando
            logCommand(interaction);

            let embed = new discord.EmbedBuilder()
                .setTitle(`Limpeza concluída`)
                .setDescription(`**Observação:** Você só pode excluir mensagens em massa com menos de 14 dias.`)
                .setTimestamp()
                .setFooter({ text: `Limpado por: ${interaction.member.user.username}`, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })
                .setColor("#41b2b0");

            interaction.reply({ embeds: [embed], ephemeral: true });
        } else {
            return interaction.reply({
                content: "> \`-\` <a:alerta:1163274838111162499> Não posso concluir o comandos pois ainda não recebi permissão para gerenciar este servidor (Administrador)",
                ephemeral: true,
            });
        }
    },
};

// Função para logs
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
