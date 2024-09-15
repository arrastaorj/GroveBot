const discord = require("discord.js");
const idioma = require("../../database/models/language");
const GuildConfigLogs = require('../../database/models/auditlogs'); // Importação correta do modelo de logs

module.exports = {
    name: "destrancar",
    description: "Destrancar esse canal de texto.",
    type: discord.ApplicationCommandType.ChatInput,

    run: async (client, interaction, args) => {

        let lang = await idioma.findOne({
            guildId: interaction.guild.id
        });
        lang = lang ? require(`../../languages/${lang.language}.js`) : require('../../languages/pt.js');

        // Verificação para garantir que apenas quem tem permissão possa usar o comando
        if (!interaction.member.permissions.has(discord.PermissionFlagsBits.ManageChannels)) {
            return interaction.reply({
                content: `${lang.alertNaoTemPermissão}`,
                ephemeral: true
            });
        }

        // Responder primeiro para evitar o erro
        await interaction.reply({
            content: `${lang.msg140}`,
            ephemeral: true
        });

        // Destrancar o canal
        await interaction.channel.permissionOverwrites.edit(interaction.guild.id, { SendMessages: true });

        // Busca a configuração do servidor para o canal de logs
        const guildConfigLogs = await GuildConfigLogs.findOne({
            guildId: interaction.guild.id
        });

        if (!guildConfigLogs || !guildConfigLogs.canal) {
            // Caso não haja configuração, informa o moderador
            return interaction.followUp({
                content: "> `-` <a:alerta:1163274838111162499> O canal de logs não foi configurado neste servidor. Nenhum log foi gerado. Você pode usar **/audit logs** para configurar um novo canal de logs.",
                ephemeral: true
            });
        }

        // Verifica se o canal de logs ainda existe no cache
        const logChannelLogs = client.channels.cache.get(guildConfigLogs.canal);

        if (!logChannelLogs) {
            // Caso o canal tenha sido apagado, avisa o moderador
            return interaction.followUp({
                content: "> `-` <a:alerta:1163274838111162499> O canal de logs configurado foi removido ou está inacessível. Nenhum log foi gerado. Use **/audit logs** para configurar um novo canal de logs.",
                ephemeral: true
            });
        }

        // Se o canal de logs existir, enviar um log de destrancamento
        const embed = new discord.EmbedBuilder()
            .setTitle("🔓 Canal de texto destrancado")
            .setColor("#00ff00")
            .addFields(
                { name: "Servidor", value: interaction.guild.name },
                { name: "Moderador", value: interaction.user.tag },
                { name: "Canal", value: `<#${interaction.channel.id}>` }
            )
            .setTimestamp();

        logChannelLogs.send({ embeds: [embed] });
    }
};
