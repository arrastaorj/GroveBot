const client = require('../../index')
const { EmbedBuilder } = require("discord.js")


client.on("guildCreate", async (guild, member) => {
    if (guild.name === undefined) return;

    const channel = client.channels.cache.get("1188525235025231872");

    await channel.send({
        embeds: [
            new EmbedBuilder()
                .setTitle("Novo servidor adicionado 🎉")
                .setDescription(`Acabei de ingressar no servidor: **${guild.name}** \n Agora estou em: **${client.guilds.cache.size}** servidores. ✨`)
                .setColor('#41b2b0')
                .setFooter({ text: guild.name })
                .setTimestamp(),
        ],
    })
})