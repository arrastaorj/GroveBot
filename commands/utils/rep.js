const discord = require("discord.js")
const ms = require("../../plugins/parseMs")
const comandos = require("../../database/models/comandos")
const rep = require("../../database/models/rep")
const idioma = require("../../database/models/language")


module.exports = {
    name: "rep",
    description: "Dê uma reputação para um usuário.",
    type: discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "usuario",
            type: discord.ApplicationCommandOptionType.User,
            description: "Mencione o usuário.",
            required: true

        },
    ],

    run: async (client, interaction, args) => {


        let lang = await idioma.findOne({
            guildId: interaction.guild.id
        })

        if (!lang || !lang.language) {
            lang = { language: client.language };
        }
        lang = require(`../../languages/${lang.language}.js`)


        const cmd = await comandos.findOne({
            guildId: interaction.guild.id
        })

        if (!cmd)
            return interaction.reply({
                content: `${lang.alertCommandos}`,
                ephemeral: true
            })

        let cmd1 = cmd.canal1

        if (cmd1 === null || cmd1 === false || !client.channels.cache.get(cmd1) || cmd1 === interaction.channel.id) {

            const user = interaction.options.getUser('usuario')




            const cmd3 = await rep.findOne({
                guildId: interaction.guild.id,
                userId: interaction.user.id,

            })

            const timeout = 300000

            if (cmd3 !== null && timeout - (Date.now() - cmd3.Cd) > 0) {
                const time = ms(timeout - (Date.now() - cmd3.Cd))
                return interaction.reply({
                    content: `${lang.msg205} **${time.minutes}** ${lang.msg206} **${time.seconds}**s`,
                    ephemeral: true
                })

            } else {

                if (user === interaction.user)
                    return interaction.reply({
                        content: `${lang.msg207}`,
                        ephemeral: true
                    })

                await rep.findOneAndUpdate(
                    {
                        guildId: interaction.guild.id,
                        userId: interaction.user.id,
                    },
                    {
                        $set: {
                            "Cd": Date.now() + timeout
                        }
                    },
                    { upsert: true }
                )

                const cmd2 = await rep.findOne({
                    guildId: interaction.guild.id,
                    userId: user.id,

                })

                if (!cmd2) {
                    const newCmd = {
                        guildId: interaction.guild.id,
                        userId: user.id,
                        Rep: 1
                    }
                    await rep.create(newCmd)
                } else {
                    const currentRep = cmd2.Rep || 0
                    await rep.findOneAndUpdate(
                        {
                            guildId: interaction.guild.id,
                            userId: user.id,
                        },
                        {
                            $set: { "Rep": currentRep + 1 }
                        }
                    )
                }

                interaction.reply({
                    content: `> \`+\` 🎉 ${interaction.user} ${lang.msg208} ${user}`,
                    ephemeral: false
                })
            }
        }

        else if (interaction.channel.id !== cmd1) {
            interaction.reply({
                content: `${lang.alertCanalErrado} <#${cmd1}>.`,
                ephemeral: true
            })
        }
    }
}