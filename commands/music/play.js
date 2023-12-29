const {
    ApplicationCommandType,
    ApplicationCommandOptionType,
    EmbedBuilder,
} = require('discord.js')

const idioma = require("../../database/models/language")
const canalMusic = require("../../database/models/music")


module.exports = {
    name: 'play',
    description: 'reproduzir uma música',
    type: ApplicationCommandType.ChatInput,
    inVoice: true,
    options: [
        {
            name: 'música',
            description: 'Música a tocar pode inserir nome ou link ou playlist link',
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],


    run: async (client, interaction, args) => {



        let lang = await idioma.findOne({
            guildId: interaction.guild.id
        })
        lang = lang ? require(`../../languages/${lang.language}.js`) : require('../../languages/pt.js')



        const query = interaction.options.getString('música')

        const cmd = await canalMusic.findOne({
            guildId: interaction.guild.id
        })

        if (!cmd) return interaction.reply({
            content: `${lang.alertCommandosMusic}`,
            ephemeral: true
        })

        let cmd1 = cmd.canal1

        if (cmd1 === null || cmd1 === false || !client.channels.cache.get(cmd1) || cmd1 === interaction.channel.id) {

            const existingPlayer = client.riffy.players.get(interaction.guild.id);
            if (existingPlayer && (!interaction.member.voice.channelId || interaction.member.voice.channelId !== existingPlayer.voiceChannel)) {
                return interaction.reply({ content: `${lang.msg401}`, ephemeral: true });
            }


            if (!interaction.member.voice.channelId) {
                return interaction.reply({ content: `${lang.AlertCanaldeVoz}`, ephemeral: true });
            }

            const player = client.riffy.createConnection({
                guildId: interaction.guild.id,
                voiceChannel: interaction.member.voice.channel.id,
                textChannel: interaction.channel.id,
                deaf: true,
            })

            const resolve = await client.riffy.resolve({ query: query, requester: interaction.member })
            const { loadType, tracks, playlistInfo } = resolve


            await interaction.deferReply({ fetchReply: true })


            if (loadType === 'playlist') {
                for (const track of resolve.tracks) {
                    track.info.requester = interaction.member
                    player.queue.add(track)
                }

                const track = tracks.shift()
                track.info.requester = interaction.member


                const PlayList = new EmbedBuilder()
                    .setAuthor({
                        name: `${lang.msgPlaylist}`,
                        iconURL: track.info.requester.user.displayAvatarURL({ dynamic: true })
                    })
                    .setDescription(`${lang.msg8} **${tracks.length}** ${lang.msg9} **${playlistInfo.name}**`)
                    .setColor("#ba68c8")
                    .setImage('https://raw.githubusercontent.com/arrastaorj/flags/main/tenor.gif')


                try {

                    await interaction.editReply({ embeds: [PlayList], fetchReply: true }).then((msg) => {
                        setTimeout(() => {
                            msg.delete().catch((e) => null)
                        }, 10000)
                    })

                } catch {
                    return
                }


                if (!player.playing && !player.paused) return player.play()

            } else if (loadType === 'search' || loadType === 'track') {


                const track = tracks.shift()

                track.info.requester = interaction.member

                player.queue.add(track)


                function formatTime(time) {
                    const minutes = Math.floor(time / 60);
                    const seconds = Math.floor(time % 60);

                    const formattedMinutes = String(minutes).padStart(2, '0');
                    const formattedSeconds = String(seconds).padStart(2, '0');

                    return formattedMinutes + ":" + formattedSeconds;
                }

                const musicLength = track.info.length;
                const formattedLength = formatTime(Math.round(musicLength / 1000));



                const embed = new EmbedBuilder()
                    .setAuthor({
                        name: `${lang.msg10}`,
                        iconURL: track.info.requester.user.displayAvatarURL({ dynamic: true })
                    })
                    .setThumbnail(track.thumbnail)
                    .setColor("#ba68c8")
                    .setImage('https://raw.githubusercontent.com/arrastaorj/flags/main/tenor.gif')
                    .setDescription(`[${track.info.title}](${track.info.uri})`)
                    .addFields([
                        {
                            name: `${lang.msg11}`,
                            value: `<@${track.info.requester.id}>`,
                            inline: true,
                        },
                        {
                            name: `${lang.msg12}`,
                            value: `**${track.info.author}**`,
                            inline: true,
                        },
                        {
                            name: `${lang.msg13}`,
                            value: `**${formattedLength}**`,
                            inline: true,
                        },
                    ])

                try {

                    await interaction.editReply({ embeds: [embed], fetchReply: true }).then((msg) => {
                        setTimeout(() => {
                            msg.delete().catch((e) => null)
                        }, 10000)
                    })

                    if (!player.playing && !player.paused) return player.play()

                } catch {
                    return
                }

            } else {

                return interaction.editReply(`${lang.msg14}`)

            }
        }

        else if (interaction.channel.id !== cmd1) {
            interaction.reply({
                content: `${lang.alertCanalErrado} <#${cmd1}>.`,
                ephemeral: true
            })
        }
    }
}