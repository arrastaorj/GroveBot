const schema = require("../../database/models/currencySchema")
const discord = require("discord.js")
const comandos = require("../../database/models/comandos")

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

        if (!cmd) return interaction.reply({ content: `> \`-\` Um Adminitrador ainda não configurou o canal para uso de comandos!`, ephemeral: true })


        let cmd1 = cmd.canal1

        if (cmd1 === null || cmd1 === false || !client.channels.cache.get(cmd1) || cmd1 === interaction.channel.id) {


            let withdrawAmount = interaction.options.getInteger("valor")

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
                await interaction.reply({
                    content: "> \`-\` Ocorreu um erro ao executar este comando...",
                    ephemeral: true,
                })
            }

            if (withdrawAmount > data.bank) {
                await interaction.reply({
                    content: "> \`-\` Você não tem tantas moedas em seu banco para sacar.",
                    ephemeral: true,
                })
            } else if (withdrawAmount <= 0) {
                await interaction.reply({
                    content: "> \`-\` Insira um número acima de 0.",
                    ephemeral: true,
                })
            } else {
                data.bank -= withdrawAmount * 1
                data.wallet += withdrawAmount * 1
                await data.save()

                const withdrawEmbed = new discord.EmbedBuilder()
                    .setColor("#0155b6")
                    .setDescription(
                        `Retirado com sucesso **:coin: ${withdrawAmount.toLocaleString()}** do banco`
                    )

                await interaction.reply({
                    content: `> \`+\` <:withdraw_8378797:1162537287188496434> Operação realizada com sucesso. Valor do saque: **<:Lecoin:1059125860524900402> ${withdrawAmount.toLocaleString()}**`,
                    ephemeral: true,
                })
            }


        }
        else


            if (interaction.channel.id !== cmd1) { interaction.reply({ content: `> \`-\` Você estar tentando usar um comando no canal de texto errado, tente utiliza-lo no canal de <#${cmd1}>.`, ephemeral: true }) }


    }
}