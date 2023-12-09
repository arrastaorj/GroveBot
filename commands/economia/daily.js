const discord = require('discord.js')
const User = require('../../database/models/economia')
const ms = require("../../plugins/parseMs")
const comandos = require("../../database/models/comandos")
const idioma = require("../../database/models/language")


module.exports = {
    name: 'daily',
    description: 'Colete seus GroveCoins diários',


    run: async (client, interaction) => {

        let lang = await idioma.findOne({
            guildId: interaction.guild.id
        })

        if (!lang || !lang.language) {
            lang = { language: client.language };
        }
        lang = require(`../../languages/${lang.language}.js`)

        const cmd = await comandos.findOne({
            guildId: interaction.guild.id
        })


        if (!cmd) return interaction.reply({ content: `${lang.alertCommandos}`, ephemeral: true })


        let cmd1 = cmd.canal1

        if (cmd1 === null || cmd1 === false || !client.channels.cache.get(cmd1) || cmd1 === interaction.channel.id) {


            logCommand(interaction);

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

                        interaction.reply({ content: `${interaction.user}\n${lang.msg15} **${timeLeft.hours}h e ${timeLeft.minutes}m** ${lang.msg16}`, ephemeral: true })
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

                interaction.reply({ content: `${interaction.user}\n${lang.msg17} ${amount.toLocaleString()} ${lang.msg18}` })


            } catch (error) {
                console.log(`Error with /daily: ${error}`)
            }
        }
        else


            if (interaction.channel.id !== cmd1) { interaction.reply({ content: `${lang.alertCanalErrado} <#${cmd1}>.`, ephemeral: true }) }
    }
}


function logCommand(interaction) {
    const guildId = interaction.guild.name;
    const channelId = '1182895176004423730'; // Substitua pelo ID do canal de logs desejado
    const commandName = interaction.commandName;
    const executor = interaction.member.user.tag;
    const argsUsed = interaction.options.data.map(option => `${option.name}: ${option.value}`).join(', ');

    const channel = interaction.guild.channels.cache.get(channelId);

    if (channel) {
        const logEmbed = new discord.EmbedBuilder()
            .setTitle('Imput Logs')
            .setColor("#6dfef2")
            .addFields(
                {
                    name: "Comando",
                    value: `┕ \`${commandName}\``,
                    inline: false,
                },
                {
                    name: "Executor",
                    value: `┕ \`${executor}\``,
                    inline: false,
                },
                {
                    name: "Servidor",
                    value: `┕ \`${guildId}\``,
                    inline: false,
                },
                {
                    name: "Argumentos",
                    value: `┕ \`${argsUsed}\``,
                    inline: false,
                },
            )
            .setTimestamp()

        channel.send({ embeds: [logEmbed] });
    }
}