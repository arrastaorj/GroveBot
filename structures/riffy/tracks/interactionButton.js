const client = require("../../../index")
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js")

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

        case 'fila':

            try {

                await interaction.deferUpdate()

                if (!player) return interaction.followUp({
                    content: `${lang.msg1}`,
                    ephemeral: true
                })

                const currentTrack = player.current
                const MAX_TRACKS_PER_PAGE = 10;

                const pages = [];
                for (let i = 0; i < player.queue.length; i += MAX_TRACKS_PER_PAGE) {
                    const page = player.queue.slice(i, i + MAX_TRACKS_PER_PAGE);
                    pages.push(page);
                }

                const buttons = new ActionRowBuilder().addComponents(
                    new ButtonBuilder().setCustomId('prev').setEmoji("<:backward_7071381:1183247894900375562>").setStyle('Primary').setDisabled(true),
                    new ButtonBuilder().setCustomId('next').setEmoji("<:fastforward_7071375:1183247892538986626>").setStyle('Primary').setDisabled(true),
                );

                let currentPage = 0;
                let globalCounter = 0;

               
                buttons.components[1].setDisabled(currentPage === pages.length - 1 || pages.length <= 1);


                console.log(currentPage === pages.length - 1 || pages.length <= 1)
                const embed = new EmbedBuilder()
                    .setTitle(`Fila de Reprodução - Página ${currentPage + 1}/${pages.length}`)
                    .setColor("#6dfef2")
                    .setDescription(formatQueue(pages[currentPage], MAX_TRACKS_PER_PAGE))
                    .setThumbnail(currentTrack.info.thumbnail);

                const message = await interaction.followUp({
                    content: ``,
                    embeds: [embed],
                    components: [buttons],
                    ephemeral: true,
                });

                const filter = (interaction) => interaction.customId === 'prev' || interaction.customId === 'next';
                const collector = message.createMessageComponentCollector({ filter });

                collector.on('collect', async (interaction) => {
                    if (interaction.customId === 'prev') {
                        currentPage = (currentPage - 1 + pages.length) % pages.length;

                        
                    } else if (interaction.customId === 'next') {
                        currentPage = (currentPage + 1) % pages.length;

                    }

                
                    buttons.components[0].setDisabled(currentPage === 0);
                    buttons.components[1].setDisabled(currentPage === pages.length - 1)

                    const newEmbed = new EmbedBuilder()
                        .setTitle(`Fila de Reprodução - Página ${currentPage + 1}/${pages.length}`)
                        .setColor("#6dfef2")
                        .setDescription(formatQueue(pages[currentPage], MAX_TRACKS_PER_PAGE))
                        .setThumbnail(currentTrack.info.thumbnail);

                    await interaction.update({
                        embeds: [newEmbed],
                        components: [buttons],
                    });
                });


                function formatDuration(durationInMilliseconds) {
                    const seconds = Math.floor((durationInMilliseconds / 1000) % 60);
                    const minutes = Math.floor((durationInMilliseconds / (1000 * 60)) % 60);
                    const hours = Math.floor((durationInMilliseconds / (1000 * 60 * 60)) % 24);
                    const days = Math.floor(durationInMilliseconds / (1000 * 60 * 60 * 24));

                    const formattedTime = `${days > 0 ? `${days}d ` : ''}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                    return formattedTime;
                }


                function formatQueue(queue, maxTracks) {
                    const queueDescription = Array.isArray(queue) && queue.length > 0
                        ? queue.map((Queue, i) => `**${globalCounter + i + 1 + currentPage * MAX_TRACKS_PER_PAGE}**. [${Queue.info.title}](${Queue.info.uri}) [${formatDuration(Queue.info.length)}]`).join('\n')
                        : 'Não existe música na fila.';

                    return queueDescription;
                }

            } catch (e) {

                return console.log(e)

            }
            break

        default:
            break
    }


})
