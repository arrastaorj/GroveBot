const discord = require("discord.js")
const cargos = require("../../database/models/cargos")
const idioma = require("../../database/models/language")


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

        let lang = await idioma.findOne({
            guildId: interaction.guild.id
        })

        if (!lang || !lang.language) {
            lang = { language: client.language };
        }
        lang = require(`../../languages/${lang.language}.js`)



        if (!interaction.member.permissions.has(discord.PermissionFlagsBits.ManageChannels))
            return interaction.reply({
                content: `${lang.alertNaoTemPermissão}`,
                ephemeral: true
            })


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
                    return interaction.reply({ content: `${lang.msg73}`, ephemeral: true });
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
                if (cargoList.position >= botMember.roles.highest.position) {
                    return interaction.reply({ content: `${lang.msg74}`, ephemeral: true });
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
                .setPlaceholder(`${lang.msg75}`)

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
                return interaction.reply({ content: `${lang.msg76}`, ephemeral: true });
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

            await interaction.reply({ ephemeral: true, content: `> \`-\` <a:alerta:1163274838111162499> ${interaction.user},\n\n**dropdownRoles**, ${lang.msg77}\n\n**${lang.msg78}** ${chat}\n**Logs:** ${logs}`, })

        } else {

            return interaction.reply({ content: `${lang.alertPermissãoBot}`, ephemeral: true })
        }

    }
}