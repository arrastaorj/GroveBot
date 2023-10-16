const discord = require('discord.js')
const fs = require('fs')
const comandos = require("../../database/models/comandos")

module.exports = {
    name: 'help',
    type: discord.ApplicationCommandType.ChatInput,
    description: 'Veja todos os meus comandos disponíveis.',
    run: async (client, interaction) => {

        const cmd = await comandos.findOne({
            guildId: interaction.guild.id
        })

        let cmd1 = cmd.canal1

        if (cmd1 === null || cmd1 === false || !client.channels.cache.get(cmd1) || cmd1 === interaction.channel.id) {


            const optionsArr = []

            const commandsFolder = fs.readdirSync('./commands')
            for (const category of commandsFolder) {
                optionsArr.push({ label: `${category}`, description: `Veja os comandos de ${category}`, value: `${category}` })
            }

            const embed = new discord.EmbedBuilder()
                .setTitle('Central de Ajuda')
                .setColor("#41b2b0")
                .setDescription('Clique em uma das opções abaixo para ver meus comandos.')

            const menu = new discord.ActionRowBuilder()
                .setComponents(
                    new discord.StringSelectMenuBuilder()
                        .setCustomId('menu-help')
                        .addOptions(optionsArr)
                )

            await interaction.reply({ embeds: [embed], components: [menu] }).then(async (msg) => {

                const collector = msg.createMessageComponentCollector({ time: 60000 })

                collector.on('collect', async (i) => {


                    if (i.user.id != interaction.user.id) return i.reply({ content: `> \`-\` <a:alerta:1163274838111162499> Somente a pessoa que executou o comando (\`${interaction.user.tag}\`) pode interagir com ele.`, ephemeral: true });

                    i.deferUpdate();
                    const selected = i.values[0]
                    const commandsArr = []
                    const commandsFiles = fs.readdirSync(`./commands/${selected}`)

                    for (const command of commandsFiles) {
                        if (command.endsWith('.js')) {
                            commandsArr.push(command.replace(/.js/g, ''))
                        }
                    }

                    embed.setDescription(`Veja os comandos da categoria ${selected}`)
                    embed.setFields([
                        { name: 'Comandos (/)', value: `\`\`\`${commandsArr.join(', ')}\`\`\`` }
                    ])

                    interaction.editReply({ embeds: [embed] })
                })
            })
        }
        else

            if (interaction.channel.id !== cmd1) { interaction.reply({ content: `> \`-\` <a:alerta:1163274838111162499> Você estar tentando usar um comando no canal de texto errado, tente utiliza-lo no canal de <#${cmd1}>.`, ephemeral: true }) }
    }
}