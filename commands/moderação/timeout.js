const discord = require("discord.js");
const ms = require("ms"); // Biblioteca opcional para facilitar a conversão de tempo (ex: '10m', '1h')
const GuildConfig = require('../../database/models/auditlogs');

module.exports = {
    name: "timeout",
    description: "Aplicar um timeout (silenciamento temporário) a um usuário",
    type: discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "user",
            description: "O usuário a ser silenciado",
            type: discord.ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: "tempo",
            description: "Duração do timeout (exemplo: 10m, 1h, 1d)",
            type: discord.ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "motivo",
            description: "Motivo do timeout",
            type: discord.ApplicationCommandOptionType.String,
            required: false,
        }
    ],

    run: async (client, interaction) => {
        // Verifica se o autor tem a permissão de moderar membros
        if (!interaction.member.permissions.has(discord.PermissionsBitField.Flags.ModerateMembers)) {
            return interaction.reply({ content: "🚫 Você não tem permissão para aplicar timeout em membros.", ephemeral: true });
        }

        const user = interaction.options.getUser("user");
        const duration = interaction.options.getString("tempo");
        const reason = interaction.options.getString("motivo") || "Sem motivo especificado";

        const member = interaction.guild.members.cache.get(user.id);

        // Verifica se o usuário está no servidor
        if (!member) {
            return interaction.reply({ content: "⚠️ Este usuário não está no servidor.", ephemeral: true });
        }

        // Verifica se o membro pode ser silenciado (não pode aplicar timeout a administradores)
        if (!member.moderatable) {
            return interaction.reply({ content: "❌ Eu não posso aplicar timeout neste usuário.", ephemeral: true });
        }

        // Converte o tempo para milissegundos
        const timeInMs = ms(duration);
        if (!timeInMs || timeInMs < 10000 || timeInMs > 2419200000) { // Entre 10 segundos e 28 dias
            return interaction.reply({ content: "⚠️ O tempo de timeout deve ser entre 10 segundos e 28 dias.", ephemeral: true });
        }

        // Aplicando o timeout
        try {
            await member.timeout(timeInMs, reason);

            // Cria o embed de confirmação do timeout
            const timeoutEmbed = new discord.EmbedBuilder()
                .setColor("#ff9900")
                .setTitle("⏳ Timeout Aplicado!")
                .setDescription(`O usuário **${user.tag}** foi silenciado por **${duration}**.`)
                .addFields(
                    { name: "Motivo", value: `💬 ${reason}` },
                    { name: "Moderador", value: `👮‍♂️ ${interaction.user.tag}` }
                )
                .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                .setTimestamp();

            await interaction.reply({ embeds: [timeoutEmbed] });

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
                // Cria o embed com as informações do timeout para o canal de logs
                const logEmbed = new discord.EmbedBuilder()
                    .setTitle("⏳ Usuário em Timeout")
                    .setColor("#ff9900")
                    .addFields(
                        { name: "Usuário", value: `👤 ${user.tag} (${user.id})` },
                        { name: "Moderador", value: `👮‍♂️ ${interaction.user.tag} (${interaction.user.id})` },
                        { name: "Duração", value: `⏱️ ${duration}` },
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
            return interaction.reply({ content: "❗ Ocorreu um erro ao tentar aplicar timeout a este usuário.", ephemeral: true });
        }
    }
};
