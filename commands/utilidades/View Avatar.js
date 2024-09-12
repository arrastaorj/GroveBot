const { ContextMenuCommandInteraction, ButtonStyle, ActionRowBuilder, ButtonBuilder, ApplicationCommandType, EmbedBuilder } = require("discord.js");
const axios = require('axios');
const comandos = require("../../database/models/comandos");
const idioma = require("../../database/models/language");

module.exports = {
    name: "View Avatar",
    category: "Context",
    type: ApplicationCommandType.User,

    /**
     * @param {ContextMenuCommandInteraction} interaction
     */
    run: async (client, interaction) => {
        let lang = await idioma.findOne({ guildId: interaction.guild.id });
        lang = lang ? require(`../../languages/${lang.language}.js`) : require('../../languages/pt.js');

        const cmd = await comandos.findOne({ guildId: interaction.guild.id });

        if (!cmd) {
            return interaction.reply({
                content: `${lang.alertCommandos}`,
                ephemeral: true
            });
        }

        let cmd1 = cmd.canal1;

        if (cmd1 === null || cmd1 === false || !client.channels.cache.get(cmd1) || cmd1 === interaction.channel.id) {
            let user = interaction.guild.members.cache.get(interaction.targetId) || client.users.cache.get(interaction.targetId);

            const avatarUrl = user.user.displayAvatarURL({ size: 4096, dynamic: true }); // Dynamic true para verificar se é GIF

            const embed = new EmbedBuilder()
                .setImage(avatarUrl) // Mostra o avatar com suporte a GIF
                .setDescription(`${lang.msg243} ${user}`)
                .setColor("#ba68c8");

            const button = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setLabel(`${lang.msg244}`)
                        .setURL(avatarUrl) // Usa o mesmo URL dinâmico para o botão
                );

            interaction.reply({
                embeds: [embed],
                components: [button]
            });

        } else if (interaction.channel.id !== cmd1) {
            interaction.reply({
                content: `${lang.alertCanalErrado} <#${cmd1}>.`,
                ephemeral: true
            });
        }
    }
};
