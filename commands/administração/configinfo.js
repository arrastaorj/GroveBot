const {
    ApplicationCommandType,
    ApplicationCommandOptionType,
    PermissionFlagsBits,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require("discord.js")

const autoroles = require("../../database/models/autorole")
const comandos = require("../../database/models/comandos")
const meme = require("../../database/models/meme")
const bemvindo = require("../../database/models/bemvindo")
const fbv = require("../../database/models/fbv")
const idioma = require("../../database/models/language")
const music = require("../../database/models/music")

module.exports = {
    name: "info",
    description: "Visualize as configurações do servidor",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "configs",
            type: ApplicationCommandOptionType.Subcommand,
            description: "Visualize as configurações do servidor",
        },
    ],



    run: async (client, interaction) => {


        let lang = await idioma.findOne({
            guildId: interaction.guild.id
        })
        lang = lang ? require(`../../languages/${lang.language}.js`) : require('../../languages/pt.js')


        //Verificação para somente quem tiver permição usar o comando
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels))
            return interaction.reply({
                content: `${lang.alertNaoTemPermissão}`,
                ephemeral: true
            })

        let subcommands = interaction.options.getSubcommand()


        switch (subcommands) {

            case "configs": {

                try {

                    let lang = await idioma.findOne({
                        guildId: interaction.guild.id
                    })
                    lang = lang ? require(`../../languages/${lang.language}.js`) : require('../../languages/pt.js')



                    const buttonCreator = [
                        new ActionRowBuilder().addComponents(
                            new ButtonBuilder()
                                .setCustomId('reset')
                                .setLabel(`Resetar Configurações`)
                                .setStyle(ButtonStyle.Danger),
                        ),
                    ]


                    const cargosData = await autoroles.findOne({
                        guildId: interaction.guild.id,
                    })

                    const canaismusicData = await music.findOne({
                        guildId: interaction.guild.id,
                    })

                    const canaisComandosData = await comandos.findOne({
                        guildId: interaction.guild.id,
                    })

                    const canaisMemesData = await meme.findOne({
                        guildId: interaction.guild.id,
                    })

                    const canaisbemvindoData = await bemvindo.findOne({
                        guildId: interaction.guild.id,
                    })

                    const canaisfbvData = await fbv.findOne({
                        guildId: interaction.guild.id,
                    })


                    const canaisidiomaData = await idioma.findOne({
                        guildId: interaction.guild.id,
                    })

                    const guildId = interaction.guild.id
                    const guild = await client.guilds.fetch(guildId);



                    function mapLanguageCodeToName(languageCode) {
                        const languageMap = {
                            'pt': 'Português - Brasil',
                            'fr': 'Francês',
                            'en': 'Inglês',
                            'es': 'Espanhol'
                        }

                        return languageMap[languageCode] || 'Não configurado';
                    }



                    const embed = new EmbedBuilder()
                        .setTitle(`Informações de configurações para a Guilda: **${interaction.guild.name}**`)
                        .setColor("#ba68c8")
                        .setDescription(`Abaixo, você pode visualizar as configurações que foram configuradas em seu servidor por um Moderador (Mod) ou Administrador (ADM)`)
                        .setTimestamp()
                        .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL() })
                        .addFields(

                            {
                                name: `Canal de Comandos`,
                                value: `${canaisComandosData && canaisComandosData.canal1 ? guild.channels.cache.get(canaisComandosData.canal1)?.toString() || "Não encontrado" : "Não configurado"}`,
                                inline: true
                            },
                            {
                                name: `Canal de Musicas`,
                                value: `${canaismusicData && canaismusicData.canal1 ? guild.channels.cache.get(canaismusicData.canal1)?.toString() || "Não encontrado" : "Não configurado"}`,
                                inline: true
                            },
                            {
                                name: `Canal de Memes`,
                                value: `${canaisMemesData && canaisMemesData.canal1 ? guild.channels.cache.get(canaisMemesData.canal1)?.toString() || "Não encontrado" : "Não configurado"}`,
                                inline: true
                            },
                            {
                                name: `Canal de Bem-Vindo`,
                                value: `${canaisbemvindoData && canaisbemvindoData.canal1 ? guild.channels.cache.get(canaisbemvindoData.canal1)?.toString() || "Não encontrado" : "Não configurado"}`,
                                inline: true
                            },
                            {
                                name: 'Fundo do Bem-Vindo',
                                value: canaisfbvData && canaisfbvData.canal1 ? canaisfbvData.canal1 : 'Não configurado',
                                inline: true
                            },
                            {
                                name: 'Idioma do Grove Configurado',
                                value: canaisidiomaData && canaisidiomaData.language
                                    ? mapLanguageCodeToName(canaisidiomaData.language)
                                    : 'Não configurado',
                                inline: true
                            },
                            {
                                name: `Configuraçãoes do AutoRoles`, value: `Cargo 1
                                    ${cargosData && cargosData.cargo1Id ? guild.roles.cache.get(cargosData.cargo1Id)?.toString() || "Não encontrado" : "Não configurado"}\nCargo 2
                                    ${cargosData && cargosData.cargo2Id ? guild.roles.cache.get(cargosData.cargo2Id)?.toString() || "Não encontrado" : "Não configurado"}\nCargo 3
                                    ${cargosData && cargosData.cargo3Id ? guild.roles.cache.get(cargosData.cargo3Id)?.toString() || "Não encontrado" : "Não configurado"}\nCargo 4
                                    ${cargosData && cargosData.cargo4Id ? guild.roles.cache.get(cargosData.cargo4Id)?.toString() || "Não encontrado" : "Não configurado"}\nCargo 5
                                    ${cargosData && cargosData.cargo5Id ? guild.roles.cache.get(cargosData.cargo5Id)?.toString() || "Não encontrado" : "Não configurado"}`
                            },

                        )

                    const m = await interaction.reply({
                        embeds: [embed],
                        components: buttonCreator,
                        ephemeral: true
                    })

                    const filtro = (i) => i.user.id === interaction.user.id

                    const collector = m.createMessageComponentCollector({ filtro, time: 9000000 })

                    collector.on('collect', async (i) => {


                        if (!i.isButton()) return

                        if (i.customId === 'reset') {

                            i.deferUpdate()

                            const confirmationButton = new ActionRowBuilder().addComponents(
                                new ButtonBuilder()
                                    .setCustomId('confirm_reset')
                                    .setLabel('Sim')
                                    .setStyle(ButtonStyle.Success),
                                new ButtonBuilder()
                                    .setCustomId('cancel_reset')
                                    .setLabel('Não')
                                    .setStyle(ButtonStyle.Danger),
                            );

                            const confirmationEmbed = new EmbedBuilder()
                                .setTitle('Confirmação de Reset')
                                .setColor('#FF0000')
                                .setDescription('Tem certeza de que deseja resetar todas as configurações?')
                                .setTimestamp()
                                .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL() })

                            await interaction.editReply({
                                embeds: [confirmationEmbed],
                                components: [confirmationButton],
                                ephemeral: true
                            })


                        }

                        if (i.customId === 'cancel_reset') {

                            i.deferUpdate()

                            const cancelButton = new ActionRowBuilder().addComponents(
                                new ButtonBuilder()
                                    .setCustomId('voltar')
                                    .setLabel('Voltar')
                                    .setStyle(ButtonStyle.Success),
                            )

                            const cancelEmbed = new EmbedBuilder()
                                .setTitle('Reset Cancelado')
                                .setColor('#00FF00') // Cor verde para indicar sucesso
                                .setDescription('O reset de configurações foi cancelado. Clique abaixo para volta ao menu inicial.')
                                .setTimestamp()
                                .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL() });


                            return await interaction.editReply({
                                embeds: [cancelEmbed],
                                components: [cancelButton],
                            })

                        }


                        if (i.customId === 'voltar') {
                            i.deferUpdate();


                            const buttonCreator = [
                                new ActionRowBuilder().addComponents(
                                    new ButtonBuilder()
                                        .setCustomId('reset')
                                        .setLabel(`Resetar Configurações`)
                                        .setStyle(ButtonStyle.Danger),
                                ),
                            ]


                            const cargosData = await autoroles.findOne({
                                guildId: interaction.guild.id,
                            })

                            const canaismusicData = await music.findOne({
                                guildId: interaction.guild.id,
                            })

                            const canaisComandosData = await comandos.findOne({
                                guildId: interaction.guild.id,
                            })

                            const canaisMemesData = await meme.findOne({
                                guildId: interaction.guild.id,
                            })

                            const canaisbemvindoData = await bemvindo.findOne({
                                guildId: interaction.guild.id,
                            })

                            const canaisfbvData = await fbv.findOne({
                                guildId: interaction.guild.id,
                            })


                            const canaisidiomaData = await idioma.findOne({
                                guildId: interaction.guild.id,
                            })

                            const guildId = interaction.guild.id
                            const guild = await client.guilds.fetch(guildId);



                            function mapLanguageCodeToName(languageCode) {
                                const languageMap = {
                                    'pt': 'Português - Brasil',
                                    'fr': 'Francês',
                                    'en': 'Inglês',
                                    'es': 'Espanhol'
                                }

                                return languageMap[languageCode] || 'Não configurado';
                            }



                            const embed = new EmbedBuilder()
                                .setTitle(`Informações de configurações para a Guilda: **${interaction.guild.name}**`)
                                .setColor("#ba68c8")
                                .setDescription(`Abaixo, você pode visualizar as configurações que foram configuradas em seu servidor por um Moderador (Mod) ou Administrador (ADM)`)
                                .setTimestamp()
                                .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL() })
                                .addFields(

                                    {
                                        name: `Canal de Comandos`,
                                        value: `${canaisComandosData && canaisComandosData.canal1 ? guild.channels.cache.get(canaisComandosData.canal1)?.toString() || "Não encontrado" : "Não configurado"}`,
                                        inline: true
                                    },
                                    {
                                        name: `Canal de Musicas`,
                                        value: `${canaismusicData && canaismusicData.canal1 ? guild.channels.cache.get(canaismusicData.canal1)?.toString() || "Não encontrado" : "Não configurado"}`,
                                        inline: true
                                    },
                                    {
                                        name: `Canal de Memes`,
                                        value: `${canaisMemesData && canaisMemesData.canal1 ? guild.channels.cache.get(canaisMemesData.canal1)?.toString() || "Não encontrado" : "Não configurado"}`,
                                        inline: true
                                    },
                                    {
                                        name: `Canal de Bem-Vindo`,
                                        value: `${canaisbemvindoData && canaisbemvindoData.canal1 ? guild.channels.cache.get(canaisbemvindoData.canal1)?.toString() || "Não encontrado" : "Não configurado"}`,
                                        inline: true
                                    },
                                    {
                                        name: 'Fundo do Bem-Vindo',
                                        value: canaisfbvData && canaisfbvData.canal1 ? canaisfbvData.canal1 : 'Não configurado',
                                        inline: true
                                    },
                                    {
                                        name: 'Idioma do Grove Configurado',
                                        value: canaisidiomaData && canaisidiomaData.language
                                            ? mapLanguageCodeToName(canaisidiomaData.language)
                                            : 'Não configurado',
                                        inline: true
                                    },
                                    {
                                        name: `Configuraçãoes do AutoRoles`, value: `Cargo 1
                                            ${cargosData && cargosData.cargo1Id ? guild.roles.cache.get(cargosData.cargo1Id)?.toString() || "Não encontrado" : "Não configurado"}\nCargo 2
                                            ${cargosData && cargosData.cargo2Id ? guild.roles.cache.get(cargosData.cargo2Id)?.toString() || "Não encontrado" : "Não configurado"}\nCargo 3
                                            ${cargosData && cargosData.cargo3Id ? guild.roles.cache.get(cargosData.cargo3Id)?.toString() || "Não encontrado" : "Não configurado"}\nCargo 4
                                            ${cargosData && cargosData.cargo4Id ? guild.roles.cache.get(cargosData.cargo4Id)?.toString() || "Não encontrado" : "Não configurado"}\nCargo 5
                                            ${cargosData && cargosData.cargo5Id ? guild.roles.cache.get(cargosData.cargo5Id)?.toString() || "Não encontrado" : "Não configurado"}`
                                    },

                                )



                            await interaction.editReply({
                                embeds: [embed],
                                components: buttonCreator,
                                ephemeral: true,
                            });

                        }



                        if (i.customId === 'confirm_reset') {

                            i.deferUpdate()


                            const voltarButton = new ActionRowBuilder().addComponents(
                                new ButtonBuilder()
                                    .setCustomId('voltar2')
                                    .setLabel('Voltar')
                                    .setStyle(ButtonStyle.Success),
                            )


                            const successEmbed = new EmbedBuilder()
                                .setTitle('Reset Concluído')
                                .setColor('#00FF00')
                                .setDescription('Todas as configurações foram excluídas com sucesso.')
                                .setTimestamp()
                                .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL() });




                            await Promise.all([
                                autoroles.deleteOne({ guildId: interaction.guild.id }),
                                comandos.deleteOne({ guildId: interaction.guild.id }),
                                meme.deleteOne({ guildId: interaction.guild.id }),
                                bemvindo.deleteOne({ guildId: interaction.guild.id }),
                                fbv.deleteOne({ guildId: interaction.guild.id }),
                                idioma.deleteOne({ guildId: interaction.guild.id }),
                                music.deleteOne({ guildId: interaction.guild.id }),
                            ]);



                            await interaction.editReply({
                                embeds: [successEmbed],
                                components: [voltarButton]
                            })
                        }

                        if (i.customId === 'voltar2') {

                            i.deferUpdate()


                            const buttonCreator = [
                                new ActionRowBuilder().addComponents(
                                    new ButtonBuilder()
                                        .setCustomId('reset')
                                        .setLabel(`Resetar Configurações`)
                                        .setStyle(ButtonStyle.Danger),
                                ),
                            ]


                            const cargosData = await autoroles.findOne({
                                guildId: interaction.guild.id,
                            })

                            const canaismusicData = await music.findOne({
                                guildId: interaction.guild.id,
                            })

                            const canaisComandosData = await comandos.findOne({
                                guildId: interaction.guild.id,
                            })

                            const canaisMemesData = await meme.findOne({
                                guildId: interaction.guild.id,
                            })

                            const canaisbemvindoData = await bemvindo.findOne({
                                guildId: interaction.guild.id,
                            })

                            const canaisfbvData = await fbv.findOne({
                                guildId: interaction.guild.id,
                            })


                            const canaisidiomaData = await idioma.findOne({
                                guildId: interaction.guild.id,
                            })

                            const guildId = interaction.guild.id
                            const guild = await client.guilds.fetch(guildId);



                            function mapLanguageCodeToName(languageCode) {
                                const languageMap = {
                                    'pt': 'Português - Brasil',
                                    'fr': 'Francês',
                                    'en': 'Inglês',
                                    'es': 'Espanhol'
                                }

                                return languageMap[languageCode] || 'Não configurado';
                            }



                            const embed = new EmbedBuilder()
                                .setTitle(`Informações de configurações para a Guilda: **${interaction.guild.name}**`)
                                .setColor("#ba68c8")
                                .setDescription(`Abaixo, você pode visualizar as configurações que foram configuradas em seu servidor por um Moderador (Mod) ou Administrador (ADM)`)
                                .setTimestamp()
                                .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL() })
                                .addFields(

                                    {
                                        name: `Canal de Comandos`,
                                        value: `${canaisComandosData && canaisComandosData.canal1 ? guild.channels.cache.get(canaisComandosData.canal1)?.toString() || "Não encontrado" : "Não configurado"}`,
                                        inline: true
                                    },
                                    {
                                        name: `Canal de Musicas`,
                                        value: `${canaismusicData && canaismusicData.canal1 ? guild.channels.cache.get(canaismusicData.canal1)?.toString() || "Não encontrado" : "Não configurado"}`,
                                        inline: true
                                    },
                                    {
                                        name: `Canal de Memes`,
                                        value: `${canaisMemesData && canaisMemesData.canal1 ? guild.channels.cache.get(canaisMemesData.canal1)?.toString() || "Não encontrado" : "Não configurado"}`,
                                        inline: true
                                    },
                                    {
                                        name: `Canal de Bem-Vindo`,
                                        value: `${canaisbemvindoData && canaisbemvindoData.canal1 ? guild.channels.cache.get(canaisbemvindoData.canal1)?.toString() || "Não encontrado" : "Não configurado"}`,
                                        inline: true
                                    },
                                    {
                                        name: 'Fundo do Bem-Vindo',
                                        value: canaisfbvData && canaisfbvData.canal1 ? canaisfbvData.canal1 : 'Não configurado',
                                        inline: true
                                    },
                                    {
                                        name: 'Idioma do Grove Configurado',
                                        value: canaisidiomaData && canaisidiomaData.language
                                            ? mapLanguageCodeToName(canaisidiomaData.language)
                                            : 'Não configurado',
                                        inline: true
                                    },
                                    {
                                        name: `Configuraçãoes do AutoRoles`, value: `Cargo 1
                                            ${cargosData && cargosData.cargo1Id ? guild.roles.cache.get(cargosData.cargo1Id)?.toString() || "Não encontrado" : "Não configurado"}\nCargo 2
                                            ${cargosData && cargosData.cargo2Id ? guild.roles.cache.get(cargosData.cargo2Id)?.toString() || "Não encontrado" : "Não configurado"}\nCargo 3
                                            ${cargosData && cargosData.cargo3Id ? guild.roles.cache.get(cargosData.cargo3Id)?.toString() || "Não encontrado" : "Não configurado"}\nCargo 4
                                            ${cargosData && cargosData.cargo4Id ? guild.roles.cache.get(cargosData.cargo4Id)?.toString() || "Não encontrado" : "Não configurado"}\nCargo 5
                                            ${cargosData && cargosData.cargo5Id ? guild.roles.cache.get(cargosData.cargo5Id)?.toString() || "Não encontrado" : "Não configurado"}`
                                    },

                                )


                            await interaction.editReply({
                                embeds: [embed],
                                components: buttonCreator,
                                ephemeral: true,
                            });

                        }

                    })

                } catch (error) {
                    console.error("Erro ao buscar informações:", error)
                    return interaction.reply("Ocorreu um erro ao buscar as informações.")
                }

            }
        }

    }
}