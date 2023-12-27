const client = require("../../index")
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require("discord.js")

const ms = require("ms")

client.on("messageCreate", async (message) => {



    const { author, guild, content } = message
    const { user } = client

    if (!guild || author.bot) return
    if (content.includes("@here") || content.includes("@everyone")) return
    if (!content.includes(user.id)) return

    return message.reply({

        embeds: [
            new EmbedBuilder()
                .setColor('#41b2b0')
                .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
                .setDescription(`**Olá!** Você me chamou? Meu nome é **Grove.** É um prazer conhecê-lo! Digite \`/\` para visualizar todos os meus comandos.\n\n Use </help:1167214616187773049> \n\n Se você me curtiu, considere vota no meu Top.gg \n\n*Esta mensagem será apagada em **50 segundos!***`)
                .setThumbnail(message.guild.iconURL({ extension: 'png' }))
                .setFooter({
                    iconURL: message.member.displayAvatarURL({ extension: 'png' }),
                    text: `Solicitado por ${message.member.displayName}`,
                })
                .setTimestamp()
        ],

        components: [
            new ActionRowBuilder().addComponents(

                new ButtonBuilder()
                    .setLabel("Convite")
                    .setURL("https://dsc.gg/grove-discordbot")
                    .setStyle(ButtonStyle.Link),

                // new ButtonBuilder()
                //     .setLabel("Website")
                //     .setURL("https://akaneweb.netlify.app/")
                //     .setStyle(ButtonStyle.Link),

                // new ButtonBuilder()
                //     .setLabel("Top.gg")
                //     .setURL("https://top.gg/bot/1025398453112684654/vote")
                //     .setStyle(ButtonStyle.Link),

                new ButtonBuilder()
                    .setLabel("Suporte")
                    .setURL("https://dsc.gg/grove-suporte")
                    .setStyle(ButtonStyle.Link),

            )
        ]

    }).then(msg => {

        setTimeout(() => {

            msg.delete().catch((err) => {

                if (err.code !== 10008) return console.log(err)

            })

        }, ms("50s"))

    })

})