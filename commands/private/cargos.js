const discord = require("discord.js")
const cargos = require("../../database/models/cargos")

module.exports = {
    name: 'cargos',
    description: 'Configure o menu de cargos.',
    type: discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "canal",
            type: discord.ApplicationCommandOptionType.Channel,
            description: "Canal onde irei enviar o dropdownRoles",
            required: true
        },
        {
            name: "logs",
            type: discord.ApplicationCommandOptionType.Channel,
            description: "Canal onde sera gerado os logs dos usuários.",
            required: true
        },
        {
            name: "max_roles",
            type: discord.ApplicationCommandOptionType.Integer,
            description: "Quantidade maxima de cargos selecionados.",
            required: true
        },
        {
            name: "descricao",
            type: discord.ApplicationCommandOptionType.String,
            description: "Adicione uma descrição",
            required: true
        },
        {
            name: "cargo1",
            type: discord.ApplicationCommandOptionType.Role,
            description: "Mencione o cargo ou cole o ID",
            required: true
        },
        {
            name: "cargo2",
            type: discord.ApplicationCommandOptionType.Role,
            description: "Mencione o cargo ou cole o ID",
            required: true
        },
        {
            name: "imagem",
            type: discord.ApplicationCommandOptionType.Attachment,
            description: "Anexe uma imagem PNG/JPEG/GIF/WEBP",
            required: false
        },
        {
            name: "cargo3",
            type: discord.ApplicationCommandOptionType.Role,
            description: "Mencione o cargo ou cole o ID",
            required: false
        },
        {
            name: "cargo4",
            type: discord.ApplicationCommandOptionType.Role,
            description: "Mencione o cargo ou cole o ID",
            required: false
        },
        {
            name: "cargo5",
            type: discord.ApplicationCommandOptionType.Role,
            description: "Mencione o cargo ou cole o ID",
            required: false
        },
        {
            name: "cargo6",
            type: discord.ApplicationCommandOptionType.Role,
            description: "Mencione o cargo ou cole o ID",
            required: false
        },
        {
            name: "cargo7",
            type: discord.ApplicationCommandOptionType.Role,
            description: "Mencione o cargo ou cole o ID",
            required: false
        },
        {
            name: "cargo8",
            type: discord.ApplicationCommandOptionType.Role,
            description: "Mencione o cargo ou cole o ID",
            required: false
        },
        {
            name: "cargo9",
            type: discord.ApplicationCommandOptionType.Role,
            description: "Mencione o cargo ou cole o ID",
            required: false
        },
        {
            name: "cargo10",
            type: discord.ApplicationCommandOptionType.Role,
            description: "Mencione o cargo ou cole o ID",
            required: false
        },
    ],


    run: async (client, interaction, args) => {



        if (!interaction.member.permissions.has(discord.PermissionFlagsBits.ManageChannels)) return interaction.reply({ content: "Não posso concluir este comando pois você não possui permissão.", ephemeral: true })


        const botMember = interaction.member.guild.members.cache.get(client.user.id)
        const hasPermission = botMember.permissions.has("Administrator")

        if (hasPermission) {

            const { options, guild, member, message } = interaction

            const chat = interaction.options.getChannel("canal")
            const logs = interaction.options.getChannel("logs")


            const setmax = options.getInteger("max_roles")


            const descrição = interaction.options.getString("descricao")
            const imagem = interaction.options.getAttachment("imagem")


            const cargo1 = options.getRole("cargo1")
            const cargo2 = options.getRole("cargo2")
            const cargo3 = options.getRole("cargo3")
            const cargo4 = options.getRole("cargo4")
            const cargo5 = options.getRole("cargo5")
            const cargo6 = options.getRole("cargo6")
            const cargo7 = options.getRole("cargo7")
            const cargo8 = options.getRole("cargo8")
            const cargo9 = options.getRole("cargo9")
            const cargo10 = options.getRole("cargo10")


            const chatTXT = [
                chat,
                logs
            ]
            for (const chatList of chatTXT) {
                if (!chatList) {
                    continue;
                }
                if (chatList.type === 2) {
                    return interaction.reply({ content: "\`\`\`❌ AVISO: Desculpe, você só pode configurar um canal de texto.\`\`\`", ephemeral: true });
                }
            }

            const cargosCurrent = [
                cargo1,
                cargo2,
                cargo3,
                cargo4,
                cargo5,
                cargo6,
                cargo7,
                cargo8,
                cargo9,
                cargo10
            ];

            for (const cargoList of cargosCurrent) {
                if (!cargoList) {
                    continue;
                }
                if (cargoList.managed === true) {
                    return interaction.reply({ content: "\`\`\`❌ AVISO: Todos os cargos configurados devem estar abaixo de mim e não gerenciados.\`\`\`", ephemeral: true });
                }
            }

            const embed = new discord.EmbedBuilder();
            if (descrição) {
                embed.setDescription(`${descrição}`);
            }
            if (imagem) {
                embed.setImage(`${imagem.url}`);
            }



            const stringSelectMenu = new discord.StringSelectMenuBuilder()
                .setCustomId('select2')
                .setPlaceholder('Selecione os cargos desejado')

            const currentCargos = [cargo1, cargo2, cargo3, cargo4, cargo5, cargo6, cargo7, cargo8, cargo9, cargo10].filter(cargo => cargo)

            currentCargos.forEach((cargo, index) => {
                stringSelectMenu.addOptions({
                    label: `${cargo.name}`,
                    value: `cargo${index + 1}`
                })
            })


            if (setmax <= currentCargos.length) {
                stringSelectMenu.setMaxValues(setmax);
            } else {
                return interaction.reply({ content: "> \`-\` AVISO: Seu máximo selecionado não pode ser maior do que a quantidade de cargos configurados.", ephemeral: true });
            }

            stringSelectMenu.setMinValues(0)


            const dropdown = new discord.ActionRowBuilder().addComponents(stringSelectMenu)

            chat.send({ embeds: [embed], components: [dropdown] }).then(async sentMessage => {

                const user = await cargos.findOne({
                    guildId: interaction.guild.id
                })

                if (!user) {

                    const cargoNames = [
                        'cargo1',
                        'cargo2',
                        'cargo3',
                        'cargo4',
                        'cargo5',
                        'cargo6',
                        'cargo7',
                        'cargo8',
                        'cargo9',
                        'cargo10'
                    ];
                    const newCargo = {
                        guildId: interaction.guild.id,
                        msgID: sentMessage.id,
                        logsId: logs.id
                    };

                    for (let i = 0; i < cargoNames.length; i++) {
                        if (eval(cargoNames[i])) {
                            newCargo[`${cargoNames[i]}Id`] = eval(cargoNames[i]).id;
                        }
                    }
                    await cargos.create(newCargo);

                } else {
                    const cargoNames = [
                        'cargo1',
                        'cargo2',
                        'cargo3',
                        'cargo4',
                        'cargo5',
                        'cargo6',
                        'cargo7',
                        'cargo8',
                        'cargo9',
                        'cargo10'
                    ];
                    const newCargo = {
                        guildId: interaction.guild.id,
                        msgID: sentMessage.id,
                        logsId: logs.id
                    };

                    for (let i = 0; i < cargoNames.length; i++) {
                        if (eval(cargoNames[i])) {
                            newCargo[`${cargoNames[i]}Id`] = eval(cargoNames[i]).id;
                        }
                    }

                    await cargos.create(newCargo);
                }

            })
            
            await interaction.reply({ ephemeral: true, content: `> \`+\` ${interaction.user},\n\n**dropdownRoles**, Enviado com sucesso!\n\n**Canal:** ${chat}\n**Logs:** ${logs}`, })

        } else {

            return interaction.reply({ content: "> \`-\` Não posso concluir o comandos pois ainda não recebir permissão para gerenciar este servidor (Administrador)", ephemeral: true })
        }

    }
}
