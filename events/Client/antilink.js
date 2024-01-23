const {
    PermissionFlagsBits,
} = require('discord.js');

const GuildConfig = require('../../database/models/antilink.js');
const client = require('../../index')
const idioma = require("../../database/models/language")

client.on("messageCreate", async (message) => {

    try {
        let lang = await idioma.findOne({
            guildId: message.guild.id
        })
        lang = lang ? require(`../../languages/${lang.language}.js`) : require('../../languages/pt.js')
    } catch {
        return
    }

    if (message.author.bot || !message.guild) return;
    const guildId = message.guild.id;

    let guildConfig = await GuildConfig.findOne({
        guildId,
    })

    if (guildConfig && guildConfig.antilinkEnabled) {
        const allowedRoles = guildConfig.allowedRoles;

        if (message.content.match(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zAZ0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/)) {
            if (message.member.permissions.has(PermissionFlagsBits.Administrator) || allowedRoles.some(roleId => message.member.roles.cache.has(roleId))) {
                return;
            }
            message.delete();

            await message.channel.send(`> \`-\` <a:alerta:1163274838111162499> ${message.author}, links não são permitidos em **${message.guild.name}**`).then((msg) => {
                setTimeout(() => {
                    msg.delete();
                }, 15000)
            })
        }
    }
})