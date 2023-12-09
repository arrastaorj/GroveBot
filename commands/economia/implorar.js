const discord = require("discord.js")
const ms = require("ms")
const comandos = require("../../database/models/comandos")
const User = require('../../database/models/economia')
const idioma = require("../../database/models/language")

module.exports = {
    name: 'implorar',
    description: 'Implore por algumas moedas.',

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
            

            let amount = Math.floor(Math.random() * 1000) + 100

            const query = {
                guildId: interaction.guild.id,
                userId: interaction.user.id,
            }

            let data = await User.findOne(query)

            if (data) {

                let timeout = 300000

                if (timeout - (Date.now() - data.begTimeout) > 0) {
                    let timeLeft = ms(timeout - (Date.now() - data.begTimeout))

                    await interaction.reply({
                        content: `${interaction.user}\n${lang.msg38} **${timeLeft}** ${lang.msg39}`, ephemeral: true
                    })
                } else {
                    data.begTimeout = Date.now()
                    data.wallet += amount * 1
                    await data.save()
                    await interaction.reply({ content: `${interaction.user}\n${lang.msg40} ${amount.toLocaleString()} ${lang.msg41}` })
                }

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