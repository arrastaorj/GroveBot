const {
    ApplicationCommandType
} = require("discord.js")
const ms = require("ms")


const canalComandos = require("../../database/models/comandos")
const banco = require("../../database/models/banco")
const idioma = require("../../database/models/language")

module.exports = {
    name: 'implorar',
    description: 'Implore por algumas moedas.',
    type: ApplicationCommandType.ChatInput,
    run: async (client, interaction) => {

        let lang = await idioma.findOne({
            guildId: interaction.guild.id
        })
        lang = lang ? require(`../../languages/${lang.language}.js`) : require('../../languages/pt.js')


        const canalID = await canalComandos.findOne({
            guildId: interaction.guild.id
        })
        if (!canalID) return interaction.reply({
            content: `${lang.alertCommandos}`,
            ephemeral: true
        })

        let canalPermitido = canalID.canal1
        if (interaction.channel.id !== canalPermitido) {
            return interaction.reply({
                content: `${lang.alertCanalErrado} <#${canalPermitido}>.`,
                ephemeral: true
            })
        }


        let amount = Math.floor(Math.random() * 1000) + 100

        const query = {
            guildId: interaction.guild.id,
            userId: interaction.user.id,
        }

        let data = await banco.findOne(query)

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
}
