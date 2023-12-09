const discord = require('discord.js');
const idioma = require("../../database/models/language")

module.exports = {
    name: 'clear',
    description: 'Limpe as mensagens de um chat.',
    type: discord.ApplicationCommandType.ChatInput,

    run: async (client, interaction, args) => {

        let lang = await idioma.findOne({
            guildId: interaction.guild.id
        })

        if (!lang || !lang.language) {
            lang = { language: client.language };
        }
        lang = require(`../../languages/${lang.language}.js`)



        let numero = 50 + 49;

        if (!interaction.member.permissions.has(discord.PermissionFlagsBits.ManageChannels)) {
            return interaction.reply({
                content: `${lang.alertNaoTemPermissão}`,
                ephemeral: true,
            });
        }

        const botMember = interaction.member.guild.members.cache.get(client.user.id);
        const hasPermission = botMember.permissions.has("Administrator");

        if (hasPermission) {
            interaction.channel.bulkDelete(numero, true)

            let embed = new discord.EmbedBuilder()
                .setTitle(`${lang.msg79}`)
                .setDescription(`${lang.msg80}`)
                .setTimestamp()
                .setFooter({ text: `${lang.msg81} ${interaction.member.user.username}`, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })
                .setColor("#41b2b0");

            interaction.reply({ embeds: [embed], ephemeral: true });
        } else {
            return interaction.reply({
                content: `${lang.alertPermissãoBot}`,
                ephemeral: true,
            });
        }
    }
}
