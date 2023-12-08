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
                .setEmoji('<:stop:1182489697327525889>'),
            new ButtonBuilder()
                .setCustomId('autoplay')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('<:autoplay:1182488248019329104>'),

        )




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
        .setTheme("dynamic")
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

    } else {

        const msg = await channel.send({
            files: [attachment],
            components: [row]
        })

        activeMessages.set(channel.id, { msg, row })
    }

})




client.riffy.on("queueEnd", async (player) => {


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
                .setEmoji('<:stop:1182489697327525889>')
                .setDisabled(true),
            new ButtonBuilder()
                .setCustomId('autoplay')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('<:autoplay:1182488248019329104>')
                .setDisabled(true),

        )


    const card = new musicCard()
        .setName("Grove Music")
        .setAuthor("Sofisticado")
        .setColor("auto")
        .setTheme("classic")
        .setBrightness(100)
        .setThumbnail("https://raw.githubusercontent.com/arrastaorj/flags/main/strange.png")
        .setProgress(0)
        .setStartTime("00:00")
        .setEndTime("00:00")


    const buffer = await card.build()
    const attachment = new AttachmentBuilder(buffer, { name: `musicard.png` })


    const channel = client.channels.cache.get(player.textChannel)
    const existingMessage = activeMessages.get(channel.id)

    if (existingMessage) {
        const { msg } = existingMessage

        await msg.edit({
            files: [attachment], components: [rowDisabled]
        })
    }


    if (player.isAutoplay) {
        player.autoplay(player)
    } else {
        player.stop()
    }
})


client.riffy.on('trackError', async (player, track, payload) => {
    //console.log(payload)
})