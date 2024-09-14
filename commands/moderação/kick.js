const discord = require("discord.js");
const GuildConfig = require('../../database/models/auditlogs');

module.exports = {
    name: "kick",
    description: "Expulsar um usuário do servidor",
    type: discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "user",
            description: "O usuário a ser expulso",
            type: discord.ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: "motivo",
            description: "Motivo da expulsão",
            type: discord.ApplicationCommandOptionType.String,
            required: false,
        }
    ],

    run: async (client, interaction) => {
        // Verifica se o autor tem a permissão de expulsar
        if (!interaction.member.permissions.has(discord.PermissionsBitField.Flags.KickMembers)) {
            return interaction.reply({ content: "🚫 Você não tem permissão para expulsar membros.", ephemeral: true });
        }

        const user = interaction.options.getUser("user");
        const reason = interaction.options.getString("motivo") || "Sem motivo especificado";

        const member = interaction.guild.members.cache.get(user.id);

        // Verifica se o usuário está no servidor
        if (!member) {
            return interaction.reply({ content: "⚠️ Este usuário não está no servidor.", ephemeral: true });
        }

        // Verifica se o membro pode ser expulso (não pode expulsar administradores)
        if (!member.kickable) {
            return interaction.reply({ content: "❌ Eu não posso expulsar este usuário.", ephemeral: true });
        }

        // Expulsando o membro
        try {
            await member.kick(reason);

            // Cria o embed de confirmação da expulsão
            const kickEmbed = new discord.EmbedBuilder()
                .setColor("#ffa500")
                .setTitle("👢 Expulsão Realizada!")
                .setDescription(`O usuário **${user.tag}** foi expulso com sucesso.`)
                .addFields(
                    { name: "Motivo", value: `💬 ${reason}` },
                    { name: "Moderador", value: `👮‍♂️ ${interaction.user.tag}` }
                )
                .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                .setTimestamp();

            await interaction.reply({ embeds: [kickEmbed] });

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
                // Cria o embed com as informações da expulsão para o canal de logs
                const logEmbed = new discord.EmbedBuilder()
                    .setTitle("👢 Usuário Expulso")
                    .setColor("#ffa500")
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
            await interaction.reply({ content: "❗ Ocorreu um erro ao tentar expulsar este usuário.", ephemeral: true });
        }
    }
};
