const {
    ApplicationCommandType,
    ApplicationCommandOptionType,

} = require("discord.js")

const banco = require("../../database/models/banco")
const idioma = require("../../database/models/language")
const canalComandos = require("../../database/models/comandos")

module.exports = {
    name: 'saldo',
    description: 'Mostra o saldo de um usuário.',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "user",
            description: "Selecione um usuário para visualizar seu saldo.",
            type: ApplicationCommandOptionType.User,
            required: false
        },
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

        const user = interaction.options.getUser("user") || interaction.user


        try {

            const query = {
                guildId: interaction.guild.id,
                userId: user.id,
            }

            const user2 = await banco.findOne(query)

            if (user2) {

                await interaction.reply({
                    content: `${user}\n> \`+\` <:withdraw_8378797:1162537287188496434> ${lang.msg54} <:dollar_9729309:1178199735799119892> **${user2.saldo.toLocaleString()} GroveCoins** \n> \`+\` <:bank_7407955:1162534093997752420> ${lang.msg55} <:dollar_9729309:1178199735799119892> **${user2.bank.toLocaleString()} GroveCoins**\n\n> \`+\` ${lang.msg56} <:star_4066310:1162534911211737098> **GV Primer** ${lang.msg57} **GroveCoins** ${lang.msg58}`
                })

            } else {
                const newUser = new banco({
                    guildId: interaction.guild.id,
                    userId: user.id,

                });

                await newUser.save()


                const query = {
                    guildId: interaction.guild.id,
                    userId: user.id,
                }

                const user2 = await banco.findOne(query)


                await interaction.reply({
                    content: `${user}\n> \`+\` <:withdraw_8378797:1162537287188496434> ${lang.msg54} <:dollar_9729309:1178199735799119892> **${user2.saldo.toLocaleString()} GroveCoins** \n> \`+\` <:bank_7407955:1162534093997752420> ${lang.msg55} <:dollar_9729309:1178199735799119892> **${user2.bank.toLocaleString()} GroveCoins**\n\n> \`+\` ${lang.msg56} <:star_4066310:1162534911211737098> **GV Primer** ${lang.msg57} **GroveCoins** ${lang.msg58}`
                })
            }

        } catch (error) {
            console.log(`Error with /daily: ${error}`)
        }


    }
}