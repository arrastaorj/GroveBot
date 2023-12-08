const client = require("../../../index")
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")

const { pauseRow, playRow, skipRowDisabled, disconnectRow } = require("../../../buttons/musicButtons")

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return

    const player = client.riffy.players.get(interaction.guild.id)


    switch (interaction.customId) {
        case 'pause':
            await interaction.deferUpdate()

            if (!player) return interaction.followUp({
                content: `> \`-\` Não há música reproduzindo atualmente.`,
                ephemeral: true
            })

            player.pause(true)
            await interaction.message.edit({
                components: [pauseRow]
            }).then(
                interaction.followUp({
                    content: `> \`+\` A reprodução da música foi pausada.`,
                    ephemeral: true,
                })
            )
            break

        case 'play':
            await interaction.deferUpdate()

            if (!player) return interaction.followUp({
                content: `> \`-\` Não há música reproduzindo atualmente.`,
                ephemeral: true
            })

            player.pause(false)

            await interaction.message.edit({
                components: [playRow]
            }).then(
                interaction.followUp({
                    content: `> \`+\` A reprodução da música foi retomada.`,
                    ephemeral: true,
                })
            )
            break

        case 'skip':

            await interaction.deferUpdate()

            if (!player) return interaction.followUp({
                content: `> \`-\` Não há música reproduzindo atualmente.`,
                ephemeral: true
            })

            player.stop()

            await interaction.message.edit({
                components: [skipRowDisabled]
            }).then(
                interaction.followUp({
                    content: `> \`+\` A música atual foi pulada.`,
                    ephemeral: true,
                })
            )
            break

        case 'disconnect':
            await interaction.deferUpdate()

            if (!player) return interaction.followUp({
                content: `> \`-\` Não há música reproduzindo atualmente.`,
                ephemeral: true
            })

            player.destroy()

            await interaction.message.edit({
                components: [disconnectRow]
            }).then(
                interaction.followUp({
                    content: `> \`+\` A reprodução da música foi interrompida e o bot desconectado.`,
                    ephemeral: true,
                })
            )
            break

        case 'autoplay':

            await interaction.deferUpdate()

            if (!player) return interaction.followUp({
                content: `> \`-\` Não há música reproduzindo atualmente.`,
                ephemeral: true
            })

            const currentAutoplayStatus = player.isAutoplay

            if (currentAutoplayStatus) {
                player.autoplay(false)
                await interaction.followUp({
                    content: `> \`-\` O AutoPlay foi desativado.`,
                    ephemeral: true,
                });
            } else {
                player.autoplay(true)
                await interaction.followUp({
                    content: `> \`+\` O AutoPlay está Ativo.`,
                    ephemeral: true,
                });
            }
            break
        default:
            break
    }
})
