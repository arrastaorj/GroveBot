const discord = require('discord.js')
const User = require('../../database/models/economia')
const ms = require("../../plugins/parseMs")
const comandos = require("../../database/models/comandos")


module.exports = {
    name: 'daily',
    description: 'Collect your dailies!',


    run: async (client, interaction) => {



        const cmd = await comandos.findOne({
            guildId: interaction.guild.id
        })

        if (!cmd) return interaction.reply({ content: `> \`-\` <a:alerta:1163274838111162499> Um Adminitrador ainda não configurou o canal para uso de comandos!`, ephemeral: true })


        let cmd1 = cmd.canal1

        if (cmd1 === null || cmd1 === false || !client.channels.cache.get(cmd1) || cmd1 === interaction.channel.id) {



            const amount = Math.floor(Math.random() * 10000) + 1000

            try {

                const query = {
                    guildId: interaction.guild.id,
                    userId: interaction.user.id,
                }

                let user = await User.findOne(query)

                if (user) {


                    let timeout = 86400000

                    if (timeout - (Date.now() - user.lastDaily) > 0) {

                        const timeLeft = ms(timeout - (Date.now() - user.lastDaily))

                        interaction.reply({ content: `${interaction.user}\n> \`-\` Você já resgatou recompensas diárias hoje! Aguarde **${timeLeft.hours}h e ${timeLeft.minutes}m** Para resgata novamente.`, ephemeral: true })
                        return
                    }

                    user.lastDaily = new Date()
                } else {
                    user = new User({
                        ...query,
                        lastDaily: new Date(),
                    })
                }

                user.saldo += amount * 1
                await user.save()

                interaction.reply({ content: `${interaction.user}\n> \`+\` Você regatou **<:Lecoin:1059125860524900402> ${amount.toLocaleString()} LexaCoins**` })


            } catch (error) {
                console.log(`Error with /daily: ${error}`)
            }
        }
        else


            if (interaction.channel.id !== cmd1) { interaction.reply({ content: `> \`-\` <a:alerta:1163274838111162499> Você estar tentando usar um comando no canal de texto errado, tente utiliza-lo no canal de <#${cmd1}>.`, ephemeral: true }) }
    }
}