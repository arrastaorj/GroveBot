const client = require('../../index')
const discord = require("discord.js")
const ticket = require("../../database/models/ticket")
const Atendente = require("../../database/models/ticketAtendimentos")
const discordTranscripts = require('discord-html-transcripts')
const idioma = require("../../database/models/language")


client.on("interactionCreate", async (interaction) => {

    let lang = await idioma.findOne({
        guildId: interaction.guild.id
    })
    lang = lang ? require(`../../languages/${lang.language}.js`) : require('../../languages/pt.js')


    if (interaction.isModalSubmit()) {


        if (interaction.customId === 'modal_ticket') {



            const titulo = interaction.fields.getTextInputValue('titulo')
            const descrição = interaction.fields.getTextInputValue('descrição')

            let fotos = "https://raw.githubusercontent.com/arrastaorj/flags/main/standard.gif"


            const titulo02 = interaction.fields.getTextInputValue('titulo02')
            const descrição02 = interaction.fields.getTextInputValue('descrição02')

            try {


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
                    .setAuthor({ name: `${titulo}`, iconURL: interaction.guild.iconURL({ extension: 'png' }) })
                    .setDescription(descrição)
                    // .setImage(`${fotos}`)

                    .setThumbnail(interaction.guild.iconURL({ extension: 'png', dynamic: true }))

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

            } catch (error) {

                return interaction.reply({ content: `${lang.alertErroInesperado}`, ephemeral: true })
            }

        }
    }


    if (interaction.isButton) {


        try {

            const cmd3 = await ticket.findOne({
                guildId: interaction.guild.id
            })


            if (interaction.customId === 'ticket') {

                if (interaction.guild.channels.cache.find((c) => c.topic === interaction.user.id)) {
                    interaction.reply({ content: `**${lang.msg305} ${interaction.guild.channels.cache.find(c => c.topic === interaction.user.id)}.**`, ephemeral: true })

                } else {


                    let categoria = cmd3.categoria


                    const cmd = await ticket.findOne({
                        guildId: interaction.guild.id
                    })


                    if (!cmd) {
                        const newCmd = {
                            guildId: interaction.guild.id,
                        }
                        if (interaction.user.username) {
                            newCmd.userId = interaction.user.username
                        }
                        await ticket.create(newCmd)

                    } else {

                        if (!interaction.user.username) {
                            await ticket.findOneAndUpdate({
                                guildId: interaction.guild.id
                            }, { $unset: { "userId": "" } })
                        } else {
                            await ticket.findOneAndUpdate({
                                guildId: interaction.guild.id
                            }, { $set: { "userId": interaction.user.username } })
                        }

                    }


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
                            .setAuthor({ name: `Suporte - ${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ extension: 'png' }) })
                            .setDescription(`Olá ${interaction.user}, ${lang.msg306}`)
                            .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({ extension: 'png' }) })

                        let atalho = new discord.ButtonBuilder()
                            .setLabel(`${lang.msg307}`)
                            .setURL(channel.url)
                            .setStyle(discord.ButtonStyle.Link)

                        const butão = new discord.ActionRowBuilder().addComponents(atalho)

                        interaction.reply({ embeds: [iniciado], components: [butão], ephemeral: true })

                        let criado = new discord.EmbedBuilder()
                            .setColor('#2f3136')
                            .setAuthor({ name: titulo, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                            .setDescription(descrição)
                            .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({ extension: 'png' }) })

                        let fechar = new discord.ButtonBuilder()
                            .setCustomId('close')
                            .setEmoji('<:crvt:1168024673481662534>')
                            .setStyle(4)
                            .setLabel(`${lang.msg308}`)

                        let call = new discord.ButtonBuilder()
                            .setCustomId('call')
                            .setEmoji('<:crvt:1168024678204461129>')
                            .setStyle(2)
                            .setLabel(`${lang.msg309}`)

                        let add = new discord.ButtonBuilder()
                            .setCustomId("AdicionarMembro")
                            .setEmoji('<:crvt:1168024675599790100>')
                            .setLabel(`${lang.msg310}`)
                            .setStyle(2)
                        let remover = new discord.ButtonBuilder()
                            .setCustomId("RemoverMembro")
                            .setEmoji('<:crvt:1168024676879040613>')
                            .setLabel(`${lang.msg311}`)
                            .setStyle(2)
                        let notificar = new discord.ButtonBuilder()
                            .setCustomId("poke")
                            .setEmoji('<:crvt:1168024680683282495>')
                            .setLabel(`${lang.msg312}`)
                            .setStyle(2)
                        let sair = new discord.ButtonBuilder()
                            .setCustomId("SairdoTicket")
                            .setEmoji('<:voltar:1167104944420175984>')
                            .setLabel(`${lang.msg313}`)
                            .setStyle(1)

                        let assumir = new discord.ButtonBuilder()  // Novo botão para assumir o ticket
                            .setCustomId("assumirTicket")
                            .setEmoji('🤝')
                            .setLabel("Assumir Atendimento")
                            .setStyle(3);


                        const deletar = new discord.ActionRowBuilder().addComponents(add, remover, fechar)
                        const deletar2 = new discord.ActionRowBuilder().addComponents(sair, notificar, assumir, call)
                        channel.send({ embeds: [criado], components: [deletar2, deletar] }).then(m => { m.pin() })

                    })
                }

            }

            if (interaction.customId === 'assumirTicket') {

                // Verifique se o usuário tem permissão para gerenciar canais
                if (!interaction.member.permissions.has(discord.PermissionFlagsBits.ManageChannels)) {
                    return interaction.reply({
                        content: `${lang.alertNaoTemPermissão}`,
                        ephemeral: true
                    });
                }

                const channel = interaction.channel;
                const atendente = interaction.user;
                const guildId = interaction.guild.id;


                // Verifique se o ticket já foi assumido
                const cmd = await ticket.findOne({
                    guildId: interaction.guild.id,
                    createdChannelID: channel.id
                });

                if (cmd && cmd.atendenteId) {
                    return interaction.reply({
                        content: `Este ticket já foi assumido por <@${cmd.atendenteId}>.`,
                        ephemeral: true
                    });
                }

                await interaction.deferReply({ ephemeral: false });


                // Notifique o canal sobre quem assumiu o ticket
                let embed = new discord.EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription(`Este ticket foi assumido por ${atendente}.`);

                // Responder à interação
                await interaction.editReply({
                    embeds: [embed],
                    components: [],
                });



                // Atualize o atendente no banco de dados para o ticket
                await ticket.findOneAndUpdate({
                    guildId: interaction.guild.id,
                    createdChannelID: channel.id
                }, { $set: { atendenteId: atendente.id } });


                // Atualize as permissões para o atendente
                await channel.permissionOverwrites.edit(atendente, {
                    ViewChannel: true,
                    SendMessages: true,
                    AttachFiles: true,
                    EmbedLinks: true,
                    AddReactions: true
                });

                // Verificar se o usuário já existe no banco de dados de atendentes para este servidor
                let atendenteData = await Atendente.findOne({ guildId: guildId, userId: atendente.id });


                if (!atendenteData) {
                    // Se o atendente não existir para este servidor, crie um novo documento
                    atendenteData = new Atendente({
                        userId: atendente.id,
                        guildId: guildId,
                        atendimentosRealizados: 1 // Inicia com 1 atendimento
                    });
                } else {
                    // Se o atendente já existe para este servidor, incrementa a contagem de atendimentos
                    atendenteData.atendimentosRealizados += 1;
                }

                // Salvar as mudanças no banco de dados
                await atendenteData.save();


            }


            if (interaction.customId === 'call') {


                if (!interaction.isButton()) return;

                if (!interaction.member.permissions.has(discord.PermissionFlagsBits.ManageChannels))
                    return interaction.reply({
                        content: `${lang.alertNaoTemPermissão}`,
                        ephemeral: true
                    })

                const cmd = await ticket.findOne({
                    guildId: interaction.guild.id
                })

                const userVoice = cmd.userId


                let possuido = interaction.guild.channels.cache.find(a => a.name === `voice-${userVoice}`)


                const cmd2 = await ticket.findOne({
                    guildId: interaction.guild.id
                })
                const userVoiceId = cmd2.createdVoicelID



                if (possuido)
                    return interaction.reply({
                        content: `> \`-\` <a:alerta:1163274838111162499> ${interaction.user}, ${lang.msg314} <#${userVoiceId}>.`,
                        ephemeral: true,
                        fetchReply: true
                    })

                interaction.deferUpdate()


                interaction.guild.channels.create({
                    name: `voice-${userVoice}`,
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

                    const callIniciadaEmbed = new discord.EmbedBuilder()
                        .setTitle("Chamada Iniciada")
                        .setDescription(`${lang.msg315} ${interaction.user}. ${lang.msg316}`)
                        .setColor("#27ae60")
                        .setFooter({
                            iconURL: interaction.user.displayAvatarURL({ extension: 'png' }),
                            text: `${lang.msg317}`
                        })
                        .setTimestamp();

                    const row = new discord.ActionRowBuilder()
                        .addComponents(
                            new discord.ButtonBuilder()
                                .setCustomId("EncerrarChamado")
                                .setEmoji('1001951864620859462')
                                .setLabel(`${lang.msg318}`)
                                .setStyle(1),
                        )

                    interaction.channel.send({ embeds: [callIniciadaEmbed], components: [row], ephemeral: true }).then(edit => {

                        const inatividadeEmbed = new discord.EmbedBuilder()
                            .setTitle(`${lang.msg319}`)
                            .setDescription(`${lang.msg320}`)
                            .setColor("#e74c3c")
                            .setTimestamp()
                        setTimeout(() => {
                            if (channel.members.size <= 0) {
                                channel.delete().catch(e => null);
                                edit.edit({ embeds: [inatividadeEmbed], ephemeral: true, components: [] }).catch(e => null);
                            }
                        }, 120000);
                    });

                })
            }


            if (interaction.customId === 'EncerrarChamado') {

                if (!interaction.isButton()) return;

                if (!interaction.member.permissions.has(discord.PermissionFlagsBits.ManageChannels))
                    return interaction.reply({
                        content: `${lang.alertNaoTemPermissão}`,
                        ephemeral: true
                    })

                const cmd = await ticket.findOne({
                    guildId: interaction.guild.id
                })

                const voiceId = cmd.createdVoicelID

                const fetchedVoice = interaction.guild.channels.cache.get(voiceId);

                fetchedVoice.delete().catch(e => null)

                const sairEmbed = new discord.EmbedBuilder()
                    .setTitle(`${lang.msg319}`)
                    .setDescription(`${lang.msg321}\n\n**${lang.msg322}** ${interaction.user.username}`)
                    .setColor("#3498db")
                    .setTimestamp()

                interaction.message.edit({ embeds: [sairEmbed], components: [] })

            }


            if (interaction.customId === 'AdicionarMembro') {

                if (!interaction.isButton()) return;

                if (!interaction.member.permissions.has(discord.PermissionFlagsBits.ManageChannels)) return interaction.reply({ content: `${lang.alertNaoTemPermissão}`, ephemeral: true })

                const modal = new discord.ModalBuilder()
                    .setCustomId('addmembro')
                    .setTitle(`${lang.msg323}`)

                const favoriteColorInput = new discord.TextInputBuilder()
                    .setCustomId('idUser')
                    .setLabel(`${lang.msg324}`)
                    .setStyle(discord.TextInputStyle.Short)

                const firstActionRow = new discord.ActionRowBuilder().addComponents(favoriteColorInput)

                modal.addComponents(firstActionRow)

                await interaction.showModal(modal)
            }

            if (interaction.customId === 'RemoverMembro') {


                if (!interaction.isButton()) return;

                if (!interaction.member.permissions.has(discord.PermissionFlagsBits.ManageChannels)) return interaction.reply({ content: `${lang.alertNaoTemPermissão}`, ephemeral: true })

                const modal = new discord.ModalBuilder()
                    .setCustomId('removermembrotexto')
                    .setTitle(`${interaction.guild.name}`);


                const favoriteColorInput = new discord.TextInputBuilder()
                    .setCustomId('idMember')
                    .setLabel(`${lang.msg325}`)
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
                        interaction.reply(`${lang.msg326}`);
                        return;
                    }

                    const row = new discord.ActionRowBuilder().addComponents(
                        new discord.ButtonBuilder()
                            .setLabel(`${lang.msg327}`)
                            .setEmoji("<:crvt:1168028479833505842>")
                            .setURL(fetchedChannel.url)
                            .setStyle(5)
                    );

                    const embed = new discord.EmbedBuilder()
                        .setColor("#3498db") // Cor azul profissional
                        .setTitle(`<a:alerta:1163274838111162499> ${lang.msg328}`)
                        .setDescription(`${lang.msg329} **${role.name}**,\n\n${lang.msg330}\n\n${lang.msg331}`)
                        .setFooter({
                            iconURL: interaction.user.displayAvatarURL({ extension: 'png' }),
                            text: `${lang.msg332} ${interaction.guild.name}!`
                        });


                    membersWithRole.forEach(async member => {
                        try {
                            await member.send({ embeds: [embed], components: [row] })
                        } catch (error) {
                            console.error(`Erro ao enviar mensagem para ${member.user.tag}: ${error.message}`);
                        }
                    })

                    interaction.reply({
                        content: `> \`+\` <a:alerta:1163274838111162499> ${lang.msg333} <@&${role.id}>. \n\n> \`-\` <a:alerta:1163274838111162499> **${lang.msg334}**`,
                        ephemeral: true
                    })

                } else {

                    interaction.reply({ content: `> \`-\` ${lang.msg335}`, ephemeral: true })

                }
            }


            if (interaction.customId === 'addmembro') {

                if (!interaction.member.permissions.has(discord.PermissionFlagsBits.ManageChannels))
                    return interaction.reply({
                        content: `${lang.alertNaoTemPermissão}`,
                        ephemeral: true
                    })


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


                if (!interaction.member.permissions.has(discord.PermissionFlagsBits.ManageChannels)) return interaction.reply({ content: `${lang.alertNaoTemPermissão}`, ephemeral: true })

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

                interaction.reply({ content: `${interaction.user} ${lang.msg336}`, ephemeral: false })

            }

            if (interaction.customId === 'close') {


                if (!interaction.isButton()) return;

                if (!interaction.member.permissions.has(discord.PermissionFlagsBits.ManageChannels)) return interaction.reply({ content: `${lang.alertNaoTemPermissão}`, ephemeral: true })

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
                    .setDescription(`${lang.msg337} ${interaction.user}\`(${interaction.user.id})\` ${lang.msg338}`)

                let botoes = new discord.ActionRowBuilder().addComponents([

                    new discord.ButtonBuilder()
                        .setStyle(discord.ButtonStyle.Success)
                        .setLabel(`${lang.msg339}`)
                        .setCustomId('reabrir'),
                    new discord.ButtonBuilder()
                        .setStyle(discord.ButtonStyle.Danger)
                        .setLabel(`${lang.msg340}`)
                        .setCustomId('deletar')])


                interaction.reply({ embeds: [embed], components: [botoes] })

            }

            if (interaction.customId === 'reabrir') {


                if (!interaction.isButton()) return;

                if (!interaction.member.permissions.has(discord.PermissionFlagsBits.ManageChannels)) return interaction.reply({ content: `${lang.alertNaoTemPermissão}`, ephemeral: true })

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
                    .setDescription(`${lang.msg341} <@${ticket}>, ${lang.msg342} ${interaction.user} ${lang.msg343}`)

                let button = new discord.ButtonBuilder()
                    .setLabel(`${lang.msg344}`)
                    .setStyle(2)
                    .setCustomId('msg')

                const row = new discord.ActionRowBuilder().addComponents(button)

                interaction.channel.send({ content: `<@${ticket}>`, embeds: [embed], components: [row] })

            }

            if (interaction.customId === 'msg') {


                if (!interaction.isButton()) return;

                if (!interaction.member.permissions.has(discord.PermissionFlagsBits.ManageChannels)) return interaction.reply({ content: `${lang.alertNaoTemPermissão}`, ephemeral: true })

                interaction.message.delete()

            }

            if (interaction.customId === 'deletar') {
                if (!interaction.isButton()) return;

                try {
                    // Verifique se o usuário tem permissão para gerenciar canais
                    if (!interaction.member.permissions.has(discord.PermissionFlagsBits.ManageChannels)) {
                        return interaction.reply({
                            content: `${lang.alertNaoTemPermissão}`,
                            ephemeral: true
                        });
                    }

                    const channel = interaction.channel;
                    const topic = channel.topic;
                    const guildId = interaction.guild.id;


                    // Obter o ticket relacionado ao canal atual
                    const cmd = await ticket.findOne({
                        guildId: guildId,
                        createdChannelID: channel.id
                    });

                    // Verifique se o ticket foi assumido por alguém
                    if (!cmd || !cmd.atendenteId) {
                        return interaction.reply({
                            content: 'Este ticket ainda não foi assumido por nenhum atendente.',
                            ephemeral: true
                        });
                    }

                    // Obtenha os dados do atendente
                    const atendenteData = await Atendente.findOne({ guildId: guildId, userId: cmd.atendenteId });

                    if (!atendenteData) {
                        return interaction.reply({
                            content: 'Não foi possível encontrar os dados do atendente.',
                            ephemeral: true
                        });
                    }

                    const attachment = await discordTranscripts.createTranscript(channel);
                    const transcriptTimestamp = Math.round(Date.now() / 1000);

                    // Deletar o canal após o transcript ser criado
                    await interaction.channel.delete();

                    // Crie a embed com as informações do atendente e número de tickets
                    let embed = new discord.EmbedBuilder()
                        .setColor('#5865F2') // Azul do Discord
                        .setTitle('📋 Ticket Encerrado') // Título com emoji
                        .setDescription(`
                        **👤 Ticket de:** <@${topic}> \`(${topic})\`
                        **🛠️ Encerrado por:** ${interaction.user} \`(${interaction.user.id})\`
                        **📅 Data de encerramento:** <t:${transcriptTimestamp}:R> (<t:${transcriptTimestamp}:F>)
                        **👨‍💼 Assumido por:** <@${cmd.atendenteId}> 
                        **🏆 Atendimentos realizados:** ${atendenteData.atendimentosRealizados}
                    `)
                        .setThumbnail(interaction.guild.iconURL({ extension: 'png' })) // Imagem pequena do servidor
                        .setFooter({
                            text: `Ticket ID: ${channel.id}`,
                            iconURL: interaction.user.displayAvatarURL({ extension: 'png' })
                        })
                        .setTimestamp();

                    // Busca o ticket no banco de dados para resetar o atendente
                    await ticket.findOneAndUpdate({
                        guildId: guildId,
                        createdChannelID: channel.id
                    }, {
                        $unset: { atendenteId: "" } // Remove o atendente associado ao ticket
                    });


                    // Enviar a embed para o canal de logs
                    let chat_log = cmd3.canalLog;
                    let canal = interaction.guild.channels.cache.get(chat_log);
                    await canal.send({ embeds: [embed], files: [attachment] });

                } catch (error) {
                    console.error('Erro ao deletar o ticket:', error);
                    await interaction.reply({
                        content: 'Houve um erro ao processar a solicitação de deletar o ticket.',
                        ephemeral: true
                    });
                }
            }



        } catch (error) {

            return interaction.reply({
                content: `${lang.alertNaoTemPermissão}`,
                ephemeral: true
            })
        }

    }

})