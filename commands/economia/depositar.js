const {
    ApplicationCommandOptionType,
} = require('discord.js')


const canalComandos = require("../../database/models/comandos")
const banco = require("../../database/models/banco")
const idioma = require("../../database/models/language")

module.exports = {
    name: 'depositar',
    description: 'Deposite suas moedas no banco',
    options: [
        {
            name: "valor",
            description: "Insira o valor do depósito",
            type: ApplicationCommandOptionType.Integer,
            required: true
        }
    ],

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


        const depositAmount = interaction.options.getInteger("valor")

        try {

            const query = {
                guildId: interaction.guild.id,
                userId: interaction.user.id,
            }

            let data = await banco.findOne(query)

            if (data) {

                if (depositAmount > data.saldo) {
                    await interaction.reply({ content: `${interaction.user}\n${lang.msg19}`, ephemeral: true })
                } else if (depositAmount <= 0) {
                    await interaction.reply({ content: `${interaction.user}\n${lang.msg20}`, ephemeral: true })
                } else {
                    data.saldo -= depositAmount * 1

                    data.bank += depositAmount * 1

                    await data.save()

                    await interaction.reply({ content: `${interaction.user}\n${lang.msg21} ${depositAmount.toLocaleString()} ${lang.msg22}` })
                }

            }

        } catch (err) {
            console.log(err)
            await interaction.reply({ content: `${lang.msg23}`, ephemeral: true })
        }

    }
}

