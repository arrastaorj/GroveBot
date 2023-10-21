const discord = require("discord.js")
const comandos = require("../../database/models/comandos")
const User = require('../../database/models/economia')

module.exports = {
    name: 'saldo',
    description: 'Mostra o saldo de um usuário.',

    options: [
        {
            name: "user",
            description: "Selecione um usuário para visualizar seu saldo.",
            type: discord.ApplicationCommandOptionType.User,
            required: false
        },
    ],

    run: async (client, interaction) => {

        const cmd = await comandos.findOne({
            guildId: interaction.guild.id
        })

        if (!cmd) return interaction.reply({ content: `> \`-\` <a:alerta:1163274838111162499> Um Adminitrador ainda não configurou o canal para uso de comandos!`, ephemeral: true })


        let cmd1 = cmd.canal1

        if (cmd1 === null || cmd1 === false || !client.channels.cache.get(cmd1) || cmd1 === interaction.channel.id) {


            const user = interaction.options.getUser("user") || interaction.user

            try {

                const query = {
                    userId: user.id,
                    guildId: interaction.guild.id,
                }

                const user2 = await User.findOne(query)

                if (user2) {

                    await interaction.reply({ content: `${user}\n> \`+\` <:money_513951:1162527942346293259> Carteira: <:Lecoin:1059125860524900402> **${user2.saldo.toLocaleString()} LexaCoins** \n> \`+\` <:bank_7407955:1162534093997752420> Banco: <:Lecoin:1059125860524900402> **${user2.bank.toLocaleString()} LexaCoins**\n\n> \`+\` Membros <:star_4066310:1162534911211737098> **LC Primer** recebem **LexaCoins** em Dobro!` })

                } else {
                    const newUser = new User({
                        userId: user.id,
                        guildId: interaction.guild.id,

                    });

                    await newUser.save()


                    const query = {
                        userId: user.id,
                        guildId: interaction.guild.id,
                    }

                    const user2 = await User.findOne(query)


                    await interaction.reply({ content: `${user}\n> \`+\` <:money_513951:1162527942346293259> Carteira: <:Lecoin:1059125860524900402> **${user2.saldo.toLocaleString()} LexaCoins** \n> \`+\` <:bank_7407955:1162534093997752420> Banco: <:Lecoin:1059125860524900402> **${user2.bank.toLocaleString()} LexaCoins**\n\n> \`+\` Membros <:star_4066310:1162534911211737098> **LC Primer** recebem **LexaCoins** em Dobro!` })



                }

            } catch (error) {
                console.log(`Error with /daily: ${error}`)
            }

        }
        else


            if (interaction.channel.id !== cmd1) { interaction.reply({ content: `> \`-\` <a:alerta:1163274838111162499> Você estar tentando usar um comando no canal de texto errado, tente utiliza-lo no canal de <#${cmd1}>.`, ephemeral: true }) }

    }
}