const discord = require("discord.js")
const autoroles = require("../../database/models/autorole")
const comandos = require("../../database/models/comandos")
const meme = require("../../database/models/meme")
const bemvindo = require("../../database/models/bemvindo")
const fbv = require("../../database/models/fbv")
const ticket = require("../../database/models/ticket")

module.exports = {
    name: "config",
    description: "Veja meus comandos de configuração.",
    type: discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "autorole",
            type: discord.ApplicationCommandOptionType.Subcommand,
            description: "Configure o multi AutoRoles.",
            options: [
                {
                    name: "cargo",
                    type: discord.ApplicationCommandOptionType.Role,
                    description: "Mencione o cargo ou coloque o ID.",
                    required: true
                },
                {
                    name: "cargo2",
                    type: discord.ApplicationCommandOptionType.Role,
                    description: "Mencione o cargo ou coloque o ID.",
                    required: false
                },
                {
                    name: "cargo3",
                    type: discord.ApplicationCommandOptionType.Role,
                    description: "Mencione o cargo ou coloque o ID.",
                    required: false
                },
                {
                    name: "cargo4",
                    type: discord.ApplicationCommandOptionType.Role,
                    description: "Mencione o cargo ou coloque o ID.",
                    required: false
                },
                {
                    name: "cargo5",
                    type: discord.ApplicationCommandOptionType.Role,
                    description: "Mencione o cargo ou coloque o ID.",
                    required: false
                },
            ],
        },
        {
            name: "bem-vindo",
            type: discord.ApplicationCommandOptionType.Subcommand,
            description: "Definir canal de Bem-Vindo(a).",
            options: [
                {
                    name: "canal",
                    type: discord.ApplicationCommandOptionType.Channel,
                    description: "Mencione o canal de texto ou coloque o ID.",
                    required: true
                }
            ],
        },

        {
            name: 'comandos',
            description: 'Definir canal de comandos.',
            type: discord.ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "canal",
                    type: discord.ApplicationCommandOptionType.Channel,
                    description: "Mencione o canal de texto ou coloque o ID.",
                    required: true

                },
            ],
        },
        {
            name: 'fbv',
            description: 'Definir um wallpeper de fundo do Bem-Vindo(a).',
            type: discord.ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "imagem",
                    type: discord.ApplicationCommandOptionType.Attachment,
                    description: "Anexe uma imagem valida. (PNG/JPEG)",
                    required: true
                },
            ],
        },
        {
            name: 'memes',
            description: 'Definir um canal para o uso do comando /meme.',
            type: discord.ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "canal",
                    type: discord.ApplicationCommandOptionType.Channel,
                    description: "Mencione o canal de texto ou coloque o ID.",
                    required: true
                },
            ],
        },
        {
            name: 'ticket',
            description: 'Configure o menu do ticket.',
            type: discord.ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'canal',
                    description: 'Canal que a mensagem para criar ticket será enviada.',
                    type: discord.ApplicationCommandOptionType.Channel,
                    channelTypes: [discord.ChannelType.GuildText],
                    required: true
                },
                {
                    name: 'canal_log',
                    description: 'Canal que as logs será enviada.',
                    type: discord.ApplicationCommandOptionType.Channel,
                    channelTypes: [discord.ChannelType.GuildText],
                    required: true
                },
                {
                    name: 'categoria',
                    description: 'Selecione uma categoria a qual os tickets serão criados.',
                    type: discord.ApplicationCommandOptionType.Channel,
                    channelTypes: [discord.ChannelType.GuildCategory],
                    required: true
                },
                {
                    name: 'nome_botao',
                    description: 'Qual o nome do botão que abrirar o ticket ?.',
                    type: discord.ApplicationCommandOptionType.String,
                    required: true
                },
                {
                    name: 'cargo',
                    description: 'Cargo que podera ver os tickets.',
                    type: discord.ApplicationCommandOptionType.Role,
                    required: true
                },
            ],
        },

        {
            name: 'help',
            description: 'configure meus comandos.',
            type: discord.ApplicationCommandOptionType.Subcommand,
        },


    ],


    run: async (client, interaction, args) => {

        let subcommands = interaction.options.getSubcommand()

        switch (subcommands) {

            case "autorole": {

                if (!interaction.member.permissions.has(discord.PermissionFlagsBits.ManageChannels)) return interaction.reply({ content: `> \`-\` <a:alerta:1163274838111162499> Não posso concluir este comando pois você não possui permissão.`, ephemeral: true })

                const botMember = interaction.member.guild.members.cache.get(client.user.id)
                const hasPermission = botMember.permissions.has("Administrator")

                if (hasPermission) {

                    const cargo = interaction.options.getRole('cargo')
                    const cargo2 = interaction.options.getRole('cargo2')
                    const cargo3 = interaction.options.getRole('cargo3')
                    const cargo4 = interaction.options.getRole('cargo4')
                    const cargo5 = interaction.options.getRole('cargo5')

                    const cargosCurrent = [
                        cargo,
                        cargo2,
                        cargo3,
                        cargo4,
                        cargo5,
                    ]

                    for (const cargoList of cargosCurrent) {
                        if (!cargoList) {
                            continue;
                        }
                        if (cargoList.position >= botMember.roles.highest.position) {
                            return interaction.reply({ content: "> \`-\` <a:alerta:1163274838111162499> O cargo selecionado está acima ou na mesma posição hierárquica do cargo da Grove. A Grove não tem permissão para adicionar esse cargo adicione o cargo da Grove acima desse cargo.", ephemeral: true });
                        }
                    }

                    const user = await autoroles.findOne({
                        guildId: interaction.guild.id
                    })

                    if (!user) {
                        const newCargo = {
                            guildId: interaction.guild.id,
                        }

                        if (cargo) {
                            newCargo.cargo1Id = cargo.id
                        }
                        if (cargo2) {
                            newCargo.cargo2Id = cargo2.id
                        }
                        if (cargo3) {
                            newCargo.cargo3Id = cargo3.id
                        }
                        if (cargo4) {
                            newCargo.cargo4Id = cargo4.id
                        }
                        if (cargo5) {
                            newCargo.cargo5Id = cargo5.id
                        }

                        await autoroles.create(newCargo)

                        let cargoNames = []

                        if (cargo) {
                            cargoNames.push(cargo)
                        }
                        if (cargo2) {
                            cargoNames.push(cargo2)
                        }
                        if (cargo3) {
                            cargoNames.push(cargo3)
                        }
                        if (cargo4) {
                            cargoNames.push(cargo4)
                        }
                        if (cargo5) {
                            cargoNames.push(cargo5)
                        }

                        if (cargoNames.length > 0) {
                            let LogsAddUser = new discord.EmbedBuilder()
                                .setDescription(`**AutoRole configurado:** \n\n> \`+\` ${cargoNames.join("\n> \`+\` ")}`)
                                .setTimestamp()
                                .setColor('13F000')
                                .setFooter({ text: `${interaction.member.user.username}`, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })

                            return interaction.reply({ embeds: [LogsAddUser], ephemeral: true })
                        }

                    } else {

                        if (!cargo) {
                            await autoroles.findOneAndUpdate({
                                guildId: interaction.guild.id
                            }, { $unset: { "cargo1Id": "" } })
                        } else {
                            await autoroles.findOneAndUpdate({
                                guildId: interaction.guild.id
                            }, { $set: { "cargo1Id": cargo.id } })
                        }

                        if (!cargo2) {
                            await autoroles.findOneAndUpdate({
                                guildId: interaction.guild.id
                            }, { $unset: { "cargo2Id": "" } })
                        } else {
                            await autoroles.findOneAndUpdate({
                                guildId: interaction.guild.id
                            }, { $set: { "cargo2Id": cargo2.id } })
                        }

                        if (!cargo3) {
                            await autoroles.findOneAndUpdate({
                                guildId: interaction.guild.id
                            }, { $unset: { "cargo3Id": "" } })
                        } else {
                            await autoroles.findOneAndUpdate({
                                guildId: interaction.guild.id
                            }, { $set: { "cargo3Id": cargo3.id } })
                        }

                        if (!cargo4) {
                            await autoroles.findOneAndUpdate({
                                guildId: interaction.guild.id
                            }, { $unset: { "cargo4Id": "" } })
                        } else {
                            await autoroles.findOneAndUpdate({
                                guildId: interaction.guild.id
                            }, { $set: { "cargo4Id": cargo4.id } })
                        }

                        if (!cargo5) {
                            await autoroles.findOneAndUpdate({
                                guildId: interaction.guild.id
                            }, { $unset: { "cargo5Id": "" } })
                        } else {
                            await autoroles.findOneAndUpdate({
                                guildId: interaction.guild.id
                            }, { $set: { "cargo5Id": cargo5.id } })
                        }

                        let cargoNames = []

                        if (cargo) {
                            cargoNames.push(cargo)
                        }
                        if (cargo2) {
                            cargoNames.push(cargo2)
                        }
                        if (cargo3) {
                            cargoNames.push(cargo3)
                        }
                        if (cargo4) {
                            cargoNames.push(cargo4)
                        }
                        if (cargo5) {
                            cargoNames.push(cargo5)
                        }

                        if (cargoNames.length > 0) {
                            let LogsAddUser = new discord.EmbedBuilder()
                                .setDescription(`**AutoRole atualizado:** \n\n> \`+\` ${cargoNames.join("\n> \`+\` ")}`)
                                .setTimestamp()
                                .setColor('13F000')
                                .setFooter({ text: `${interaction.member.user.username}`, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })

                            return interaction.reply({ embeds: [LogsAddUser], ephemeral: true })
                        }

                    }

                } else {

                    return interaction.reply({ content: "> \`-\` <a:alerta:1163274838111162499> Não posso concluir o comandos pois ainda não recebir permissão para gerenciar este servidor (Administrador)", ephemeral: true })
                }

                break
            }

            case "bem-vindo": {

                if (!interaction.member.permissions.has(discord.PermissionFlagsBits.ManageChannels)) return interaction.reply({ content: `> \`-\` <a:alerta:1163274838111162499> Não posso concluir este comando pois você não possui permissão.`, ephemeral: true })


                const botMember = interaction.member.guild.members.cache.get(client.user.id)
                const hasPermission = botMember.permissions.has("Administrator")

                if (hasPermission) {

                    const cmd1 = interaction.options.getChannel('canal')

                    const user = await bemvindo.findOne({
                        guildId: interaction.guild.id
                    })

                    if (!user) {
                        const newCmd = {
                            guildId: interaction.guild.id,
                        }
                        if (cmd1) {
                            newCmd.canal1 = cmd1.id
                        }

                        await bemvindo.create(newCmd)

                        let cargoNames = []

                        if (cmd1) {
                            cargoNames.push(cmd1)
                        }

                        let LogsAddUser = new discord.EmbedBuilder()
                            .setDescription(`**Canal de Bem-Vindos configurado:** \n\n> \`+\` ${cargoNames}`)
                            .setTimestamp()
                            .setColor('13F000')
                            .setFooter({ text: `${interaction.member.user.username}`, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })

                        return interaction.reply({ embeds: [LogsAddUser], ephemeral: true })

                    } else {

                        if (!cmd1) {
                            await bemvindo.findOneAndUpdate({
                                guildId: interaction.guild.id
                            }, { $unset: { "canal1": "" } })
                        } else {
                            await bemvindo.findOneAndUpdate({
                                guildId: interaction.guild.id
                            }, { $set: { "canal1": cmd1.id } })
                        }

                        let cargoNames = []

                        if (cmd1) {
                            cargoNames.push(cmd1)
                        }

                        let LogsAddUser = new discord.EmbedBuilder()
                            .setDescription(`**Canal de Bem-Vindos atualizado:** \n\n> \`+\` ${cargoNames}`)
                            .setTimestamp()
                            .setColor('13F000')
                            .setFooter({ text: `${interaction.member.user.username}`, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })

                        return interaction.reply({ embeds: [LogsAddUser], ephemeral: true })
                    }


                } else {

                    return interaction.reply({ content: "> \`-\` <a:alerta:1163274838111162499> Não posso concluir o comandos pois ainda não recebir permissão para gerenciar este servidor (Administrador)", ephemeral: true })
                }

                break
            }


            case "comandos": {

                if (!interaction.member.permissions.has(discord.PermissionFlagsBits.ManageChannels)) return interaction.reply({ content: `> \`-\` <a:alerta:1163274838111162499> Não posso concluir este comando pois você não possui permissão.`, ephemeral: true })

                const botMember = interaction.member.guild.members.cache.get(client.user.id)
                const hasPermission = botMember.permissions.has("Administrator")

                if (hasPermission) {

                    const cmd1 = interaction.options.getChannel('canal')

                    const user = await comandos.findOne({
                        guildId: interaction.guild.id
                    })

                    if (!user) {
                        const newCmd = {
                            guildId: interaction.guild.id,
                        }
                        if (cmd1) {
                            newCmd.canal1 = cmd1.id
                        }

                        await comandos.create(newCmd)

                        let cargoNames = []

                        if (cmd1) {
                            cargoNames.push(cmd1)
                        }

                        let LogsAddUser = new discord.EmbedBuilder()
                            .setDescription(`**Canal de comandos configurado:** \n\n> \`+\` ${cargoNames}`)
                            .setTimestamp()
                            .setColor('13F000')
                            .setFooter({ text: `${interaction.member.user.username}`, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })

                        return interaction.reply({ embeds: [LogsAddUser], ephemeral: true })
                    } else {

                        if (!cmd1) {
                            await comandos.findOneAndUpdate({
                                guildId: interaction.guild.id
                            }, { $unset: { "canal1": "" } })
                        } else {
                            await comandos.findOneAndUpdate({
                                guildId: interaction.guild.id
                            }, { $set: { "canal1": cmd1.id } })
                        }

                        let cargoNames = []

                        if (cmd1) {
                            cargoNames.push(cmd1)
                        }


                        let LogsAddUser = new discord.EmbedBuilder()
                            .setDescription(`**Canal de comandos atualizado:** \n\n> \`+\` ${cargoNames}`)
                            .setTimestamp()
                            .setColor('13F000')
                            .setFooter({ text: `${interaction.member.user.username}`, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })

                        return interaction.reply({ embeds: [LogsAddUser], ephemeral: true })
                    }

                } else {

                    return interaction.reply({ content: "> \`-\` <a:alerta:1163274838111162499> Não posso concluir o comandos pois ainda não recebir permissão para gerenciar este servidor (Administrador)", ephemeral: true })
                }

                break
            }


            //////// fbv Atualizado MongoDB
            case "fbv": {

                if (!interaction.member.permissions.has(discord.PermissionFlagsBits.ManageChannels)) return interaction.reply({ content: `> \`-\` <a:alerta:1163274838111162499> Não posso concluir este comando pois você não possui permissão.`, ephemeral: true })


                const botMember = interaction.member.guild.members.cache.get(client.user.id)
                const hasPermission = botMember.permissions.has("Administrator")

                if (hasPermission) {

                    const cmd1 = interaction.options.getAttachment('imagem')

                    const user = await fbv.findOne({
                        guildId: interaction.guild.id
                    })

                    if (!user) {
                        const newCmd = {
                            guildId: interaction.guild.id,
                        }
                        if (cmd1) {
                            newCmd.canal1 = cmd1.url
                        }

                        await fbv.create(newCmd)

                        let cargoNames = []

                        if (cmd1) {
                            cargoNames.push(cmd1)
                        }

                        let LogsAddUser = new discord.EmbedBuilder()
                            .setDescription(`**Imagem de Boas-Vindas configurada:** \n\n> \`+\` Nome: **${cmd1.name}** \n\n > \`+\` Altura: **${cmd1.height}** \n\n > \`+\` Largura: **${cmd1.width}**`)
                            .setImage(cmd1.url)
                            .setTimestamp()
                            .setColor('13F000')
                            .setFooter({ text: `${interaction.member.user.username}`, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })

                        return interaction.reply({ embeds: [LogsAddUser], ephemeral: true })
                    } else {

                        if (!cmd1) {
                            await fbv.findOneAndUpdate({
                                guildId: interaction.guild.id
                            }, { $unset: { "canal1": "" } })
                        } else {
                            await fbv.findOneAndUpdate({
                                guildId: interaction.guild.id
                            }, { $set: { "canal1": cmd1.url } })
                        }

                        let cargoNames = []

                        if (cmd1) {
                            cargoNames.push(cmd1)
                        }


                        let LogsAddUser = new discord.EmbedBuilder()
                            .setDescription(`**Imagem de Boas-Vindas atualizado:** \n\n> \`+\` Nome: **${cmd1.name}** \n\n > \`+\` Altura: **${cmd1.height}** \n\n > \`+\` Largura: **${cmd1.width}**`)
                            .setImage(cmd1.url)
                            .setTimestamp()
                            .setColor('13F000')
                            .setFooter({ text: `${interaction.member.user.username}`, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })

                        return interaction.reply({ embeds: [LogsAddUser], ephemeral: true })
                    }

                } else {

                    return interaction.reply({ content: "> \`-\` <a:alerta:1163274838111162499> Não posso concluir o comandos pois ainda não recebir permissão para gerenciar este servidor (Administrador)", ephemeral: true })
                }

                break
            }


            case "memes": {

                if (!interaction.member.permissions.has(discord.PermissionFlagsBits.ManageChannels)) return interaction.reply({ content: `> \`-\` <a:alerta:1163274838111162499> Não posso concluir este comando pois você não possui permissão.`, ephemeral: true })


                const botMember = interaction.member.guild.members.cache.get(client.user.id)
                const hasPermission = botMember.permissions.has("Administrator")

                if (hasPermission) {

                    const canal = interaction.options.getChannel('canal')

                    const user = await meme.findOne({
                        guildId: interaction.guild.id
                    })

                    if (!user) {
                        const newCmd = {
                            guildId: interaction.guild.id,
                        }
                        if (canal) {
                            newCmd.canal1 = canal.id
                        }

                        await meme.create(newCmd)

                        let cargoNames = []

                        if (canal) {
                            cargoNames.push(canal)
                        }

                        let LogsAddUser = new discord.EmbedBuilder()
                            .setDescription(`**Canal de memes configurado:** \n\n> \`+\` ${cargoNames}`)
                            .setTimestamp()
                            .setColor('13F000')
                            .setFooter({ text: `${interaction.member.user.username}`, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })

                        return interaction.reply({ embeds: [LogsAddUser], ephemeral: true })
                    } else {

                        if (!canal) {
                            await meme.findOneAndUpdate({
                                guildId: interaction.guild.id
                            }, { $unset: { "canal1": "" } })
                        } else {
                            await meme.findOneAndUpdate({
                                guildId: interaction.guild.id
                            }, { $set: { "canal1": canal.id } })
                        }

                        let cargoNames = []

                        if (canal) {
                            cargoNames.push(canal)
                        }


                        let LogsAddUser = new discord.EmbedBuilder()
                            .setDescription(`**Canal de memes atualizado:** \n\n> \`+\` ${cargoNames}`)
                            .setTimestamp()
                            .setColor('13F000')
                            .setFooter({ text: `${interaction.member.user.username}`, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })

                        return interaction.reply({ embeds: [LogsAddUser], ephemeral: true })
                    }

                } else {

                    return interaction.reply({ content: "> \`-\` <a:alerta:1163274838111162499> Não posso concluir o comandos pois ainda não recebir permissão para gerenciar este servidor (Administrador)", ephemeral: true })
                }

                break
            }

            case "ticket": {

                if (!interaction.member.permissions.has(discord.PermissionFlagsBits.Administrator)) return interaction.reply({ content: `> \`-\` <a:alerta:1163274838111162499> Não posso concluir este comando pois você não possui permissão.`, ephemeral: true })

                const botMember = interaction.member.guild.members.cache.get(client.user.id)
                const hasPermission = botMember.permissions.has("Administrator")

                if (hasPermission) {

                    let canal = interaction.options.getChannel('canal')
                    let canal_log = interaction.options.getChannel('canal_log')
                    let categoria = interaction.options.getChannel('categoria')
                    let button = interaction.options.getString('nome_botao')
                    let cargo = interaction.options.getRole('cargo')



                    const user = await ticket.findOne({
                        guildId: interaction.guild.id
                    })

                    if (!user) {
                        const newCmd = {
                            guildId: interaction.guild.id,
                        }
                        if (canal) {
                            newCmd.canal1 = canal.id
                        }
                        if (canal_log) {
                            newCmd.canalLog = canal_log.id
                        }
                        if (categoria) {
                            newCmd.categoria = categoria.id
                        }
                        if (button) {
                            newCmd.nomeBotao = button
                        }
                        if (cargo) {
                            newCmd.cargo = cargo.id
                        }

                        await ticket.create(newCmd)


                    } else {

                        if (!canal) {
                            await ticket.findOneAndUpdate({
                                guildId: interaction.guild.id
                            }, { $unset: { "canal1": "" } })
                        } else {
                            await ticket.findOneAndUpdate({
                                guildId: interaction.guild.id
                            }, { $set: { "canal1": canal.id } })
                        }

                        if (!canal_log) {
                            await ticket.findOneAndUpdate({
                                guildId: interaction.guild.id
                            }, { $unset: { "canalLog": "" } })
                        } else {
                            await ticket.findOneAndUpdate({
                                guildId: interaction.guild.id
                            }, { $set: { "canalLog": canal_log.id } })
                        }

                        if (!categoria) {
                            await ticket.findOneAndUpdate({
                                guildId: interaction.guild.id
                            }, { $unset: { "categoria": "" } })
                        } else {
                            await ticket.findOneAndUpdate({
                                guildId: interaction.guild.id
                            }, { $set: { "categoria": categoria.id } })
                        }

                        if (!button) {
                            await ticket.findOneAndUpdate({
                                guildId: interaction.guild.id
                            }, { $unset: { "nomeBotao": "" } })
                        } else {
                            await ticket.findOneAndUpdate({
                                guildId: interaction.guild.id
                            }, { $set: { "nomeBotao": button } })
                        }

                        if (!cargo) {
                            await ticket.findOneAndUpdate({
                                guildId: interaction.guild.id
                            }, { $unset: { "cargo": "" } })
                        } else {
                            await ticket.findOneAndUpdate({
                                guildId: interaction.guild.id
                            }, { $set: { "cargo": cargo.id } })
                        }

                    }


                    let modal = new discord.ModalBuilder()
                        .setCustomId('modal_ticket')
                        .setTitle('Mensagem Ticket')

                    let titu = new discord.TextInputBuilder()
                        .setCustomId('titulo')
                        .setLabel("Titulo (Para abrir ticket)")
                        .setStyle(1)
                        .setPlaceholder('Digite o titulo (Primeira Linha)')
                        .setRequired(false)

                    let desc = new discord.TextInputBuilder()
                        .setCustomId('descrição')
                        .setLabel("Descrição da mensagem (Para abrir ticket)")
                        .setStyle(2)
                        .setPlaceholder('Digite a Descrição.')
                        .setRequired(false)

                    let titu02 = new discord.TextInputBuilder()
                        .setCustomId('titulo02')
                        .setLabel("Titulo (Dentro do ticket)")
                        .setStyle(1)
                        .setPlaceholder('Digite o titulo (Primeira Linha)')
                        .setRequired(false)

                    let desc02 = new discord.TextInputBuilder()
                        .setCustomId('descrição02')
                        .setLabel("Descrição da mensagem (Dentro do ticket)")
                        .setStyle(2)
                        .setPlaceholder('Digite a Descrição.')
                        .setRequired(false)

                    const titulo = new discord.ActionRowBuilder().addComponents(titu)
                    const descrição = new discord.ActionRowBuilder().addComponents(desc)
                    const titulo02 = new discord.ActionRowBuilder().addComponents(titu02)
                    const descrição02 = new discord.ActionRowBuilder().addComponents(desc02)

                    modal.addComponents(titulo, descrição, titulo02, descrição02)

                    await interaction.showModal(modal)

                } else {

                    return interaction.reply({ content: "> \`-\` <a:alerta:1163274838111162499> Não posso concluir o comandos pois ainda não recebir permissão para gerenciar este servidor (Administrador)", ephemeral: true })
                }

                break
            }

            case "help": {

                if (!interaction.member.permissions.has(discord.PermissionFlagsBits.ManageChannels)) return interaction.reply({ content: "> \`-\` <a:alerta:1163274838111162499> Não posso concluir este comando pois você não possui permissão.", ephemeral: true })


                let HelpEmbed = new discord.EmbedBuilder()
                    .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                    .setDescription(`Olá ${interaction.user}, Veja como configurar meus comandos. Selecione uma categoria abaixo!`)
                    .setColor("#41b2b0")
                    .addFields(
                        {
                            name: '**Observação 1:**',
                            value: `Comandos que necessitam de cargos superiores aos membros não tem canal de texto definidos para uso de comandos.`,
                            inline: false,


                        },
                        {
                            name: '**Observação 2:**',
                            value: `Recomendamos utilizalos em canal de texto privados.`,
                            inline: false,


                        },
                        {
                            name: '**Observação 2:**',
                            value: `\Nas configuraçãoes de cargos do seu servidor arraste a Grove para o topo de todos os cargos para que todos os comandos funcionem corretamente. Imagem ilustrativa abaixo.`,
                            inline: false,


                        },

                    )
                    .setFooter({ text: `© ${client.user.username} 2022 | ...` })
                    .setThumbnail(`${interaction.user.displayAvatarURL({ dynamic: true })}`)
                    .setImage(`https://cdn.discordapp.com/attachments/1063231058407079946/1176315644308881539/Captura_de_tela_2023-11-20_211637.png?ex=656e6c50&is=655bf750&hm=1bf9223ae7afbea12aa3525618603318809269d1fe079ee787175665ba1b7b1b&`)
                    .setTimestamp()

                let painel = new discord.ActionRowBuilder().addComponents(new discord.StringSelectMenuBuilder()
                    .setCustomId('menu')
                    .setPlaceholder('Selecione uma categoria abaixo.')
                    .addOptions([{
                        label: 'Painel inicial',
                        description: 'Volte para a pagina inicial.',
                        emoji: '<:voltar:1167104944420175984>',
                        value: 'home',
                    },
                    {
                        label: 'Bem-Vindo(a)',
                        description: 'configurar a menssagem de boas-vindas.',
                        emoji: '<:discotoolsxyzicon1:1169631915083583569>',
                        value: 'div',
                    },
                    {
                        label: 'Imagem de bem-vindo(a)',
                        description: 'configurar uma imagem de fundo do Bem-Vindo(a).',
                        emoji: '<:discotoolsxyzicon3:1169631785261486080>',
                        value: 'util3',
                    },
                    {
                        label: 'Auto-Roles',
                        description: 'configurar cargos automatico para novos membros.',
                        emoji: '<:discotoolsxyzicon5:1169631781604053124>',
                        value: 'util2',
                    },
                    {
                        label: 'Commandos',
                        description: 'configurar meu canal de comandos.',
                        emoji: '<:discotoolsxyzicon2:1169631787106967643>',
                        value: 'util',
                    },
                    {
                        label: 'Memes',
                        description: 'configurar meu canal de memes.',
                        emoji: '<:discotoolsxyzicon:1169630230953082991>',
                        value: 'mod',
                    },

                    ])
                )


                interaction.reply({ embeds: [HelpEmbed], content: `${interaction.user}`, components: [painel], ephemeral: true }).then(() => {

                    const filtro = (i) =>
                        i.customId == 'menu'

                    const coletor = interaction.channel.createMessageComponentCollector({
                        filtro
                    })

                    coletor.on('collect', async (collected) => {

                        let valor = collected.values[0]
                        collected.deferUpdate()

                        if (valor === 'home') {
                            interaction.editReply({ embeds: [HelpEmbed], content: `${interaction.user}`, components: [painel], ephemeral: true })

                        }

                        if (valor === 'mod') {

                            let ModEmbed = new discord.EmbedBuilder()

                                .setTitle('SetMemes')
                                .setColor("#41b2b0")


                                .setThumbnail(`${client.user.displayAvatarURL({ dynamic: true })}`)

                                .setDescription(`Olá ${interaction.member}, veja como seta meu canal de memes:`)

                                .addFields(
                                    {
                                        name: `Utilize: </config memes:1160583289464176694> `,
                                        value: `Marque o canal de texto ou cole o ID. Após seta o canal de memes somente o comando /meme funcionara nesse canal de texto.`,
                                        inline: false,
                                    }
                                )

                                .setFooter({ text: `© ${client.user.username} 2022 | ...` })

                                .setTimestamp()

                            interaction.editReply({ embeds: [ModEmbed], content: `${interaction.user}`, components: [painel], ephemeral: true })

                        }

                        if (valor === 'div') {

                            let DivEmbed = new discord.EmbedBuilder()

                                .setTitle('SetBemVindo.')
                                .setColor("#41b2b0")


                                .setThumbnail(`${client.user.displayAvatarURL({ dynamic: true })}`)

                                .setDescription(`Olá ${interaction.member}, veja como seta meu canal de Boas Vindas:`)

                                .addFields(
                                    {
                                        name: `Utilize: </config bem-vindo:1160583289464176694>`,
                                        value: `Marque o canal de texto ou cole o ID. Após seta o canal de bem vindo, todos novos usuarios receberam uma saldação especial.`,
                                        inline: false,
                                    }
                                )


                                .setFooter({ text: `© ${client.user.username} 2022 | ...` })

                                .setTimestamp()

                            interaction.editReply({ embeds: [DivEmbed], content: `${interaction.user}`, components: [painel], ephemeral: true })


                        }

                        if (valor === 'util') {

                            let UtilEmbed = new discord.EmbedBuilder()

                                .setTitle('SetComandos.')
                                .setColor("#41b2b0")


                                .setThumbnail(`${client.user.displayAvatarURL({ dynamic: true })}`)

                                .setDescription(`Olá ${interaction.member}, veja como seta meu canal de comandos:`)

                                .addFields(
                                    {
                                        name: `Utilize: </config comandos:1160583289464176694>`,
                                        value: `Marque o canal de texto ou cole o ID. Após seta o canal de comandos, Todos os meu comandos de interação com o usuário so funcionaram no canal de texto setado.`,
                                        inline: false,
                                    },
                                )

                                .setFooter({ text: `© ${client.user.username} 2022 | ...` })

                                .setTimestamp()

                            interaction.editReply({ embeds: [UtilEmbed], content: `${interaction.user}`, components: [painel], ephemeral: true })


                        }
                        if (valor === 'util2') {

                            let UtilEmbed2 = new discord.EmbedBuilder()

                                .setTitle('SetAutoRole.')
                                .setColor("#41b2b0")


                                .setThumbnail(`${client.user.displayAvatarURL({ dynamic: true })}`)

                                .setDescription(`Olá ${interaction.member}, veja como Configurar o AutoRole:`)

                                .addFields(
                                    {
                                        name: `Utilize: </config autorole:1160583289464176694>`,
                                        value: `Marque o cargo ou cole o ID. Após seta o cargo, Todos os novos membros receberão um cargo automatico.`,
                                        inline: false,
                                    },
                                )

                                .setFooter({ text: `© ${client.user.username} 2022 | ...` })

                                .setTimestamp()

                            interaction.editReply({ embeds: [UtilEmbed2], content: `${interaction.user}`, components: [painel], ephemeral: true })
                        }
                        if (valor === 'util3') {

                            let UtilEmbed3 = new discord.EmbedBuilder()

                                .setTitle('setfb.')
                                .setColor("#41b2b0")
                                .setThumbnail(`${client.user.displayAvatarURL({ dynamic: true })}`)

                                .setDescription(`Olá ${interaction.member}, Veja como configurar o banner de fundo:`)

                                .addFields(
                                    {
                                        name: `Utilize: </config fbv:1160583289464176694>`,
                                        value: `Anexa um imagem valida.. (PNG/JPEG)`,
                                        inline: false,
                                    },
                                )

                                .setFooter({ text: `© ${client.user.username} 2022 | ...` })

                                .setTimestamp()

                            interaction.editReply({ embeds: [UtilEmbed3], content: `${interaction.user}`, components: [painel], ephemeral: true })
                        }

                    })

                })

                break
            }
        }
    }
}

