const discord = require("discord.js")
const idioma = require("../../database/models/language")

module.exports = {
    name: "automod",
    description: "Configurar sistema automod",
    type: discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "ofencivas",
            type: discord.ApplicationCommandOptionType.Subcommand,
            description: "Bloqueie palavrões, conteúdo sexual e calúnias.",

        },
        {
            name: "spam-mensagens",
            type: discord.ApplicationCommandOptionType.Subcommand,
            description: "Bloquear mensagens suspeitas de spam.",


        },
        {
            name: "menção-spam",
            type: discord.ApplicationCommandOptionType.Subcommand,
            description: "Bloquear mensagens contendo uma certa quantidade de menções.",
            options: [
                {
                    name: 'número',
                    description: 'O número de menções necessárias para bloquear uma mensagem.',
                    type: discord.ApplicationCommandOptionType.Number,
                    required: true
                },
            ],
        },
        {
            name: "palavra-chave",
            type: discord.ApplicationCommandOptionType.Subcommand,
            description: "Bloqueie uma determinada palavra-chave no servidor.",
            options: [
                {
                    name: 'palavra',
                    description: 'A palavra que você deseja bloquear.',
                    type: discord.ApplicationCommandOptionType.String,
                    required: true
                },
            ],
        },

    ],

    run: async (client, interaction, args) => {

        let lang = await idioma.findOne({
            guildId: interaction.guild.id
        })

        if (!lang || !lang.language) {
            lang = { language: client.language };
        }
        lang = require(`../../languages/${lang.language}.js`)


        const { guild, options } = interaction
        const sub = options.getSubcommand()

        if (!interaction.member.permissions.has(discord.PermissionsBitField.Flags.Administrator))
            return await interaction.reply({
                content: `${lang.alertNaoTemPermissão}`,
                ephemeral: true
            })


        const botMember = interaction.member.guild.members.cache.get(client.user.id)
        const hasPermission = botMember.permissions.has("Administrator")

        if (hasPermission) {

            switch (sub) {
                case "ofencivas":

                    await interaction.reply({ content: `${lang.msg59}` })

                    const mod1 = await guild.autoModerationRules.create({
                        name: `${lang.msg60}`,
                        creatorId: '1053482665942196224',
                        enabled: true,
                        eventType: 1,
                        triggerType: 4,
                        triggerMetadata:
                        {
                            presets: [1, 2, 3]
                        },
                        actions: [
                            {
                                type: 1,
                                metadata: {
                                    channel: interaction.channel,
                                    durationSeconds: 10,
                                    customMessage: `${lang.msg61}`
                                }
                            }
                        ]
                    }).catch(async err => {
                        setTimeout(async () => {
                            return await interaction.editReply({ content: `${lang.msg62}`, ephemeral: true })
                        }, 2000)
                    })

                    setTimeout(async () => {
                        if (!mod1) return

                        const embed = new discord.EmbedBuilder()
                            .setColor("#6dfef2")
                            .setTimestamp()
                            .setAuthor({ name: `${lang.msg63}` })
                            .addFields({ name: `${lang.msg64}`, value: `${lang.msg65}` })
                            .setThumbnail("https://raw.githubusercontent.com/arrastaorj/flags/main/automod.png")

                        await interaction.editReply({ content: ``, embeds: [embed] })
                    }, 3000)

                    break

                case 'palavra-chave':

                    await interaction.reply({ content: `${lang.msg59}` })
                    const word = options.getString('palavra')

                    const mod2 = await guild.autoModerationRules.create({
                        name: `${lang.msg66} ${word} ${lang.msg67}`,
                        createId: '1053482665942196224',
                        enabled: true,
                        eventType: 1,
                        triggerType: 1,
                        triggerMetadata:
                        {
                            keywordFilter: [`${word}`]
                        },
                        actions: [
                            {
                                type: 1,
                                metadata: {
                                    channel: interaction.channel,
                                    durationSeconds: 10,
                                    customMessage: `${lang.msg61}`
                                }
                            }
                        ]
                    }).catch(async err => {
                        setTimeout(async () => {

                            return await interaction.editReply({ content: `${lang.msg62}`, ephemeral: true })
                        }, 2000)
                    })

                    setTimeout(async () => {
                        if (!mod2) return

                        const embed = new discord.EmbedBuilder()
                            .setColor("#6dfef2")
                            .setTimestamp()
                            .setAuthor({ name: `${lang.msg63}` })
                            .addFields({ name: `${lang.msg64}`, value: `${lang.msg68}` })
                            .setThumbnail("https://raw.githubusercontent.com/arrastaorj/flags/main/automod.png")

                        await interaction.editReply({ content: ``, embeds: [embed] })
                    }, 3000)

                    break

                case 'spam-mensagens':

                    await interaction.reply({ content: `${lang.msg59}` })


                    const mod3 = await guild.autoModerationRules.create({
                        name: `${lang.msg69}`,
                        createId: '1053482665942196224',
                        enabled: true,
                        eventType: 1,
                        triggerType: 3,
                        triggerMetadata:
                        {
                            //mentionTotalLimit: number
                        },
                        actions: [
                            {
                                type: 1,
                                metadata: {
                                    channel: interaction.channel,
                                    durationSeconds: 10,
                                    customMessage: `${lang.msg61}`
                                }
                            }
                        ]
                    }).catch(async err => {
                        setTimeout(async () => {

                            return await interaction.editReply({ content: `${lang.msg62}`, ephemeral: true })
                        }, 2000)
                    })

                    setTimeout(async () => {
                        if (!mod3) return

                        const embed = new discord.EmbedBuilder()
                            .setColor("#6dfef2")
                            .setTimestamp()
                            .setAuthor({ name: `${lang.msg63}` })
                            .addFields({ name: `${lang.msg64}`, value: `${lang.msg70}` })
                            .setThumbnail("https://raw.githubusercontent.com/arrastaorj/flags/main/automod.png")


                        await interaction.editReply({ content: ``, embeds: [embed] })
                    }, 3000)

                    break

                case 'menção-spam':

                    await interaction.reply({ content: `${lang.msg59}` })

                    const number = options.getNumber('número')

                    const mod4 = await guild.autoModerationRules.create({
                        name: `${lang.msg71}`,
                        createId: '1053482665942196224',
                        enabled: true,
                        eventType: 1,
                        triggerType: 5,
                        triggerMetadata:
                        {
                            mentionTotalLimit: number
                        },
                        actions: [
                            {
                                type: 1,
                                metadata: {
                                    channel: interaction.channel,
                                    durationSeconds: 10,
                                    customMessage: `${lang.msg61}`
                                }
                            }
                        ]
                    }).catch(async err => {
                        setTimeout(async () => {

                            return await interaction.editReply({ content: `${lang.msg62}`, ephemeral: true })
                        }, 2000)
                    })

                    setTimeout(async () => {
                        if (!mod4) return

                        const embed = new discord.EmbedBuilder()
                            .setColor("#6dfef2")
                            .setTimestamp()
                            .setAuthor({ name: `${lang.msg63}` })
                            .addFields({ name: `${lang.msg64}`, value: `${lang.msg72}` })
                            .setThumbnail("https://raw.githubusercontent.com/arrastaorj/flags/main/automod.png")

                        await interaction.editReply({ content: ``, embeds: [embed] })
                    }, 3000)



            }


        } else {

            return interaction.reply({ content: `${lang.alertPermissãoBot}`, ephemeral: true })
        }



    }
}