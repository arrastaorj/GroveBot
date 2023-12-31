const {
    ApplicationCommandType,
    ApplicationCommandOptionType,
} = require("discord.js")


const canalComandos = require("../../database/models/comandos")
const banco = require("../../database/models/banco")
const idioma = require("../../database/models/language")

module.exports = {
    name: 'sacar',
    description: 'Retire suas moedas do banco',
    type: ApplicationCommandType.ChatInput,

    options: [
        {
            name: "valor",
            description: "Insira o valor do saque",
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


        let withdrawAmount = interaction.options.getInteger("valor")


        const query = {
            guildId: interaction.guild.id,
            userId: interaction.user.id,

        }

        let data = await banco.findOne(query)

        if (data) {

            if (withdrawAmount > data.bank) {
                await interaction.reply({
                    content: `${interaction.user}\n${lang.msg50}`,
                    ephemeral: true,
                })
            } else if (withdrawAmount <= 0) {
                await interaction.reply({
                    content: `${interaction.user}\n${lang.msg51}`,
                    ephemeral: true,
                })
            } else {
                data.bank -= withdrawAmount * 1
                data.saldo += withdrawAmount * 1
                await data.save()

                await interaction.reply({
                    content: `${interaction.user}\n> \`+\` <:download_9906560:1162869267591602327> ${lang.msg52}\n> \`+\` ${lang.msg53} **<:dollar_9729309:1178199735799119892> ${withdrawAmount.toLocaleString()} GroveCoins**`,
                })
            }

        }
    }
}
