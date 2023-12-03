const discord = require("discord.js")
const client = require("../../index.js")
const Distube = require("distube").default
const { YtDlpPlugin } = require("@distube/yt-dlp")
const { SpotifyPlugin } = require('@distube/spotify')
const { SoundCloudPlugin } = require('@distube/soundcloud')

const { musicCard } = require("musicard")
const fs = require("fs")
const internal = require("stream")

const distube = new Distube(client, {
    emitNewSongOnly: false,
    searchSongs: 0,
    plugins: [
        new SpotifyPlugin({
            emitEventsAfterFetching: true
        }),
        new SoundCloudPlugin(),
        new YtDlpPlugin()
    ]
})



module.exports = distube
client.on("ready", () => {
    require("./play.js")(client)


})



const button = new discord.ActionRowBuilder().addComponents([
    // new discord.ButtonBuilder()
    //     .setStyle("Secondary")
    //     .setLabel("Pause/Resume")
    //     .setCustomId("pause")
    //     .setEmoji("<:playarrow_5398599:1180472208297046016>"),


    new discord.ButtonBuilder()
        .setStyle("Secondary")
        .setLabel("Skip")
        .setCustomId("skip")
        .setEmoji("<:_4202450:1180472202865414205>"),
    new discord.ButtonBuilder()
        .setStyle("Secondary")
        .setLabel("Stop")
        .setCustomId("stop")
        .setEmoji("<:pause_37505:1180473260853448835>"),
    new discord.ButtonBuilder()
        .setStyle("Secondary")
        .setLabel("Loop")
        .setCustomId("loop")
        .setEmoji("<:loop_3889566:1180472205419745310>"),
])

const button2 = new discord.ActionRowBuilder().addComponents([
    // new discord.ButtonBuilder()
    //     .setStyle("Secondary")
    //     .setLabel("Pause/Resume")
    //     .setCustomId("pause")
    //     .setDisabled(true)
    //     .setEmoji("<:playarrow_5398599:1180472208297046016>"),
    new discord.ButtonBuilder()
        .setStyle("Secondary")
        .setLabel("Skip")
        .setCustomId("skip")
        .setDisabled(true)
        .setEmoji("<:_4202450:1180472202865414205>"),
    new discord.ButtonBuilder()
        .setStyle("Secondary")
        .setLabel("Stop")
        .setCustomId("stop")
        .setDisabled(true)
        .setEmoji("<:pause_37505:1180473260853448835>"),
    new discord.ButtonBuilder()
        .setStyle("Secondary")
        .setLabel("Loop")
        .setCustomId("loop")
        .setDisabled(true)
        .setEmoji("<:loop_3889566:1180472205419745310>"),
])







distube.on("finish", async (queue) => {


})


const nowPlaying = new Map()

distube.on("playSong", async (queue) => {
    const song = queue.songs[0]
    const textChannel = queue.textChannel

    const songInfo = {
        name: song.name,
        uploader: {
            name: song.uploader.name,
        },
        thumbnail: song.thumbnail,
        formattedDuration: song.formattedDuration,
    }

    const card = new musicCard()
        .setName(songInfo.name)
        .setAuthor(songInfo.uploader.name)
        .setColor("auto")
        .setTheme("classic")
        .setBrightness(50)
        .setThumbnail(songInfo.thumbnail)
        .setProgress()
        .setStartTime()
        .setEndTime()

    const formattedDurationArray = songInfo.formattedDuration.split(":")
    const totalSeconds = parseInt(formattedDurationArray[0]) * 60 + parseInt(formattedDurationArray[1])
    const updateInterval = 1000

    let guildInfo = nowPlaying.get(textChannel.guild.id)

    if (!guildInfo) {
        guildInfo = {
            songInfo,
            card,
            textChannel,
            currentMessage: null,
            startTime: Date.now(),
            intervalId: null,
            buttonChanged: false,
        }

        nowPlaying.set(textChannel.guild.id, guildInfo)

        const cardBuffer = await card.build()
        const sentMessage = await textChannel.send({ files: [cardBuffer], components: [button] })
        guildInfo.currentMessage = sentMessage.id
    }

    clearInterval(guildInfo.intervalId)

    guildInfo.startTime = Date.now()
    guildInfo.buttonChanged = false

    const updateCard = async () => {
        const elapsedTime = Date.now() - guildInfo.startTime

        if (totalSeconds > 0) {
            const newProgress = (elapsedTime / (totalSeconds * 1000)) * 100
            const roundedProgress = Math.min(Math.floor(newProgress), 100)

            const elapsedMinutes = Math.floor(elapsedTime / 60000)
            const elapsedSeconds = Math.floor((elapsedTime % 60000) / 1000)

            const formattedMinutes = String(elapsedMinutes).padStart(2, '0')
            const formattedSeconds = String(elapsedSeconds).padStart(2, '0')

            guildInfo.card.setName(songInfo.name)
            guildInfo.card.setAuthor(songInfo.uploader.name)
            guildInfo.card.setThumbnail(songInfo.thumbnail)
            guildInfo.card.setEndTime(songInfo.formattedDuration)
            guildInfo.card.setStartTime(`${formattedMinutes}:${formattedSeconds}`)
            guildInfo.card.setProgress(roundedProgress)

            const updatedCardBuffer = await guildInfo.card.build()
            const message = await guildInfo.textChannel.messages.fetch(guildInfo.currentMessage)

            if (roundedProgress >= 100 && !guildInfo.buttonChanged) {
                clearInterval(guildInfo.intervalId)
                guildInfo.buttonChanged = true
                message.edit({ files: [updatedCardBuffer], components: [button2] })
            } else {
                message.edit({ files: [updatedCardBuffer], components: [button] })
            }
        }
    }

    const intervalId = setInterval(updateCard, updateInterval)
    guildInfo.intervalId = intervalId
})






distube.on("addSong", (queue, song) => {

    queue.textChannel
        .send({
            embeds: [
                new discord.EmbedBuilder()

                    .setAuthor({ name: `Adicionado à fila`, iconURL: song.user.displayAvatarURL({ dynamic: true }), url: song.url, })
                    .setThumbnail(song.thumbnail)
                    .setImage("https://raw.githubusercontent.com/arrastaorj/flags/main/tenor.gif")
                    .setDescription(`[${song.name}](${song.url})`)
                    .addFields([
                        {
                            name: `Requerido por`,
                            value: `<@${song.user.id}>`,
                            inline: true,
                        },
                        {
                            name: `**Gravadora / Artista**`,
                            value: `**${song.uploader.name}**`,
                            inline: true,
                        },
                        {
                            name: `Duração`,
                            value: `\`${song.formattedDuration}\``,
                            inline: true,
                        },
                    ])
            ],
        })
        .then((msg) => {
            setTimeout(() => {
                msg.delete().catch((e) => null)
            }, 8000)
        })

})


distube.on("addList", (queue, plalist) => {


})


distube.on('disconnect', async (queue) => {

    if (queue.currentMessage) {
        queue.textChannel.messages.fetch(queue.currentMessage).then((message) => {
            message.edit({ components: [button2] })
        })
    }

})