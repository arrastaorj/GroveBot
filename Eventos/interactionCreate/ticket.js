const client = require('../../index')
const discord = require("discord.js")
const ticket = require("../../database/models/ticket")
const discordTranscripts = require('discord-html-transcripts')

client.on("interactionCreate", async (interaction) => {

    if (interaction.isModalSubmit()) {

        if (interaction.customId === 'modal_ticket') {

            let foto = "https://i.imgur.com/S2fgecY.png"

            const titulo = interaction.fields.getTextInputValue('titulo')
            const descrição = interaction.fields.getTextInputValue('descrição')

            let fotos = "https://i.imgur.com/cEnNOBt.png"


            const titulo02 = interaction.fields.getTextInputValue('titulo02')
            const descrição02 = interaction.fields.getTextInputValue('descrição02')


            const cmd = await ticket.findOne({
                guildId: interaction.guild.id
            })


            if (!cmd) {
                const newCmd = {
                    guildId: interaction.guild.id,
                }
                if (titulo02) {
                    newCmd.titulo02 = titulo02
                }
                if (descrição02) {
                    newCmd.descrição02 = descrição02
                }
                await ticket.create(newCmd)

            } else {

                if (!titulo02) {
                    await ticket.findOneAndUpdate({
                        guildId: interaction.guild.id
                    }, { $unset: { "titulo02": "" } })
                } else {
                    await ticket.findOneAndUpdate({
                        guildId: interaction.guild.id
                    }, { $set: { "titulo02": titulo02 } })
                }
                if (!descrição02) {
                    await ticket.findOneAndUpdate({
                        guildId: interaction.guild.id
                    }, { $unset: { "descrição02": "" } })
                } else {
                    await ticket.findOneAndUpdate({
                        guildId: interaction.guild.id
                    }, { $set: { "descrição02": descrição02 } })
                }

            }

            const cmd2 = await ticket.findOne({
                guildId: interaction.guild.id
            })

            let button_name = cmd2.nomeBotao


            const embed = new discord.EmbedBuilder()
                .setColor('#2f3136')
                .setAuthor({ name: `${titulo}` })
                .setDescription(descrição)
                .setImage(`${fotos}`)
                .setThumbnail(`${foto}`)
            // setImage(`${fotos}`)
            //.setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })




            const button = new discord.ButtonBuilder()
                .setCustomId('ticket')
                .setLabel(button_name)
                .setStyle(2)
                .setEmoji('📨')

            const row = new discord.ActionRowBuilder().setComponents(button)


            let channel = cmd2.canal1


            let canal = interaction.guild.channels.cache.get(channel)

            canal.send({ embeds: [embed], components: [row] })

            await interaction.deferUpdate()
        }
    }

    if (interaction.isButton) {

        const cmd3 = await ticket.findOne({
            guildId: interaction.guild.id
        })



        if (interaction.customId === 'ticket') {

            if (interaction.guild.channels.cache.find((c) => c.topic === interaction.user.id)) {
                interaction.reply({ content: `**Calma, Você já tem um ticket criado -> ${interaction.guild.channels.cache.find(c => c.topic === interaction.user.id)}.**`, ephemeral: true })

            } else {


                let categoria = cmd3.categoria



                interaction.guild.channels.create({
                    name: `ticket-${interaction.user.username}`,
                    type: discord.ChannelType.GuildText,
                    topic: `${interaction.user.id}`,
                    parent: categoria,
                    permissionOverwrites: [
                        {
                            id: cmd3.cargo,
                            allow: [discord.PermissionFlagsBits.ViewChannel, discord.PermissionFlagsBits.SendMessages, discord.PermissionFlagsBits.AttachFiles, discord.PermissionFlagsBits.EmbedLinks, discord.PermissionFlagsBits.AddReactions]
                        },
                        {
                            id: interaction.guild.id,
                            deny: [discord.PermissionFlagsBits.ViewChannel]
                        },
                        {
                            id: interaction.user.id,
                            allow: [discord.PermissionFlagsBits.ViewChannel, discord.PermissionFlagsBits.SendMessages, discord.PermissionFlagsBits.AttachFiles, discord.PermissionFlagsBits.EmbedLinks, discord.PermissionFlagsBits.AddReactions]
                        }

                    ]

                }).then(async (channel) => {

                    let titulo = cmd3.titulo02

                    let descrição = cmd3.descrição02

                    let iniciado = new discord.EmbedBuilder()
                        .setColor('#2f3136')
                        //.setAuthor({ name: `Suporte - ${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                        .setDescription(`Olá ${interaction.user}, Seu ticket foi criado com sucesso.`)
                    //.setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })

                    let atalho = new discord.ButtonBuilder()
                        .setLabel('Atalho')
                        .setURL(channel.url)
                        .setStyle(discord.ButtonStyle.Link)

                    const butão = new discord.ActionRowBuilder().addComponents(atalho)

                    interaction.reply({ embeds: [iniciado], components: [butão], ephemeral: true })

                    let criado = new discord.EmbedBuilder()
                        .setColor('#2f3136')
                        .setAuthor({ name: titulo, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                        .setDescription(descrição)
                    //.setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })

                    let fechar = new discord.ButtonBuilder()
                        .setCustomId('close')
                        .setStyle(2)
                        .setLabel('Fechar')

                    const deletar = new discord.ActionRowBuilder().addComponents(fechar)

                    channel.send({ embeds: [criado], components: [deletar] }).then(m => { m.pin() })

                })
            }

        }

        if (interaction.customId === 'close') {

            let ticket = interaction.channel.topic

            interaction.channel.edit({

                permissionOverwrites: [
                    {
                        id: cmd3.cargo,
                        allow: [discord.PermissionFlagsBits.ViewChannel, discord.PermissionFlagsBits.SendMessages, discord.PermissionFlagsBits.AttachFiles, discord.PermissionFlagsBits.EmbedLinks, discord.PermissionFlagsBits.AddReactions],
                    },
                    {
                        id: ticket,
                        deny: [discord.PermissionFlagsBits.ViewChannel],
                    },
                    {
                        id: interaction.guild.id,
                        deny: [discord.PermissionFlagsBits.ViewChannel],
                    }

                ],

            })

            let embed = new discord.EmbedBuilder()
                .setColor('#2f3136')
                .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .setDescription(`O Membro ${interaction.user}\`(${interaction.user.id})\` Fechou o ticket, Escolha uma opção abaixo. `)

            let botoes = new discord.ActionRowBuilder().addComponents([

                new discord.ButtonBuilder()
                    .setStyle(discord.ButtonStyle.Success)
                    .setLabel('Reabrir')
                    .setCustomId('reabrir'),
                new discord.ButtonBuilder()
                    .setStyle(discord.ButtonStyle.Danger)
                    .setLabel('Deletar')
                    .setCustomId('deletar')])


            interaction.reply({ embeds: [embed], components: [botoes] })

        }

        if (interaction.customId === 'reabrir') {

            interaction.message.delete()

            let ticket = interaction.channel.topic

            interaction.channel.edit({

                permissionOverwrites: [
                    {
                        id: cmd3.cargo,
                        allow: [discord.PermissionFlagsBits.ViewChannel, discord.PermissionFlagsBits.SendMessages, discord.PermissionFlagsBits.AttachFiles, discord.PermissionFlagsBits.EmbedLinks, discord.PermissionFlagsBits.AddReactions],
                    },
                    {
                        id: ticket,
                        allow: [discord.PermissionFlagsBits.ViewChannel, discord.PermissionFlagsBits.SendMessages, discord.PermissionFlagsBits.AttachFiles, discord.PermissionFlagsBits.EmbedLinks, discord.PermissionFlagsBits.AddReactions],
                    },
                    {
                        id: interaction.guild.id,
                        deny: [discord.PermissionFlagsBits.ViewChannel],
                    }

                ],

            })

            let embed = new discord.EmbedBuilder()
                .setColor('#2f3136')
                .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .setDescription(`Olá <@${ticket}>, O Membro ${interaction.user} Reabriu seu ticket.`)

            let button = new discord.ButtonBuilder()
                .setLabel('Apagar Mensagem')
                .setStyle(2)
                .setCustomId('msg')

            const row = new discord.ActionRowBuilder().addComponents(button)

            interaction.channel.send({ content: `<@${ticket}>`, embeds: [embed], components: [row] })

        }

        if (interaction.customId === 'msg') {

            interaction.message.delete()

        }

        if (interaction.customId === 'deletar') {

            const topic = interaction.channel.topic

            const channel = interaction.channel

            const attachment = await discordTranscripts.createTranscript(channel)

            interaction.channel.delete()

            let embed = new discord.EmbedBuilder()
                .setDescription(`Ticket de <@${topic}>\`(${topic})\` \n Deletado por ${interaction.user}\`(${interaction.user.id})\``)
                .setTimestamp()

            let chat_log = cmd3.canalLog

            let canal = interaction.guild.channels.cache.get(chat_log)

            canal.send({ embeds: [embed], files: [attachment] })

        }
    }

})