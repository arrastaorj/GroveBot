const { AttachmentBuilder } = require("discord.js")
const { musicCard } = require("musicard")
const client = require("../../../index")
const { playRow, playRow2 } = require("../buttons/musicButtons")


const activeMessages = new Map()
const playedTracks = []

client.riffy.on('trackStart', async (player, track) => {

    const channel = client.channels.cache.get(player.textChannel)

    function formatTime(time) {
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        return minutes + ":" + (seconds < 10 ? "0" : "") + seconds
    }

    const musicLength = track.info.length
    const formattedLength = formatTime(Math.round(musicLength / 1000))

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

    playedTracks.push(track)

    const existingMessage = activeMessages.get(channel.id)

    try {
        if (existingMessage) {
            const { msg, playRow, playRow2 } = existingMessage

            await msg.edit({
                files: [attachment],
                components: [playRow, playRow2],
            })
        } else {
            const msg = await channel.send({
                files: [attachment],
                components: [playRow, playRow2],
            })
            activeMessages.set(channel.id, { msg, playRow, playRow2 })
        }
    } catch (error) {

        const msg = await channel.send({
            files: [attachment],
            components: [playRow, playRow2],
        })

        activeMessages.delete(channel.id)
        activeMessages.set(channel.id, { msg, playRow, playRow2 })
    }
})


module.exports = {
    playedTracks,
    activeMessages
}