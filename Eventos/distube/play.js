const { Client } = require("discord.js");
const distube = require("./distube");


/**
 *
 * @param {Client} client
 */
module.exports = (client) => {
    client.on("interactionCreate", async (interaction) => {
        if (!interaction.guild || interaction.user.bot) return;
        let queue = await distube.getQueue(interaction.guild.id);
        if (!queue) return;
        let voicechannel = interaction.member.voice.channel;
        if (interaction.isButton()) {
            await interaction.deferReply({ ephemeral: true }).catch((e) => { });
            switch (interaction.customId) {
                case "pause":
                    {
                        if (!voicechannel) {
                            return interaction.followUp({
                                content: `Você precisa se juntar ao canal de voz`,
                                ephemeral: true,
                            })
                        } else {
                            if (queue.paused) {
                                await queue.resume();
                                return interaction.followUp({
                                    content: `Música retomada`,
                                    ephemeral: true,
                                })
                            } else {

                                await queue.pause()
                                return interaction.followUp({
                                    content: `Música pausada`,
                                    ephemeral: true,
                                })

                            }
                        }
                    }
                    break;
                case "skip":
                    {
                        if (!voicechannel) {
                            return interaction.followUp({
                                content: `Você precisa se juntar ao canal de voz`,
                                ephemeral: true,
                            });
                        } else {
                            if (!queue.songs[1]) {
                                // await queue.stop();
                                return interaction.followUp({
                                    content: `Não possui músicas na fila`,
                                    ephemeral: true,
                                });
                            } else {

                                await queue.skip();
                                return interaction.followUp({
                                    content: `Música ignorada`,
                                    ephemeral: true,
                                });
                            }
                        }
                    }
                    break;
                case "stop":
                    {
                        if (!voicechannel) {
                            return interaction.followUp({
                                content: `Você precisa se juntar ao canal de voz`,
                                ephemeral: true,
                            });
                        } else {
                            await queue.stop();
                            return interaction.followUp({
                                content: `Música interrompida`,
                                ephemeral: true,
                            });
                        }
                    }
                    break;
                case "loop":
                    {
                        if (!voicechannel) {
                            return interaction.followUp({
                                content: `Você precisa se juntar ao canal de voz`,
                                ephemeral: true,
                            });
                        } else {
                            let mode = queue.repeatMode;
                            if (mode === 1 || mode === 2) {
                                queue.setRepeatMode(0);
                                return interaction.followUp({
                                    content: `Loop Off`,
                                    ephemeral: true,
                                });
                            } else {
                                await queue.setRepeatMode(1);
                                return interaction.followUp({
                                    content: `Loop de música ativado`,
                                    ephemeral: true,
                                });
                            }
                        }
                    }
                    break;

                default:
                    break;
            }
        }
    })

    // client.on("messageCreate", async (message) => {
    //     if (!message.guild || message.author.bot) return;
    //     let channel = message.guild.channels.cache.get(client.data.channel);
    //     if (message.channel.id === channel) {
    //         let song = message.cleanContent;
    //         await message.delete().catch((e) => { });
    //         distube.play(message, song).catch((e) => { });
    //     }
    // })
}
