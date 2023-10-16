const discord = require("discord.js")
const ms = require("../../plugins/parseMs")
const comandos = require("../../database/models/comandos")
const rep = require("../../database/models/rep")

module.exports = {
    name: "rep",
    description: "Dê uma reputação para um usuário.",
    type: discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "usuario",
            type: discord.ApplicationCommandOptionType.User,
            description: "Mencione o usuário.",
            required: true

        },
    ],

    run: async (client, interaction, args) => {

        const cmd = await comandos.findOne({
            guildId: interaction.guild.id
        })

        if (!cmd) return interaction.reply({ content: `> \`-\` <a:alerta:1163274838111162499> Um Adminitrador ainda não configurou o canal para uso de comandos!`, ephemeral: true })

        let cmd1 = cmd.canal1

        if (cmd1 === null || cmd1 === false || !client.channels.cache.get(cmd1) || cmd1 === interaction.channel.id) {

            const user = interaction.options.getUser('usuario')


            const cmd3 = await rep.findOne({
                userId: interaction.user.id,
                guildId: interaction.guild.id
            })

            const timeout = 300000

            if (cmd3 !== null && timeout - (Date.now() - cmd3.Cd) > 0) {
                const time = ms(timeout - (Date.now() - cmd3.Cd))
                return interaction.reply({ content: `> \`-\` ⌛ Você está em **tempo de recarga**, Volte em **${time.minutes}** minutos **${time.seconds}**s`, ephemeral: true })
            } else {

                if (user === interaction.user) return interaction.reply({ content: `> \`-\` 🙅‍♀️ Por mais talentoso que você seja, não pode adicionar reputações para você mesmo!`, ephemeral: true })

                await rep.findOneAndUpdate(
                    {
                        userId: interaction.user.id,
                        guildId: interaction.guild.id
                    },
                    {
                        $set: {
                            "Cd": Date.now() + timeout
                        }
                    },
                    { upsert: true }
                )

                const cmd2 = await rep.findOne({
                    userId: user.id,
                    guildId: interaction.guild.id
                })

                if (!cmd2) {
                    const newCmd = {
                        userId: user.id,
                        guildId: interaction.guild.id,
                        Rep: 1
                    }
                    await rep.create(newCmd)
                } else {
                    const currentRep = cmd2.Rep || 0
                    await rep.findOneAndUpdate(
                        {
                            userId: user.id,
                            guildId: interaction.guild.id
                        },
                        {
                            $set: { "Rep": currentRep + 1 }
                        }
                    )
                }

                interaction.reply({ content: `> \`+\` 🎉 ${interaction.user} adicionou uma reputação a ${user}`, ephemeral: true })
            }
        }

        else

            if (interaction.channel.id !== cmd1) { interaction.reply({ content: `> \`-\` <a:alerta:1163274838111162499> Você estar tentando usar um comando no canal de texto errado, tente utiliza-lo no canal de <#${cmd1}>.`, ephemeral: true }) }
    }
}