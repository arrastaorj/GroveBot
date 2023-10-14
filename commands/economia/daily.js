const schema = require("../../database/models/currencySchema")
const discord = require("discord.js")
const ms = require("ms")
const comandos = require("../../database/models/comandos")

module.exports = {
    name: 'daily',
    description: 'Reivindique sua recompensa diária.',

    run: async (client, interaction) => {

        const cmd = await comandos.findOne({
            guildId: interaction.guild.id
        })

        if (!cmd) return interaction.reply({ content: `> \`-\` Um Adminitrador ainda não configurou o canal para uso de comandos!`, ephemeral: true })


        let cmd1 = cmd.canal1

        if (cmd1 === null || cmd1 === false || !client.channels.cache.get(cmd1) || cmd1 === interaction.channel.id) {


            let amount = Math.floor(Math.random() * 10000) + 1000

            let data
            try {
                data = await schema.findOne({
                    userId: interaction.user.id,
                })

                if (!data) {
                    data = await schema.create({
                        userId: interaction.user.id,
                        guildId: interaction.guild.id,
                    })
                }
            } catch (err) {
                console.log(err)
                await interaction.reply({ content: "> \`-\` Ocorreu um erro ao executar este comando...", ephemeral: true })
            }

            let timeout = 86400000

            if (timeout - (Date.now() - data.dailyTimeout) > 0) {
                let timeLeft = ms(timeout - (Date.now() - data.dailyTimeout))

                await interaction.reply({ content: `> \`-\` Você já resgatou recompensas diárias hoje! Aguarde até **${timeLeft}** Para resgata novamente.`, ephemeral: true })
            } else {
                data.dailyTimeout = Date.now()
                data.wallet += amount * 1
                await data.save()

                await interaction.reply({ content: `> \`+\` Você recebeu **<:Lecoin:1059125860524900402> ${amount.toLocaleString()} LexaCoins**` })
            }

        }
        else


            if (interaction.channel.id !== cmd1) { interaction.reply({ content: `> \`-\` Você estar tentando usar um comando no canal de texto errado, tente utiliza-lo no canal de <#${cmd1}>.`, ephemeral: true }) }

    }
}