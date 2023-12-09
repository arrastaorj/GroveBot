const discord = require("discord.js")
const comandos = require("../../database/models/comandos")
const User = require('../../database/models/economia')
const idioma = require("../../database/models/language")

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


            const user = interaction.options.getUser("user") || interaction.user

            logCommand(interaction);

            try {

                const query = {
                    guildId: interaction.guild.id,
                    userId: user.id,
                }

                const user2 = await User.findOne(query)

                if (user2) {

                    await interaction.reply({ content: `${user}\n> \`+\` <:withdraw_8378797:1162537287188496434> ${lang.msg54} <:dollar_9729309:1178199735799119892> **${user2.saldo.toLocaleString()} GroveCoins** \n> \`+\` <:bank_7407955:1162534093997752420> ${lang.msg55} <:dollar_9729309:1178199735799119892> **${user2.bank.toLocaleString()} GroveCoins**\n\n> \`+\` ${lang.msg56} <:star_4066310:1162534911211737098> **GV Primer** ${lang.msg57} **GroveCoins** ${lang.msg58}` })

                } else {
                    const newUser = new User({
                        guildId: interaction.guild.id,
                        userId: user.id,

                    });

                    await newUser.save()


                    const query = {
                        guildId: interaction.guild.id,
                        userId: user.id,
                    }

                    const user2 = await User.findOne(query)


                    await interaction.reply({ content: `${user}\n> \`+\` <:withdraw_8378797:1162537287188496434> ${lang.msg54} <:dollar_9729309:1178199735799119892> **${user2.saldo.toLocaleString()} GroveCoins** \n> \`+\` <:bank_7407955:1162534093997752420> ${lang.msg55} <:dollar_9729309:1178199735799119892> **${user2.bank.toLocaleString()} GroveCoins**\n\n> \`+\` ${lang.msg56} <:star_4066310:1162534911211737098> **GV Primer** ${lang.msg57} **GroveCoins** ${lang.msg58}` })



                }

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