const discord = require("discord.js");
const GuildConfig = require('../../database/models/auditlogs');

module.exports = {
    name: "mute",
    description: "Mutar um usuário no servidor",
    type: discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "user",
            description: "O usuário a ser mutado",
            type: discord.ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: "motivo",
            description: "Motivo do mute",
            type: discord.ApplicationCommandOptionType.String,
            required: false,
        }
    ],

    run: async (client, interaction) => {
        // Verifica se o autor tem a permissão de mutar membros
        if (!interaction.member.permissions.has(discord.PermissionsBitField.Flags.ModerateMembers)) {
            return interaction.reply({ content: "> \`-\` <a:alerta:1163274838111162499> Você não tem permissão para mutar membros.", ephemeral: true });
        }

        const user = interaction.options.getUser("user");
        const reason = interaction.options.getString("motivo") || "Sem motivo especificado";

        const member = interaction.guild.members.cache.get(user.id);

        // Verifica se o usuário está no servidor
        if (!member) {
            return interaction.reply({ content: "> \`-\` <a:alerta:1163274838111162499> Este usuário não está no servidor.", ephemeral: true });
        }

        // Verifica se o membro já está mutado
        const muteRole = interaction.guild.roles.cache.find(role => role.name.toLowerCase() === "mutado");
        if (!muteRole) {
            return interaction.reply({ content: "> \`-\` <a:alerta:1163274838111162499> O cargo de 'mutado' não foi encontrado. Por favor, crie um cargo 'mutado' e configure as permissões.", ephemeral: true });
        }

        if (member.roles.cache.has(muteRole.id)) {
            return interaction.reply({ content: "> \`-\` <a:alerta:1163274838111162499> Este usuário já está mutado.", ephemeral: true });
        }

        // Adicionando o cargo de mute ao usuário
        try {
            await member.roles.add(muteRole, reason);

            // Cria o embed de confirmação do mute
            const muteEmbed = new discord.EmbedBuilder()
                .setColor("#ff0000")
                .setTitle("🔇 Usuário Mutado!")
                .setDescription(`O usuário **${user.tag}** foi mutado.`)
                .addFields(
                    { name: "Motivo", value: `💬 ${reason}` },
                    { name: "Moderador", value: `👮‍♂️ ${interaction.user.tag}` }
                )
                .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                .setTimestamp();

            await interaction.reply({ embeds: [muteEmbed] });

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
                // Cria o embed com as informações do mute para o canal de logs
                const logEmbed = new discord.EmbedBuilder()
                    .setTitle("🔇 Usuário Mutado")
                    .setColor("#ff0000")
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
            return interaction.reply({ content: "> \`-\` <a:alerta:1163274838111162499> Ocorreu um erro ao tentar mutar este usuário.", ephemeral: true });
        }
    }
};
