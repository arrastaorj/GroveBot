const discord = require("discord.js");
const GuildConfig = require('../../database/models/auditlogs');

module.exports = {
    name: "untimeout",
    description: "Remover o timeout de um usuário",
    type: discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "user",
            description: "O usuário que será removido do timeout",
            type: discord.ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: "motivo",
            description: "Motivo da remoção do timeout",
            type: discord.ApplicationCommandOptionType.String,
            required: false,
        }
    ],

    run: async (client, interaction) => {
        // Verifica se o autor tem a permissão de moderar membros
        if (!interaction.member.permissions.has(discord.PermissionsBitField.Flags.ModerateMembers)) {
            return interaction.reply({ content: "> \`-\` <a:alerta:1163274838111162499> Você não tem permissão para remover timeout de membros.", ephemeral: true });
        }

        const user = interaction.options.getUser("user");
        const reason = interaction.options.getString("motivo") || "Sem motivo especificado";

        const member = interaction.guild.members.cache.get(user.id);

        // Verifica se o usuário está no servidor
        if (!member) {
            return interaction.reply({ content: "> \`-\` <a:alerta:1163274838111162499> Este usuário não está no servidor.", ephemeral: true });
        }

        // Verifica se o membro está em timeout
        if (!member.communicationDisabledUntil) {
            return interaction.reply({ content: "> \`-\` <a:alerta:1163274838111162499> Este usuário não está atualmente em timeout.", ephemeral: true });
        }

        // Removendo o timeout
        try {
            await member.timeout(null, reason); // Passar `null` remove o timeout

            // Cria o embed de confirmação da remoção do timeout
            const untimeoutEmbed = new discord.EmbedBuilder()
                .setColor("#00ff00")
                .setTitle("✅ Timeout Removido!")
                .setDescription(`O timeout do usuário **${user.tag}** foi removido com sucesso.`)
                .addFields(
                    { name: "Motivo", value: `💬 ${reason}` },
                    { name: "Moderador", value: `👮‍♂️ ${interaction.user.tag}` }
                )
                .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                .setTimestamp();

            await interaction.reply({ embeds: [untimeoutEmbed] });

            // Busca a configuração do servidor para o canal de logs
            const guildConfig = await GuildConfig.findOne({
                guildId: interaction.guild.id
            });

            if (!guildConfig) {
                // Caso não haja configuração, informa o moderador
                return interaction.followUp({ content: "> \`-\` <a:alerta:1163274838111162499> O canal de logs não foi configurado neste servidor. Nenhum log foi gerado. Você pode usar **/audit logs** para configurar um novo canal de logs.", ephemeral: true });
            }

            const logChannel = client.channels.cache.get(guildConfig.canal);

            if (logChannel) {
                // Cria o embed com as informações da remoção do timeout para o canal de logs
                const logEmbed = new discord.EmbedBuilder()
                    .setTitle("✅ Timeout Removido")
                    .setColor("#00ff00")
                    .addFields(
                        { name: "Usuário", value: `👤 ${user.tag} (${user.id})` },
                        { name: "Moderador", value: `👮‍♂️ ${interaction.user.tag} (${interaction.user.id})` },
                        { name: "Motivo", value: `💬 ${reason}` }
                    )
                    .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                    .setTimestamp();

                // Envia o embed no canal de logs
                logChannel.send({ embeds: [logEmbed] });
            } else {
                return interaction.followUp({ content: "> \`-\` <a:alerta:1163274838111162499> O canal de logs configurado não foi encontrado. Nenhum log foi gerado. Você pode usar **/audit logs** para configurar um novo canal de logs.", ephemeral: true });
            }
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: "> \`-\` <a:alerta:1163274838111162499> Ocorreu um erro ao tentar remover o timeout deste usuário.", ephemeral: true });
        }
    }
};
