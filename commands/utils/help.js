const discord = require('discord.js')
const fs = require('fs')
const comandos = require("../../database/models/comandos")
const idioma = require("../../database/models/language")

module.exports = {
    name: 'help',
    type: discord.ApplicationCommandType.ChatInput,
    description: 'Veja todos os meus comandos disponíveis.',
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

        let cmd1 = cmd.canal1

        if (cmd1 === null || cmd1 === false || !client.channels.cache.get(cmd1) || cmd1 === interaction.channel.id) {


            const optionsArr = []

            const commandsFolder = fs.readdirSync('./commands')
            for (const category of commandsFolder) {
                optionsArr.push({ label: `${category}`, description: `${lang.msg174} ${category}`, value: `${category}` })
            }

            const embed = new discord.EmbedBuilder()
                .setTitle(`${lang.msg175}`)
                .setColor("#6dfef2")
                .setDescription(`${lang.msg176}`)

            const menu = new discord.ActionRowBuilder()
                .setComponents(
                    new discord.StringSelectMenuBuilder()
                        .setCustomId('menu-help')
                        .addOptions(optionsArr)
                )

            await interaction.reply({ embeds: [embed], components: [menu] }).then(async (msg) => {

                const collector = msg.createMessageComponentCollector({ time: 60000 })

                collector.on('collect', async (i) => {


                    if (i.user.id != interaction.user.id) return i.reply({
                        content: `${lang.msg177} (\`${interaction.user.tag}\`) ${lang.msg178}`,
                        ephemeral: true
                    });

                    i.deferUpdate();
                    const selected = i.values[0]
                    const commandsArr = []
                    const commandsFiles = fs.readdirSync(`./commands/${selected}`)

                    for (const command of commandsFiles) {
                        if (command.endsWith('.js')) {
                            commandsArr.push(command.replace(/.js/g, ''))
                        }
                    }

                    embed.setDescription(`${lang.msg179} ${selected}`)
                    embed.setFields([
                        { name: `${lang.msg180} (/)`, value: `\`\`\`${commandsArr.join(', ')}\`\`\`` }
                    ])

                    interaction.editReply({ embeds: [embed] })
                })
            })
        }
        else if (interaction.channel.id !== cmd1) {
            interaction.reply({
                content: `${lang.alertCanalErrado} <#${cmd1}>.`,
                ephemeral: true
            })
        }
    }
}

