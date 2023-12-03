const { Client, CommandInteraction, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js')

module.exports = {
    name: 'play',
    description: 'reproduzir uma música',
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
        const query = interaction.options.getString('música')

        const player = client.riffy.createConnection({
            guildId: interaction.guild.id,
            voiceChannel: interaction.member.voice.channel.id,
            textChannel: interaction.channel.id,
            deaf: true,
        })

        const resolve = await client.riffy.resolve({ query: query, requester: interaction.member })
        const { loadType, tracks, playlistInfo } = resolve

        if (loadType === 'PLAYLIST_LOADED') {
            for (const track of resolve.tracks) {
                track.info.requester = interaction.member
                player.queue.add(track)
            }

            await interaction.reply(`Adicionadas ${tracks.length} músicas da playlist ${playlistInfo.name}.`)

            if (!player.playing && !player.paused) return player.play()

        } else if (loadType === 'SEARCH_RESULT' || loadType === 'TRACK_LOADED') {
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
                    name: 'Adicionado à fila',
                    iconURL: track.info.requester.user.displayAvatarURL({ dynamic: true })
                })
                .setThumbnail(track.thumbnail)
                .setImage('https://raw.githubusercontent.com/arrastaorj/flags/main/tenor.gif')


                .setDescription(`[${track.info.title}](${track.info.uri})`)
                .addFields([
                    {
                        name: 'Requerido por',
                        value: `<@${track.info.requester.id}>`,
                        inline: true,
                    },
                    {
                        name: '**Gravadora / Artista**',
                        value: `**${track.info.author}**`,
                        inline: true,
                    },
                    {
                        name: 'Duração',
                        value: `\`${formattedLength}\``,
                        inline: true,
                    },
                ])


            await interaction.reply({ embeds: [embed] }).then((msg) => {
                setTimeout(() => {
                    msg.delete().catch((e) => null)
                }, 8000)
            })

            
            if (!player.playing && !player.paused) return player.play()

        } else {
            return interaction.reply('Não foram encontrados resultados para sua consulta.')
        }

    }
}