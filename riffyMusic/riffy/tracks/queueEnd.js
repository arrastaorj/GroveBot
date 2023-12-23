const client = require("../../../index")
const { disconnectRow, disconnectRow2 } = require("../buttons/musicButtons")
const { activeMessages } = require("./trackStart")


client.riffy.on("queueEnd", async (player) => {

    try {

        const channel = client.channels.cache.get(player.textChannel)
        const existingMessage = activeMessages.get(channel.id)

        if (existingMessage) {
            const { msg } = existingMessage

            await msg.edit({
                components: [disconnectRow, disconnectRow2]
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
                components: [disconnectRow, disconnectRow2]
            })
        }

        player.stop()
    }
})
