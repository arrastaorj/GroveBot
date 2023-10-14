const discord = require("discord.js")
const comandos = require("../../database/models/comandos")
const User = require('../../database/models/economia')

module.exports = {
    name: 'deposit',
    description: 'Deposite suas moedas no banco',
    options: [
        {
            name: "valor",
            description: "Insira o valor do depósito",
            type: discord.ApplicationCommandOptionType.Integer,
            required: true
        }
    ],

    run: async (client, interaction) => {

        const cmd = await comandos.findOne({
            guildId: interaction.guild.id
        })

        if (!cmd) return interaction.reply({ content: `> \`-\` Um Adminitrador ainda não configurou o canal para uso de comandos!`, ephemeral: true })


        let cmd1 = cmd.canal1

        if (cmd1 === null || cmd1 === false || !client.channels.cache.get(cmd1) || cmd1 === interaction.channel.id) {


            const depositAmount = interaction.options.getInteger("valor")

            try {

                const query = {
                    userId: interaction.user.id,
                    guildId: interaction.guild.id,
                }

                let data = await User.findOne(query)

                if (data) {

                    if (depositAmount > data.saldo) {
                        await interaction.reply({ content: `${interaction.user}\n> \`-\` Você não tem tantas moedas na carteira para depositar.`, ephemeral: true })
                    } else if (depositAmount <= 0) {
                        await interaction.reply({ content: `${interaction.user}\n> \`-\` Insira um número acima de 0.`, ephemeral: true })
                    } else {
                        data.saldo -= depositAmount * 1

                        data.bank += depositAmount * 1

                        await data.save()

                        await interaction.reply({ content: `${interaction.user}\n> \`+\` <:profits_2936758:1162527940022644916> Valor depositado com sucesso **<:Lecoin:1059125860524900402> ${depositAmount.toLocaleString()} LexaCoins**` })
                    }

                }

            } catch (err) {
                console.log(err)
                await interaction.reply({ content: "> \`-\` Ocorreu um erro ao executar este comando...", ephemeral: true })
            }

        }
        else


            if (interaction.channel.id !== cmd1) { interaction.reply({ content: `> \`-\` Você estar tentando usar um comando no canal de texto errado, tente utiliza-lo no canal de <#${cmd1}>.`, ephemeral: true }) }
    }
}