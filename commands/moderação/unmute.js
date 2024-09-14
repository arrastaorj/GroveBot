const discord = require("discord.js");
const GuildConfig = require('../../database/models/auditlogs');

module.exports = {
    name: "unmute",
    description: "Remover o mute de um usuário",
    type: discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "user",
            description: "O usuário a ser desmutado",
            type: discord.ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: "motivo",
            description: "Motivo para remover o mute",
            type: discord.ApplicationCommandOptionType.String,
            required: false,
        }
    ],

    run: async (client, interaction) => {
        // Verifica se o autor tem a permissão de moderar membros
        if (!interaction.member.permissions.has(discord.PermissionsBitField.Flags.ModerateMembers)) {
            return interaction.reply({ content: "🚫 Você não tem permissão para desmutar membros.", ephemeral: true });
        }

        const user = interaction.options.getUser("user");
        const reason = interaction.options.getString("motivo") || "Sem motivo especificado";

        const member = interaction.guild.members.cache.get(user.id);

        // Verifica se o usuário está no servidor
        if (!member) {
            return interaction.reply({ content: "⚠️ Este usuário não está no servidor.", ephemeral: true });
        }

        // Verifica se o membro está mutado (tem o cargo de mute)
        const muteRole = interaction.guild.roles.cache.find(role => role.name.toLowerCase() === "mutado");
        if (!muteRole) {
            return interaction.reply({ content: "⚠️ O cargo de 'mutado' não foi encontrado. Verifique se ele existe.", ephemeral: true });
        }

        if (!member.roles.cache.has(muteRole.id)) {
            return interaction.reply({ content: "⚠️ Este usuário não está mutado.", ephemeral: true });
        }

        // Removendo o cargo de mute do usuário
        try {
            await member.roles.remove(muteRole, reason);

            // Cria o embed de confirmação da remoção do mute
            const unmuteEmbed = new discord.EmbedBuilder()
                .setColor("#00ff00")
                .setTitle("🔊 Usuário Desmutado!")
                .setDescription(`O usuário **${user.tag}** foi desmutado com sucesso.`)
                .addFields(
                    { name: "Motivo", value: `💬 ${reason}` },
                    { name: "Moderador", value: `👮‍♂️ ${interaction.user.tag}` }
                )
                .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                .setTimestamp();

            await interaction.reply({ embeds: [unmuteEmbed] });

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
                // Cria o embed com as informações da remoção do mute para o canal de logs
                const logEmbed = new discord.EmbedBuilder()
                    .setTitle("🔊 Usuário Desmutado")
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
                return interaction.followUp({ content: "⚠️ O canal de logs configurado não foi encontrado. Nenhum log foi gerado.", ephemeral: true });
            }
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: "❗ Ocorreu um erro ao tentar desmutar este usuário.", ephemeral: true });
        }
    }
};
