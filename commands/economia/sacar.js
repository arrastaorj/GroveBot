const discord = require("discord.js")
const comandos = require("../../database/models/comandos")
const User = require('../../database/models/economia')
const idioma = require("../../database/models/language")

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


            let withdrawAmount = interaction.options.getInteger("valor")


            logCommand(interaction);

            const query = {
                guildId: interaction.guild.id,
                userId: interaction.user.id,

            }

            let data = await User.findOne(query)

            if (data) {

                if (withdrawAmount > data.bank) {
                    await interaction.reply({
                        content: `${interaction.user}\n${lang.msg50}`,
                        ephemeral: true,
                    })
                } else if (withdrawAmount <= 0) {
                    await interaction.reply({
                        content: `${interaction.user}\n${lang.msg51}`,
                        ephemeral: true,
                    })
                } else {
                    data.bank -= withdrawAmount * 1
                    data.saldo += withdrawAmount * 1
                    await data.save()

                    await interaction.reply({

                        content: `${interaction.user}\n> \`+\` <:download_9906560:1162869267591602327> ${lang.msg52}\n> \`+\` ${lang.msg53} **<:dollar_9729309:1178199735799119892> ${withdrawAmount.toLocaleString()} GroveCoins**`,

                    })
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