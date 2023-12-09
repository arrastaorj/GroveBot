const client = require("../../../index")
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")

const { pauseRow, playRow, skipRowDisabled, disconnectRow } = require("../../../buttons/musicButtons")

const idioma = require("../../../database/models/language")


client.on('interactionCreate', async (interaction) => {

    let lang = await idioma.findOne({ guildId: interaction.guild.id });

    if (!lang || !lang.language) {

        lang = { language: client.language };
    }

    lang = require(`../../../languages/${lang.language}.js`);



    if (!interaction.isButton()) return

    const player = client.riffy.players.get(interaction.guild.id)


    switch (interaction.customId) {
        case 'pause':
            await interaction.deferUpdate()

            if (!player) return interaction.followUp({
                content: `${lang.msg1}`,
                ephemeral: true
            })

            player.pause(true)
            await interaction.message.edit({
                components: [pauseRow]
            }).then(
                interaction.followUp({
                    content: `${lang.msg2}`,
                    ephemeral: true,
                })
            )
            break

        case 'play':
            await interaction.deferUpdate()

            if (!player) return interaction.followUp({
                content: `${lang.msg1}`,
                ephemeral: true
            })

            player.pause(false)

            await interaction.message.edit({
                components: [playRow]
            }).then(
                interaction.followUp({
                    content: `${lang.msg3}`,
                    ephemeral: true,
                })
            )
            break

        case 'skip':

            await interaction.deferUpdate()

            if (!player) return interaction.followUp({
                content: `${lang.msg1}`,
                ephemeral: true
            })

            player.stop()

            await interaction.message.edit({
                components: [skipRowDisabled]
            }).then(
                interaction.followUp({
                    content: `${lang.msg4}`,
                    ephemeral: true,
                })
            )
            break

        case 'disconnect':
            await interaction.deferUpdate()

            if (!player) return interaction.followUp({
                content: `${lang.msg1}`,
                ephemeral: true
            })

            player.destroy()

            await interaction.message.edit({
                components: [disconnectRow]
            }).then(
                interaction.followUp({
                    content: `${lang.msg5}`,
                    ephemeral: true,
                })
            )
            break

        case 'autoplay':

            await interaction.deferUpdate()

            if (!player) return interaction.followUp({
                content: `${lang.msg1}`,
                ephemeral: true
            })

            const currentAutoplayStatus = player.isAutoplay

            if (currentAutoplayStatus) {
                player.autoplay(false)
                await interaction.followUp({
                    content: `${lang.msg6}`,
                    ephemeral: true,
                });
            } else {
                player.autoplay(true)
                await interaction.followUp({
                    content: `${lang.msg7}`,
                    ephemeral: true,
                });
            }
            break
        default:
            break
    }
})
