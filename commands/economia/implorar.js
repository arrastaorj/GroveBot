const discord = require("discord.js")
const ms = require("ms")
const comandos = require("../../database/models/comandos")
const User = require('../../database/models/economia')
const idioma = require("../../database/models/language")

module.exports = {
    name: 'implorar',
    description: 'Implore por algumas moedas.',

    run: async (client, interaction) => {

        let lang = await idioma.findOne({
            guildId: interaction.guild.id
        })
        lang = lang ? require(`../../languages/${lang.language}.js`) : require('../../languages/pt.js')


        const cmd = await comandos.findOne({
            guildId: interaction.guild.id
        })

        if (!cmd) return interaction.reply({ content: `${lang.alertCommandos}`, ephemeral: true })


        let cmd1 = cmd.canal1

        if (cmd1 === null || cmd1 === false || !client.channels.cache.get(cmd1) || cmd1 === interaction.channel.id) {




            let amount = Math.floor(Math.random() * 1000) + 100

            const query = {
                guildId: interaction.guild.id,
                userId: interaction.user.id,
            }

            let data = await User.findOne(query)

            if (data) {

                let timeout = 300000

                if (timeout - (Date.now() - data.begTimeout) > 0) {
                    let timeLeft = ms(timeout - (Date.now() - data.begTimeout))

                    await interaction.reply({
                        content: `${interaction.user}\n${lang.msg38} **${timeLeft}** ${lang.msg39}`, ephemeral: true
                    })
                } else {
                    data.begTimeout = Date.now()
                    data.wallet += amount * 1
                    await data.save()
                    await interaction.reply({ content: `${interaction.user}\n${lang.msg40} ${amount.toLocaleString()} ${lang.msg41}` })
                }

            }

        }
        else

            if (interaction.channel.id !== cmd1) { interaction.reply({ content: `${lang.alertCanalErrado} <#${cmd1}>.`, ephemeral: true }) }
    }
}
