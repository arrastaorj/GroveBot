const { ContextMenuCommandInteraction, ButtonStyle, ActionRowBuilder, ButtonBuilder, ApplicationCommandType, EmbedBuilder } = require("discord.js")
const axios = require('axios')
const comandos = require("../../database/models/comandos")
const idioma = require("../../database/models/language")


module.exports = {
    name: "View Avatar",
    category: "Context",
    type: ApplicationCommandType.User,
    /**
     *
     * @param {ContextMenuCommandInteraction} interaction
     */



    run: async (client, interaction) => {

        let lang = await idioma.findOne({
            guildId: interaction.guild.id
        })
        lang = lang ? require(`../../languages/${lang.language}.js`) : require('../../languages/pt.js')


        const cmd = await comandos.findOne({
            guildId: interaction.guild.id
        })

        if (!cmd)
            return interaction.reply({
                content: `${lang.alertCommandos}`,
                ephemeral: true
            })


        let cmd1 = cmd.canal1

        if (cmd1 === null || cmd1 === false || !client.channels.cache.get(cmd1) || cmd1 === interaction.channel.id) {





            let user =
                interaction.guild.members.cache.get(interaction.targetId) ||
                client.users.cache.get(interaction.targetId);
            axios.get(`https://discord.com/api/users/${user.id}`, {

                headers: {
                    Authorization: `Bot ${client.token}`,
                },
            })

                .then((res) => {

                    const { avatar } = res.data;
                    if (avatar) {

                        const extension = avatar.startsWith("gaelavatar_") ? '.gif?size=4096' : '.png?size=4096';
                        const url = `https://cdn.discordapp.com/avatars/${user.id}/${avatar}${extension}`;
                        const embed = new EmbedBuilder()

                            .setImage(url)
                            .setDescription(`${lang.msg243} ${user}`)
                            .setColor("#6dfef2")

                        const button = new ActionRowBuilder()

                            .addComponents(
                                new ButtonBuilder()

                                    .setStyle(ButtonStyle.Link)
                                    .setLabel(`${lang.msg244}`)
                                    .setURL(user.displayAvatarURL({ size: 1024, format: 'png', dynamic: true }))

                            )

                        interaction.reply({
                            embeds: [embed], components: [button]
                        });
                    } else {
                        const embeddanger = new EmbedBuilder()

                            .setDescription(`${user} ${lang.msg245}`)
                            .setColor("#6dfef2")
                        interaction.reply({ embeds: [embeddanger] })
                    }
                })
        }
        else if (interaction.channel.id !== cmd1) {
            interaction.reply({
                content: `${lang.alertCanalErrado} <#${cmd1}>.`,
                ephemeral: true
            })
        }
    }
}

