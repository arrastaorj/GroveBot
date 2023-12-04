const { AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const { musicCard } = require("musicard")
const client = require("../../../index")




const activeMessages = new Map()

client.riffy.on('trackStart', async (player, track) => {


    const row = new ActionRowBuilder()
        .addComponents(

            new ButtonBuilder()
                .setCustomId('pause')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('<:pause_37505:1180473260853448835>'),

            new ButtonBuilder()
                .setCustomId('skip')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('<:_4202450:1180472202865414205>'),

            new ButtonBuilder()
                .setCustomId('disconnect')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('<:circle_10238169:1181029869040181319>'),

        )

    const rowDisabled = new ActionRowBuilder()
        .addComponents(

            new ButtonBuilder()
                .setCustomId('pause')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('<:pause_37505:1180473260853448835>')
                .setDisabled(true),
            new ButtonBuilder()
                .setCustomId('skip')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('<:_4202450:1180472202865414205>')
                .setDisabled(true),
            new ButtonBuilder()
                .setCustomId('disconnect')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('<:circle_10238169:1181029869040181319>')
                .setDisabled(true),
        )


    const channel = client.channels.cache.get(player.textChannel)

    function formatTime(time) {
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        return minutes + ":" + (seconds < 10 ? "0" : "") + seconds
    }

    const musicLength = track.info.length
    const formattedLength = formatTime(Math.round(musicLength / 1000))
    const [minutesStr, secondsStr] = formattedLength.split(":")
    const minutes = parseInt(minutesStr, 10)
    const seconds = parseInt(secondsStr, 10)
    const totalMilliseconds = (minutes * 60 + seconds) * 1000


    const card = new musicCard()
        .setName(track.info.title)
        .setAuthor(track.info.author)
        .setColor("auto")
        .setTheme("classic")
        .setBrightness(100)
        .setThumbnail(track.info.thumbnail)
        .setProgress(0)
        .setStartTime("0:00")
        .setEndTime(formattedLength)


    const buffer = await card.build()
    const attachment = new AttachmentBuilder(buffer, { name: `musicard.png` })

    const existingMessage = activeMessages.get(channel.id)

    if (existingMessage) {
        const { msg, row } = existingMessage

        await msg.edit({
            files: [attachment],
            components: [row]
        })

        setTimeout(async () => {
            await msg.edit({
                components: [rowDisabled]
            })
        }, totalMilliseconds)

    } else {

        const msg = await channel.send({
            files: [attachment],
            components: [row]
        })

        setTimeout(async () => {
            await msg.edit({
                components: [rowDisabled]
            })
        }, totalMilliseconds)

        activeMessages.set(channel.id, { msg, row })
    }

})




client.riffy.on("queueEnd", async (player) => {

    //const channel = client.channels.cache.get(player.textChannel)

    if (player.isAutoplay) {
        player.autoplay(player)
    } else {
        player.stop()

    }
})


client.riffy.on('trackError', async (player, track, payload) => {
    console.log(payload)
})