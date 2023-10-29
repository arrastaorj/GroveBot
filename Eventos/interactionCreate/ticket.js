const client = require('../../index')
const discord = require("discord.js")
const ticket = require("../../database/models/ticket")
const discordTranscripts = require('discord-html-transcripts')

client.on("interactionCreate", async (interaction) => {

    if (interaction.isModalSubmit()) {

        if (interaction.customId === 'modal_ticket') {



            const titulo = interaction.fields.getTextInputValue('titulo')
            const descrição = interaction.fields.getTextInputValue('descrição')

            let fotos = "https://raw.githubusercontent.com/arrastaorj/flags/main/standard.gif"


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

                .setThumbnail(client.user.displayAvatarURL({ format: 'png', size: 1024 }))

            const button = new discord.ButtonBuilder()
                .setCustomId('ticket')
                .setLabel(button_name)
                .setStyle(2)
                .setEmoji('<:crvt:1168027546202407013>')

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


                    const createdChannelID = channel.id;

                    const cmd = await ticket.findOne({
                        guildId: interaction.guild.id
                    })


                    if (!cmd) {
                        const newCmd = {
                            guildId: interaction.guild.id,
                        }
                        if (createdChannelID) {
                            newCmd.createdChannelID = createdChannelID
                        }
                        await ticket.create(newCmd)

                    } else {

                        if (!createdChannelID) {
                            await ticket.findOneAndUpdate({
                                guildId: interaction.guild.id
                            }, { $unset: { "createdChannelID": "" } })
                        } else {
                            await ticket.findOneAndUpdate({
                                guildId: interaction.guild.id
                            }, { $set: { "createdChannelID": createdChannelID } })
                        }

                    }


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
                        .setEmoji('<:crvt:1168024673481662534>')
                        .setStyle(4)
                        .setLabel('Finalizar Atendimento')

                    let call = new discord.ButtonBuilder()
                        .setCustomId('call')
                        .setEmoji('<:crvt:1168024678204461129>')
                        .setStyle(2)
                        .setLabel('Criar Canal de Voz')

                    let add = new discord.ButtonBuilder()
                        .setCustomId("AdicionarMembro")
                        .setEmoji('<:crvt:1168024675599790100>')
                        .setLabel('Adicionar Membro')
                        .setStyle(2)
                    let remover = new discord.ButtonBuilder()
                        .setCustomId("RemoverMembro")
                        .setEmoji('<:crvt:1168024676879040613>')
                        .setLabel('Remover Membro')
                        .setStyle(2)
                    let notificar = new discord.ButtonBuilder()
                        .setCustomId("poke")
                        .setEmoji('<:crvt:1168024680683282495>')
                        .setLabel('Notificação')
                        .setStyle(2)
                    let sair = new discord.ButtonBuilder()
                        .setCustomId("SairdoTicket")
                        .setEmoji('<:voltar:1167104944420175984>')
                        .setLabel('Sair do Canal')
                        .setStyle(1)

                    const deletar = new discord.ActionRowBuilder().addComponents(add, remover, fechar)
                    const deletar2 = new discord.ActionRowBuilder().addComponents(sair, notificar, call)


                    channel.send({ embeds: [criado], components: [deletar2, deletar] }).then(m => { m.pin() })

                })
            }

        }


        if (interaction.customId === 'call') {


            if (!interaction.isButton()) return;

            if (!interaction.member.permissions.has(discord.PermissionFlagsBits.ManageChannels)) return interaction.reply({ content: "> \`-\` <a:alerta:1163274838111162499> Não posso concluir este comando pois você não possui permissão.", ephemeral: true })

            let possuido = interaction.guild.channels.cache.find(a => a.name === `voice-`);

            const embed = new discord.EmbedBuilder()
                .setDescription(`<:erradov3:1152052476401422408> ${interaction.user}, você já possui um **CHAT DE VOZ** criado com protocolo.`)
                .setColor("#2b2d31");

            if (possuido) return interaction.reply({ embeds: [embed], ephemeral: true, fetchReply: true });

            interaction.deferUpdate();

            interaction.guild.channels.create({
                name: `voice-`,
                type: discord.ChannelType.GuildVoice,
                parent: interaction.channel.parentId,
                permissionOverwrites: [
                    {
                        id: interaction.guild.roles.everyone,
                        deny: [discord.PermissionsBitField.Flags.ViewChannel],
                    },
                    {
                        id: interaction.user.id,
                        allow: [discord.PermissionsBitField.Flags.ViewChannel],
                    },
                ],
            }).then(async channel => {

                const createdVoicelID = channel.id;

                const cmd = await ticket.findOne({
                    guildId: interaction.guild.id
                })


                if (!cmd) {
                    const newCmd = {
                        guildId: interaction.guild.id,
                    }
                    if (createdVoicelID) {
                        newCmd.createdVoicelID = createdVoicelID
                    }
                    await ticket.create(newCmd)

                } else {

                    if (!createdVoicelID) {
                        await ticket.findOneAndUpdate({
                            guildId: interaction.guild.id
                        }, { $unset: { "createdVoicelID": "" } })
                    } else {
                        await ticket.findOneAndUpdate({
                            guildId: interaction.guild.id
                        }, { $set: { "createdVoicelID": createdVoicelID } })
                    }

                }

                const saira = new discord.EmbedBuilder()
                    .setDescription(`**CALL** iniciado por **${interaction.user}**. \n\n Segue abaixo diversas **FUNÇÕES** com interação apenas com o **CHAT DE VOZ**.`)
                    .setFooter({ iconURL: `${interaction.user.displayAvatarURL()}`, text: `**Caso a chamada fique inativa por 2 minutos será excluída.**` })
                    .setColor("#2b2d31");

                const row = new discord.ActionRowBuilder()
                    .addComponents(
                        new discord.ButtonBuilder()
                            .setCustomId("EncerrarChamado")
                            .setEmoji('1001951864620859462')
                            .setLabel('Encerrar Chamado')
                            .setStyle(1),
                    )

                interaction.channel.send({ embeds: [saira], components: [row], ephemeral: true }).then(edit => {
                    const sair = new discord.EmbedBuilder()
                        .setDescription(`❕ **CALL** - O suporte por **CALL** foi finalizado por **INATIVIDADE**`)
                        .setColor("#2b2d31");

                    setTimeout(() => {
                        if (channel.members.size <= 0) {
                            channel.delete().catch(e => null);
                            edit.edit({ embeds: [sair], ephemeral: true, components: [] }).catch(e => null);
                        }
                    }, 120000);
                });

            })
        }


        if (interaction.customId === 'EncerrarChamado') {

            if (!interaction.isButton()) return;

            if (!interaction.member.permissions.has(discord.PermissionFlagsBits.ManageChannels)) return interaction.reply({ content: "> \`-\` <a:alerta:1163274838111162499> Não posso concluir este comando pois você não possui permissão.", ephemeral: true })

            const cmd = await ticket.findOne({
                guildId: interaction.guild.id
            })

            const voiceId = cmd.createdVoicelID

            const fetchedVoice = interaction.guild.channels.cache.get(voiceId);

            fetchedVoice.delete().catch(e => null)

            const sair = new discord.EmbedBuilder()

                .setDescription(`❕ **CALL** - O suporte por **CALL** foi finalizado pelo **STAFF** ${interaction.user.username}`)
                .setColor("#2b2d31")
            interaction.message.edit({ embeds: [sair], components: [] })

        }


        if (interaction.customId === 'AdicionarMembro') {


            if (!interaction.isButton()) return;

            if (!interaction.member.permissions.has(discord.PermissionFlagsBits.ManageChannels)) return interaction.reply({ content: "> \`-\` <a:alerta:1163274838111162499> Não posso concluir este comando pois você não possui permissão.", ephemeral: true })

            const modal = new discord.ModalBuilder()
                .setCustomId('addmembro')
                .setTitle(`Adicionar Membro`)

            const favoriteColorInput = new discord.TextInputBuilder()
                .setCustomId('idUser')
                .setLabel("Qual ID do membro a ser adicionado?")
                .setStyle(discord.TextInputStyle.Short)

            const firstActionRow = new discord.ActionRowBuilder().addComponents(favoriteColorInput)

            modal.addComponents(firstActionRow)

            await interaction.showModal(modal)
        }

        if (interaction.customId === 'RemoverMembro') {


            if (!interaction.isButton()) return;

            if (!interaction.member.permissions.has(discord.PermissionFlagsBits.ManageChannels)) return interaction.reply({ content: "> \`-\` <a:alerta:1163274838111162499> Não posso concluir este comando pois você não possui permissão.", ephemeral: true })

            const modal = new discord.ModalBuilder()
                .setCustomId('removermembrotexto')
                .setTitle(`${interaction.guild.name}`);


            const favoriteColorInput = new discord.TextInputBuilder()
                .setCustomId('idMember')
                .setLabel("Qual ID do membro a ser removido?")
                .setStyle(discord.TextInputStyle.Short);

            const firstActionRow = new discord.ActionRowBuilder().addComponents(favoriteColorInput);

            modal.addComponents(firstActionRow);

            await interaction.showModal(modal);

        }


        if (interaction.customId === 'poke') {
            const cmd = await ticket.findOne({
                guildId: interaction.guild.id
            });

            const channelId = cmd.createdChannelID;

            const fetchedChannel = interaction.guild.channels.cache.get(channelId)




            const roleId = cmd.cargo;

            const role = interaction.guild.roles.cache.get(roleId);

            if (role) {
                const membersWithRole = role.members;

                if (membersWithRole.size === 0) {
                    interaction.reply("❌ | Nenhum membro com o cargo encontrado.");
                    return;
                }

                const row = new discord.ActionRowBuilder().addComponents(
                    new discord.ButtonBuilder()
                        .setLabel('Visualizar o Ticket')
                        .setEmoji("<:crvt:1168028479833505842>")
                        .setURL(fetchedChannel.url) // Use channelId diretamente, não .url
                        .setStyle(5)
                );

                const embed = new discord.EmbedBuilder()
                    .setColor("#3498db") // Cor azul profissional
                    .setTitle("<a:alerta:1163274838111162499> Você foi mencionado em um Ticket!")
                    .setDescription(`Olá membros com o cargo ${role.name},\n\nAlguém mencionou vocês em um ticket aberto e aguarda uma resposta.\n\nPor favor, verifique o ticket e forneça sua colaboração.`)
                    .setFooter({
                        iconURL: interaction.user.displayAvatarURL(),
                        text: `Agradecemos sua colaboração em ${interaction.guild.name}!`
                    });


                membersWithRole.forEach(async member => {
                    try {
                        await member.send({ embeds: [embed], components: [row] })
                    } catch (error) {
                        console.error(`Erro ao enviar mensagem para ${member.user.tag}: ${error.message}`);
                    }
                })

                interaction.reply({ content: `✅ | Notificação enviada para membros com o cargo ${role.name}.`, components: [] }).then(msg => {
                    setTimeout(async () => {
                        try {
                            await msg.delete();
                        } catch (error) {
                            console.error(`Erro ao excluir a mensagem de resposta: ${error.message}`);
                        }
                    }, 3000);
                });
            } else {
                // Lida com o caso em que o cargo não foi encontrado.
                interaction.reply("❌ | Cargo não encontrado.");
            }
        }


        if (interaction.customId === 'addmembro') {


            if (!interaction.isButton()) return;

            if (!interaction.member.permissions.has(discord.PermissionFlagsBits.ManageChannels)) return interaction.reply({ content: "> \`-\` <a:alerta:1163274838111162499> Não posso concluir este comando pois você não possui permissão.", ephemeral: true })

            const cmd = await ticket.findOne({
                guildId: interaction.guild.id
            })


            const channelId = cmd.createdChannelID


            const fetchedChannel = interaction.guild.channels.cache.get(channelId)


            const user = interaction.fields.getTextInputValue('idUser')

            fetchedChannel.permissionOverwrites.edit(user, { ViewChannel: true })

            interaction.deferUpdate()

        }

        if (interaction.customId === 'removermembrotexto') {


            if (!interaction.isButton()) return;

            if (!interaction.member.permissions.has(discord.PermissionFlagsBits.ManageChannels)) return interaction.reply({ content: "> \`-\` <a:alerta:1163274838111162499> Não posso concluir este comando pois você não possui permissão.", ephemeral: true })

            const cmd = await ticket.findOne({
                guildId: interaction.guild.id
            })

            const channelId = cmd.createdChannelID

            const fetchedChannel = interaction.guild.channels.cache.get(channelId)

            const newnamea = interaction.fields.getTextInputValue('idMember');

            fetchedChannel.permissionOverwrites.edit(newnamea, { ViewChannel: false })
            interaction.deferUpdate()
        }


        if (interaction.customId === 'SairdoTicket') {


            interaction.channel.permissionOverwrites.edit(interaction.user.id, { ViewChannel: false })

            interaction.reply({ content: `${interaction.user} Saiu do Atendimento!`, ephemeral: false })

        }

        if (interaction.customId === 'close') {


            if (!interaction.isButton()) return;

            if (!interaction.member.permissions.has(discord.PermissionFlagsBits.ManageChannels)) return interaction.reply({ content: "> \`-\` <a:alerta:1163274838111162499> Não posso concluir este comando pois você não possui permissão.", ephemeral: true })

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


            if (!interaction.isButton()) return;

            if (!interaction.member.permissions.has(discord.PermissionFlagsBits.ManageChannels)) return interaction.reply({ content: "> \`-\` <a:alerta:1163274838111162499> Não posso concluir este comando pois você não possui permissão.", ephemeral: true })

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


            if (!interaction.isButton()) return;

            if (!interaction.member.permissions.has(discord.PermissionFlagsBits.ManageChannels)) return interaction.reply({ content: "> \`-\` <a:alerta:1163274838111162499> Não posso concluir este comando pois você não possui permissão.", ephemeral: true })

            interaction.message.delete()

        }

        if (interaction.customId === 'deletar') {


            if (!interaction.isButton()) return;

            if (!interaction.member.permissions.has(discord.PermissionFlagsBits.ManageChannels)) return interaction.reply({ content: "> \`-\` <a:alerta:1163274838111162499> Não posso concluir este comando pois você não possui permissão.", ephemeral: true })

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