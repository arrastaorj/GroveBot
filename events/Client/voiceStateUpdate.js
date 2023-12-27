const client = require("../../index.js");
const { activeMessages } = require("../../riffyMusic/riffy/tracks/trackStart.js")
const { disconnectRow, disconnectRow2 } = require("../../riffyMusic/riffy/buttons/musicButtons.js")

client.on("voiceStateUpdate", (oldState, newState) => {
    const guildId = oldState.guild.id;
    const player = client.riffy.players.get(guildId);

    if (!player) return;

    const oldVoiceChannel = oldState.channel;

    const oldNonBotMember = oldVoiceChannel ? oldVoiceChannel.members.find((member) => !member.user.bot) : null;

    if (!oldNonBotMember && oldVoiceChannel && oldVoiceChannel.members.size === 1) {

        const intervalId = setInterval(() => {
            try {
                const channel = client.channels.cache.get(player.textChannel);
                const existingMessage = activeMessages.get(channel.id);

                if (existingMessage) {
                    const { msg } = existingMessage;
                    msg.edit({
                        components: [disconnectRow, disconnectRow2]
                    });
                }
            } catch (error) {
                console.error(error);
            }

            const nonBotMembers = oldVoiceChannel.members.filter((member) => !member.user.bot);

            if (nonBotMembers.size === 0) {
                clearInterval(intervalId);
                player.destroy();
            }

        }, 60000)
    }
});
