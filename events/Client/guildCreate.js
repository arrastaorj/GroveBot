const client = require('../../index')
const { EmbedBuilder } = require("discord.js")


client.on("guildCreate", async (guild) => {
    if (guild.name === undefined) return;

    const channel = client.channels.cache.get("1188525235025231872")
    const invites = await client.guilds.cache.get(guild.id).invites.fetch();
    const invite = invites.first();

    await channel.send({
        embeds: [
            new EmbedBuilder()
                .setColor("#03f7ff")
                .setTitle("Novo servidor adicionado 🎉")
                .setDescription(`Agora estou em: **${client.guilds.cache.size} servidores** ✨`)
                .setFields(
                    {
                        name: `Servidor`,
                        value: `${guild.name}`
                    },
                    {
                        name: `Usuários`,
                        value: `${guild.memberCount}`
                    },
                    {
                        name: `ID`,
                        value: `${guild.id}`
                    },
                    {
                        name: `Convite`,
                        value: `${invite ? invite.url : 'Nenhum convite disponível'}`
                    },
                )
                .setTimestamp(),
        ]
    })
})