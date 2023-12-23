const client = require("../../../index")
const { disconnectRow, disconnectRow2 } = require("../buttons/musicButtons")
const { activeMessages } = require("./trackStart")
const { AttachmentBuilder } = require("discord.js")
const { musicCard } = require("musiccard")


client.riffy.on("queueEnd", async (player) => {

    const card = new musicCard()
        .setName("Grove Music")
        .setAuthor("Sofisticado")
        .setColor("auto")
        .setThumbnail("https://raw.githubusercontent.com/arrastaorj/flags/main/music.png")
        .setProgress(0)
        .setStartTime("00:00")
        .setEndTime("00:00")

    const buffer = await card.build()
    const attachment = new AttachmentBuilder(buffer, { name: `musicard.png` })

    try {

        const channel = client.channels.cache.get(player.textChannel)
        const existingMessage = activeMessages.get(channel.id)

        if (existingMessage) {
            const { msg } = existingMessage

            await msg.edit({
                files: [attachment], components: [disconnectRow, disconnectRow2]
            })
        }

    } catch (error) {
        return
    }
    if (player.isAutoplay) {
        player.autoplay(player)
    } else {

        const channel = client.channels.cache.get(player.textChannel)
        const existingMessage = activeMessages.get(channel.id)

        if (existingMessage) {
            const { msg } = existingMessage

            await msg.edit({
                files: [attachment], components: [disconnectRow, disconnectRow2]
            })
        }

        player.stop()
    }
})
