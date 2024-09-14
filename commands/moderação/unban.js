const discord = require("discord.js");
const GuildConfig = require('../../database/models/auditlogs');

module.exports = {
    name: "unban",
    description: "Desbanir um usuário do servidor",
    type: discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "userid",
            description: "ID do usuário a ser desbanido",
            type: discord.ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "motivo",
            description: "Motivo do desbanimento",
            type: discord.ApplicationCommandOptionType.String,
            required: false,
        }
    ],

    run: async (client, interaction) => {
        // Verifica se o autor tem a permissão de desbanir
        if (!interaction.member.permissions.has(discord.PermissionsBitField.Flags.BanMembers)) {
            return interaction.reply({ content: "🚫 Você não tem permissão para desbanir membros.", ephemeral: true });
        }

        const userId = interaction.options.getString("userid");
        const reason = interaction.options.getString("motivo") || "Sem motivo especificado";

        // Verifica se o ID é válido
        if (!userId || isNaN(userId)) {
            return interaction.reply({ content: "⚠️ Forneça um ID de usuário válido.", ephemeral: true });
        }

        try {
            // Tenta buscar o banimento
            const banInfo = await interaction.guild.bans.fetch(userId);

            if (!banInfo) {
                return interaction.reply({ content: "⚠️ Este usuário não está banido.", ephemeral: true });
            }

            // Desbanindo o usuário
            await interaction.guild.members.unban(userId, reason);

            // Cria o embed de confirmação do desbanimento
            const unbanEmbed = new discord.EmbedBuilder()
                .setColor("#00ff00")
                .setTitle("🔓 Desbanimento Realizado!")
                .setDescription(`O usuário **${banInfo.user.tag}** foi desbanido com sucesso.`)
                .addFields(
                    { name: "Motivo", value: `💬 ${reason}` },
                    { name: "Moderador", value: `👮‍♂️ ${interaction.user.tag}` }
                )
                .setThumbnail(banInfo.user.displayAvatarURL({ dynamic: true }))
                .setTimestamp();

            await interaction.reply({ embeds: [unbanEmbed] });

            // Busca a configuração do servidor para o canal de logs
            const guildConfig = await GuildConfig.findOne({
                guildId: interaction.guild.id
            });

            if (!guildConfig) {
                // Caso não haja configuração, informa o moderador
                return interaction.followUp({ content: "⚠️ O canal de logs não foi configurado neste servidor. Nenhum log foi gerado.", ephemeral: true });
            }

            const logChannel = client.channels.cache.get(guildConfig.canal);

            if (logChannel) {
                // Cria o embed com as informações do desbanimento para o canal de logs
                const logEmbed = new discord.EmbedBuilder()
                    .setTitle("🔓 Usuário Desbanido")
                    .setColor("#00ff00")
                    .addFields(
                        { name: "Usuário", value: `👤 ${banInfo.user.tag} (${banInfo.user.id})` },
                        { name: "Moderador", value: `👮‍♂️ ${interaction.user.tag} (${interaction.user.id})` },
                        { name: "Motivo", value: `💬 ${reason}` }
                    )
                    .setThumbnail(banInfo.user.displayAvatarURL({ dynamic: true }))
                    .setTimestamp();

                // Envia o embed no canal de logs
                logChannel.send({ embeds: [logEmbed] });
            } else {
                return interaction.followUp({ content: "⚠️ O canal de logs configurado não foi encontrado. Nenhum log foi gerado.", ephemeral: true });
            }
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: "❗ Ocorreu um erro ao tentar desbanir este usuário. Verifique se o ID está correto.", ephemeral: true });
        }
    }
};
