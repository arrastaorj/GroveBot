const schema = require("../../database/models/currencySchema")
const discord = require("discord.js")
const comandos = require("../../database/models/comandos")

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

        if (!cmd) return interaction.reply({ content: `> \`-\` Um Adminitrador ainda não configurou o canal para uso de comandos!`, ephemeral: true })


        let cmd1 = cmd.canal1

        if (cmd1 === null || cmd1 === false || !client.channels.cache.get(cmd1) || cmd1 === interaction.channel.id) {


            let user = interaction.options.getUser("user")

            if (!user) {
                user = interaction.user
            }

            let data
            try {
                data = await schema.findOne({
                    userId: user.id,
                })

                if (!data) {
                    data = await schema.create({
                        userId: user.id,
                        guildId: interaction.guild.id,
                    })
                }
            } catch (err) {
                await interaction.reply({
                    content: "> \`-\` Ocorreu um erro ao executar este comando...",
                    ephemeral: true,
                })
            }


            await interaction.reply({ content: `> \`+\` <:money_513951:1162527942346293259> Carteira: <:Lecoin:1059125860524900402> **${data.wallet.toLocaleString()} LexaCoins** \n> \`+\` <:bank_7407955:1162534093997752420> Banco: <:Lecoin:1059125860524900402> **${data.bank.toLocaleString()} LexaCoins**\n\n> \`+\` Membros <:star_4066310:1162534911211737098> **LC Primer** recebem **LexaCoins** em Dobro!` })

        }
        else


            if (interaction.channel.id !== cmd1) { interaction.reply({ content: `> \`-\` Você estar tentando usar um comando no canal de texto errado, tente utiliza-lo no canal de <#${cmd1}>.`, ephemeral: true }) }

    }
}