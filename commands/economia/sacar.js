const {
    ApplicationCommandType,
    ApplicationCommandOptionType,
} = require("discord.js")



const comandos = require("../../database/models/comandos")
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


        const cmd = await comandos.findOne({
            guildId: interaction.guild.id
        })

        if (!cmd) return interaction.reply({
            content: `${lang.alertCommandos}`,
            ephemeral: true
        })


        let cmd1 = cmd.canal1

        if (cmd1 === null || cmd1 === false || !client.channels.cache.get(cmd1) || cmd1 === interaction.channel.id) {


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
        else

            if (interaction.channel.id !== cmd1) {
                interaction.reply({
                    content: `${lang.alertCanalErrado} <#${cmd1}>.`,
                    ephemeral: true
                })
            }

    }
}
