const client = require("../../index.js");
const { activeMessages } = require("../../riffyMusic/riffy/tracks/trackStart.js")
const { disconnectRow, disconnectRow2 } = require("../../riffyMusic/riffy/buttons/musicButtons.js")

client.on("voiceStateUpdate", async (oldState, newState) => {

    const guildId = oldState.guild.id;
    const player = client.riffy.players.get(guildId)

    if (!player) return;

    const oldVoiceChannel = oldState.channel;
    const newVoiceChannel = newState.channel;

    const oldMembers = oldVoiceChannel ? oldVoiceChannel.members : null;
    const oldNonBotMembers = oldMembers ? oldMembers.filter((member) => !member.user.bot) : null;

    if (oldNonBotMembers && oldNonBotMembers.size === 0 && oldMembers.size === 1) {

        setTimeout(async () => {

            try {
                const channel = client.channels.cache.get(player.textChannel)
                const existingMessage = activeMessages.get(channel.id)
                if (existingMessage) {
                    const { msg } = existingMessage

                    await msg.edit({
                        components: [disconnectRow, disconnectRow2]
                    })
                }

            } catch {
                return
            }
            player.destroy()
        }, 60000)
    }

    const newMembers = newVoiceChannel ? newVoiceChannel.members : null;
    const newNonBotMembers = newMembers ? newMembers.filter((member) => !member.user.bot) : null;

    if (newNonBotMembers && newNonBotMembers.size === 0 && newMembers.size === 1) {
        setTimeout(async () => {

            try {
                const channel = client.channels.cache.get(player.textChannel)
                const existingMessage = activeMessages.get(channel.id)
                if (existingMessage) {
                    const { msg } = existingMessage

                    await msg.edit({
                        components: [disconnectRow, disconnectRow2]
                    })
                }

            } catch {
                return
            }

            player.destroy()
        }, 60000)
    }

})
