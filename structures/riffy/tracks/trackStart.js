const { AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const { musicCard } = require("musicard")
const client = require("../../../index")



const activeMessages = new Map();

client.riffy.on('trackStart', async (player, track) => {
    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('voltar')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('<:voltar:1183481878313967758>'),

            new ButtonBuilder()
                .setCustomId('pause')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('<:pause:1183481872374845531>'),

            new ButtonBuilder()
                .setCustomId('skip')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('<:pular:1183481876447506552>'),
        )

    const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('disconnect')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('<:encerra:1183505672252440687>'),

            new ButtonBuilder()
                .setCustomId('autoplay')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('<:autoplay:1183505674328604743>'),

            new ButtonBuilder()
                .setCustomId('fila')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('<:filas:1183481870051201184>'),
        )


    const channel = client.channels.cache.get(player.textChannel);

    function formatTime(time) {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    }

    const musicLength = track.info.length;
    const formattedLength = formatTime(Math.round(musicLength / 1000));

    const card = new musicCard()
        .setName(track.info.title)
        .setAuthor(track.info.author)
        .setColor("auto")
        .setTheme("classic")
        .setBrightness(100)
        .setThumbnail(track.info.thumbnail)
        .setProgress(0)
        .setStartTime("0:00")
        .setEndTime(formattedLength);

    const buffer = await card.build();
    const attachment = new AttachmentBuilder(buffer, { name: `musicard.png` });

    const existingMessage = activeMessages.get(channel.id);

    try {
        if (existingMessage) {
            const { msg, row, row2 } = existingMessage;
            await msg.edit({
                files: [attachment],
                components: [row, row2],
            });
        } else {
            const msg = await channel.send({
                files: [attachment],
                components: [row, row2],
            });
            activeMessages.set(channel.id, { msg, row, row2 });
        }
    } catch (error) {
        // Se ocorrer um erro ao editar a mensagem existente ou a mensagem foi apagada,
        // envie uma nova mensagem e remova a entrada do mapa
        const msg = await channel.send({
            files: [attachment],
            components: [row, row2],
        });
        activeMessages.delete(channel.id);
        activeMessages.set(channel.id, { msg, row, row2 });
    }
})


client.riffy.on("queueEnd", async (player) => {

    const rowDisabled = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('voltar')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('<:voltar:1183481878313967758>')
                .setDisabled(true),
            new ButtonBuilder()
                .setCustomId('pause')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('<:pause:1183481872374845531>')
                .setDisabled(true),
            new ButtonBuilder()
                .setCustomId('skip')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('<:pular:1183481876447506552>')
                .setDisabled(true),
        )

    const rowDisabled2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('disconnect')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('<:encerra:1183505672252440687>')
                .setDisabled(true),
            new ButtonBuilder()
                .setCustomId('autoplay')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('<:autoplay:1183505674328604743>')
                .setDisabled(true),
            new ButtonBuilder()
                .setCustomId('fila')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('<:filas:1183481870051201184>')
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

    try {

        const channel = client.channels.cache.get(player.textChannel)
        const existingMessage = activeMessages.get(channel.id)

        if (existingMessage) {
            const { msg } = existingMessage

            await msg.edit({
                files: [attachment], components: [rowDisabled, rowDisabled2]
            })
        }

    } catch (error) {
        return
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