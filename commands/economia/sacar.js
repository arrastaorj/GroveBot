const discord = require("discord.js")
const comandos = require("../../database/models/comandos")
const User = require('../../database/models/economia')

module.exports = {
    name: 'sacar',

    description: 'Retire suas moedas do banco',

    options: [
        {
            name: "valor",
            description: "Insira o valor do saque",
            type: discord.ApplicationCommandOptionType.Integer,
            required: true
        }
    ],

    run: async (client, interaction) => {

        const cmd = await comandos.findOne({
            guildId: interaction.guild.id
        })

        if (!cmd) return interaction.reply({ content: `> \`-\` <a:alerta:1163274838111162499> Um Adminitrador ainda não configurou o canal para uso de comandos!`, ephemeral: true })


        let cmd1 = cmd.canal1

        if (cmd1 === null || cmd1 === false || !client.channels.cache.get(cmd1) || cmd1 === interaction.channel.id) {


            let withdrawAmount = interaction.options.getInteger("valor")


            const query = {
                userId: interaction.user.id,
                guildId: interaction.guild.id,
            }

            let data = await User.findOne(query)

            if (data) {

                if (withdrawAmount > data.bank) {
                    await interaction.reply({
                        content: `${interaction.user}\n> \`-\` Você não tem tantas moedas em seu banco para sacar.`,
                        ephemeral: true,
                    })
                } else if (withdrawAmount <= 0) {
                    await interaction.reply({
                        content: `${interaction.user}\n> \`-\` Insira um número acima de 0.`,
                        ephemeral: true,
                    })
                } else {
                    data.bank -= withdrawAmount * 1
                    data.saldo += withdrawAmount * 1
                    await data.save()

                    await interaction.reply({

                        content: `${interaction.user}\n> \`+\` <:download_9906560:1162869267591602327> Operação realizada com sucesso.\n> \`+\` Valor do saque: **<:Lecoin:1059125860524900402> ${withdrawAmount.toLocaleString()} LexaCoins**`,

                    })
                }

            }

        }
        else


            if (interaction.channel.id !== cmd1) { interaction.reply({ content: `> \`-\` <a:alerta:1163274838111162499> Você estar tentando usar um comando no canal de texto errado, tente utiliza-lo no canal de <#${cmd1}>.`, ephemeral: true }) }


    }
}