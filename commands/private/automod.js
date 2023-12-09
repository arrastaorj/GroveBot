const discord = require("discord.js")

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

        const { guild, options } = interaction
        const sub = options.getSubcommand()

        if (!interaction.member.permissions.has(discord.PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: `> \`-\` <a:alerta:1163274838111162499> Você não tem permissão para configurar o automod neste servidor`, ephemeral: true })


        const botMember = interaction.member.guild.members.cache.get(client.user.id)
        const hasPermission = botMember.permissions.has("Administrator")

        if (hasPermission) {

            switch (sub) {
                case "ofencivas":

                    await interaction.reply({ content: `Carregando sua regra de automod...` })

                    const mod1 = await guild.autoModerationRules.create({
                        name: `Bloqueie palavrões, conteúdo sexual e calúnias por meio da Lexa.`,
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
                                    customMessage: 'Esta mensagem foi evitada pela GroveAutoMod!'
                                }
                            }
                        ]
                    }).catch(async err => {
                        setTimeout(async () => {
                            return await interaction.editReply({ content: `> \`-\` <a:alerta:1163274838111162499> Você atingiu o número máximo de regras do AutoMod!`, ephemeral: true })
                        }, 2000)
                    })

                    setTimeout(async () => {
                        if (!mod1) return

                        const embed = new discord.EmbedBuilder()
                            .setColor("#6dfef2")
                            .setTimestamp()
                            .setAuthor({ name: `Ferramenta do AutoMod` })
                            .addFields({ name: `• Regra do AutoMod`, value: `> Palavras ofencivas adicionada` })
                            .setThumbnail("https://raw.githubusercontent.com/arrastaorj/flags/main/automod.png")

                        await interaction.editReply({ content: ``, embeds: [embed] })
                    }, 3000)

                    break

                case 'palavra-chave':

                    await interaction.reply({ content: `Carregando sua regra de automod...` })
                    const word = options.getString('palavra')

                    const mod2 = await guild.autoModerationRules.create({
                        name: `Evite a palavra ${word} de ser usado pela Lexa`,
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
                                    customMessage: 'Esta mensagem foi evitada pela GroveAutoMod'
                                }
                            }
                        ]
                    }).catch(async err => {
                        setTimeout(async () => {

                            return await interaction.editReply({ content: `> \`-\` <a:alerta:1163274838111162499> Você atingiu o número máximo de regras do AutoMod!`, ephemeral: true })
                        }, 2000)
                    })

                    setTimeout(async () => {
                        if (!mod2) return

                        const embed = new discord.EmbedBuilder()
                            .setColor("#6dfef2")
                            .setTimestamp()
                            .setAuthor({ name: `Ferramenta do AutoMod` })
                            .addFields({ name: `• Regra do AutoMod`, value: `> palavra-chave adicionada` })
                            .setThumbnail("https://raw.githubusercontent.com/arrastaorj/flags/main/automod.png")

                        await interaction.editReply({ content: ``, embeds: [embed] })
                    }, 3000)

                    break

                case 'spam-mensagens':

                    await interaction.reply({ content: `Carregando sua regra de automod...` })


                    const mod3 = await guild.autoModerationRules.create({
                        name: `Evite mensagens de spam por meio da Lexa`,
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
                                    customMessage: 'Esta mensagem foi evitada pela GroveAutoMod'
                                }
                            }
                        ]
                    }).catch(async err => {
                        setTimeout(async () => {

                            return await interaction.editReply({ content: `> \`-\` <a:alerta:1163274838111162499> Você atingiu o número máximo de regras do AutoMod!`, ephemeral: true })
                        }, 2000)
                    })

                    setTimeout(async () => {
                        if (!mod3) return

                        const embed = new discord.EmbedBuilder()
                            .setColor("#6dfef2")
                            .setTimestamp()
                            .setAuthor({ name: `Ferramenta do AutoMod` })
                            .addFields({ name: `• Regra do AutoMod`, value: `> spam-mensagens adicionada` })
                            .setThumbnail("https://raw.githubusercontent.com/arrastaorj/flags/main/automod.png")


                        await interaction.editReply({ content: ``, embeds: [embed] })
                    }, 3000)

                    break

                case 'menção-spam':

                    await interaction.reply({ content: `Carregando sua regra de automod...` })

                    const number = options.getNumber('número')

                    const mod4 = await guild.autoModerationRules.create({
                        name: `Evite menções de spam por meio da Lexa`,
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
                                    customMessage: 'Esta mensagem foi evitada pela GroveAutoMod'
                                }
                            }
                        ]
                    }).catch(async err => {
                        setTimeout(async () => {

                            return await interaction.editReply({ content: `> \`-\` <a:alerta:1163274838111162499> Você atingiu o número máximo de regras do AutoMod!`, ephemeral: true })
                        }, 2000)
                    })

                    setTimeout(async () => {
                        if (!mod4) return

                        const embed = new discord.EmbedBuilder()
                            .setColor("#6dfef2")
                            .setTimestamp()
                            .setAuthor({ name: `Ferramenta do AutoMod` })
                            .addFields({ name: `• Regra do AutoMod`, value: `> menção-spam adicionada` })
                            .setThumbnail("https://raw.githubusercontent.com/arrastaorj/flags/main/automod.png")

                        await interaction.editReply({ content: ``, embeds: [embed] })
                    }, 3000)

                    logCommand(interaction);

            }

    

        } else {

            return interaction.reply({ content: "> \`-\` <a:alerta:1163274838111162499> Não posso concluir o comandos pois ainda não recebir permissão para gerenciar este servidor (Administrador)", ephemeral: true })
        }



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