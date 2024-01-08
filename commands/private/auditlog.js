const {
    ApplicationCommandType,
    ApplicationCommandOptionType,
    EmbedBuilder
} = require("discord.js")

const GuildConfig = require('../../database/models/auditlogs');
const idioma = require("../../database/models/language")

module.exports = {
    name: "audit",
    description: "Ative a função de logs do servidor.",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'logs',
            description: 'Ative a função de logs do servidor.',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'action',
                    description: 'Ativar ou desativar o Audit Logs.',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    choices: [
                        {
                            name: 'Ativar',
                            value: 'ativar',
                        },
                        {
                            name: 'Desativar',
                            value: 'desativar',
                        },
                    ],
                },
                {
                    name: 'canal',
                    description: 'Canal destinado a logs do servidor.',
                    type: ApplicationCommandOptionType.Channel,
                    required: false,
                }
            ],
        },
    ],


    run: async (client, interaction) => {

        let lang = await idioma.findOne({
            guildId: interaction.guild.id,
        })
        lang = lang ? require(`../../languages/${lang.language}.js`) : require('../../languages/pt.js')

        let guildConfig = await GuildConfig.findOne({
            guildId: interaction.guild.id
        })

        if (!guildConfig) {
            guildConfig = await GuildConfig.create({
                guildId: interaction.guild.id
            })
        }

        const subcommand = interaction.options.getSubcommand()

        if (subcommand === 'logs') {
            const action = interaction.options.getString('action')

            if (action === 'ativar') {

                const canalLogs = interaction.options.getChannel('canal')

                if (!canalLogs) {

                    await interaction.reply({
                        content: `> \`-\` <a:alerta:1163274838111162499> Por favor, forneça um canal para os logs.`,
                        ephemeral: true
                    })

                    return;
                }

                guildConfig.auditlogs = true;
                guildConfig.canal = canalLogs.id;
                await guildConfig.save()


                const embed = new EmbedBuilder()
                    .setTitle(`Audit Logs`)
                    .addFields(
                        {
                            name: `Status`,
                            value: `<:activ:1193597525001769041>`
                        },
                        {
                            name: `Canal`,
                            value: `${canalLogs}`
                        }
                    )
                    .setFooter({
                        iconURL: interaction.user.displayAvatarURL({ extension: 'png' }),
                        text: `${lang.msg432} ${interaction.user.username}`,
                    })
                    .setThumbnail(interaction.guild.iconURL({ extension: 'png' }))
                    .setTimestamp()
                    .setColor('#41b2b0')


                await interaction.reply({
                    embeds: [embed],
                    ephemeral: true
                })


            } else if (action === 'desativar') {

                const canalLogs = interaction.options.getChannel('canal')
                if (canalLogs) {

                    await interaction.reply({
                        content: `> \`-\` <a:alerta:1163274838111162499> A opção de **Desativar**, Não é necessário fornecer o canal de logs.`,
                        ephemeral: true
                    })
                    return
                }


                guildConfig.auditlogs = false;
                guildConfig.canal

                guildConfig.canal = null
                await guildConfig.save();

                const embed = new EmbedBuilder()
                    .setTitle(`Audit Logs`)
                    .addFields(
                        {
                            name: `Status`,
                            value: `<:disactiv:1193597522250305568>`
                        },
                    )
                    .setFooter({
                        iconURL: interaction.user.displayAvatarURL({ extension: 'png' }),
                        text: `${lang.msg432} ${interaction.user.username}`,
                    })
                    .setThumbnail(interaction.guild.iconURL({ extension: 'png' }))
                    .setTimestamp()
                    .setColor('#41b2b0')

                await interaction.reply({
                    embeds: [embed],
                    ephemeral: true
                })


            } else {
                await interaction.reply('Ação inválida. Use "ativar" ou "desativar".')
            }
        }
    }
}

