const { AttachmentBuilder } = require("discord.js")
const client = require("../../../index")
const { playRow, playRow2, disconnectRow, disconnectRow2 } = require("../buttons/musicButtons")
//const musicCard = require("../../build/class");

const { ClassicPro } = require("musicard")




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

    const card = await ClassicPro({
        name: `${track.info.title}`,
        author: `${track.info.author}`,
        setColor: "auto",
        thumbnailImage: `${track.info.thumbnail}`,
        progress: "10",
        startTime: "00:00",
        endTime: `${formattedLength}`
    })
    // const card = new musicCard()
    //     .setName(track.info.title)
    //     .setAuthor(track.info.author)
    //     .setColor("auto")
    //     .setThumbnail(track.info.thumbnail)
    //     .setProgress(10)
    //     .setStartTime("00:00")
    //     .setEndTime(formattedLength)


    const attachment = new AttachmentBuilder(card, { name: "profile.png" });


    //const buffer = await card.build()
    //const attachment = new AttachmentBuilder(buffer, { name: `musicard.png` })


    playedTracks.push(track)

    const existingMessage = activeMessages.get(channel.id)

    try {
        if (existingMessage) {
            const { msg, playRow, playRow2 } = existingMessage;

            // Altera os botões da mensagem existente para disconnectRow
            await msg.edit({
                components: [disconnectRow, disconnectRow2],
            });

            // Envia uma nova mensagem com os botões playRow e playRow2
            const newMsg = await channel.send({
                files: [attachment],
                components: [playRow, playRow2],
            });

            // Atualiza o mapa de mensagens ativas
            activeMessages.set(channel.id, { msg: newMsg, playRow, playRow2 });
        } else {
            // Se não existir uma mensagem, envia uma nova com os botões playRow e playRow2
            const msg = await channel.send({
                files: [attachment],
                components: [playRow, playRow2],
            });

            // Atualiza o mapa de mensagens ativas
            activeMessages.set(channel.id, { msg, playRow, playRow2 });
        }
    } catch (error) {
        // Em caso de erro, envia uma nova mensagem com os botões playRow e playRow2
        const msg = await channel.send({
            files: [attachment],
            components: [playRow, playRow2],
        });

        // Remove a mensagem anterior (se existir) e atualiza o mapa de mensagens ativas
        activeMessages.delete(channel.id);
        activeMessages.set(channel.id, { msg, playRow, playRow2 });
    }

})


module.exports = {
    playedTracks,
    activeMessages
}