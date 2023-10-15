const { ContextMenuCommandInteraction, ButtonStyle, ActionRowBuilder, ButtonBuilder, ApplicationCommandType, EmbedBuilder } = require("discord.js")
const axios = require('axios')
const comandos = require("../../database/models/comandos")

module.exports = {
    name: "View Avatar",
    category: "Context",
    type: ApplicationCommandType.User,
    /**
     *
     * @param {ContextMenuCommandInteraction} interaction
     */



    run: async (client, interaction) => {


        const cmd = await comandos.findOne({
            guildId: interaction.guild.id
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
                            .setDescription(`Avatar de ${user}`)
                            .setColor('Random')

                        const button = new ActionRowBuilder()

                            .addComponents(
                                new ButtonBuilder()

                                    .setStyle(ButtonStyle.Link)
                                    .setLabel('Abrir Avatar')
                                    .setURL(user.displayAvatarURL({ size: 1024, format: 'png', dynamic: true }))

                            )

                        interaction.reply({
                            embeds: [embed], components: [button]
                        });
                    } else {
                        const embeddanger = new EmbedBuilder()

                            .setDescription(`${user} não possui um avatar!`)
                            .setColor('Random')
                        interaction.reply({ embeds: [embeddanger] })
                    }
                })
        }
        else

            if (interaction.channel.id !== cmd1) { interaction.reply({ content: `Você estar tentando usar um comando no canal de texto errado, tente utiliza-lo no canal de <#${cmd1}>.`, ephemeral: true }) }

    }
}