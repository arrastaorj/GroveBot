const { ApplicationCommandType } = require("discord.js")
const discord = require("discord.js")
const idioma = require("../../database/models/language")
const GuildConfigLogs = require('../../database/models/auditlogs'); // Importação correta do modelo de logs

module.exports = {
    name: "trancar",
    description: "Trancar esse canal de texto.",
    type: ApplicationCommandType.ChatInput,

    run: async (client, interaction, args) => {

        let lang = await idioma.findOne({
            guildId: interaction.guild.id
        });
        lang = lang ? require(`../../languages/${lang.language}.js`) : require('../../languages/pt.js');

        // Verificação para somente quem tiver permissão usar o comando
        if (!interaction.member.permissions.has(discord.PermissionFlagsBits.ManageChannels)) {
            return interaction.reply({
                content: `${lang.alertNaoTemPermissão}`,
                ephemeral: true
            });
        }

        // Responder primeiro para evitar erro
        await interaction.reply({
            content: `${lang.msg154}`,
            ephemeral: true
        });

        // Trancar o canal
        await interaction.channel.permissionOverwrites.edit(interaction.guild.id, { SendMessages: false });

        // Busca a configuração do servidor para o canal de logs
        const guildConfigLogs = await GuildConfigLogs.findOne({
            guildId: interaction.guild.id
        });

        // Verifica se o canal de logs foi configurado
        if (!guildConfigLogs || !guildConfigLogs.canal) {
            return interaction.followUp({
                content: "> `-` <a:alerta:1163274838111162499> O canal de logs não foi configurado neste servidor. Nenhum log foi gerado. Você pode usar **/audit logs** para configurar um novo canal de logs.",
                ephemeral: true
            });
        }

        // Verifica se o canal de logs ainda existe no cache
        const logChannelLogs = client.channels.cache.get(guildConfigLogs.canal);

        if (!logChannelLogs) {
            return interaction.followUp({
                content: "> `-` <a:alerta:1163274838111162499> O canal de logs configurado foi removido ou está inacessível. Nenhum log foi gerado. Use **/audit logs** para configurar um novo canal de logs.",
                ephemeral: true
            });
        }

        // Se o canal existir, envia um log de trancamento
        const embed = new discord.EmbedBuilder()
            .setTitle("🔒 Canal de texto trancado")
            .setColor("#00ff00")
            .addFields(
                { name: "Servidor", value: interaction.guild.name },
                { name: "Moderador", value: interaction.user.tag },
                { name: "Canal", value: `<#${interaction.channel.id}>` }
            )
            .setTimestamp();

        logChannelLogs.send({ embeds: [embed] });
    }
}
