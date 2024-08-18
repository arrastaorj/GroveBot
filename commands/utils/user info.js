const discord = require("discord.js");
const comandos = require("../../database/models/comandos")
const badgesModule = require('../../functionUserInfo/badges')
const badgeFormatter = require('../../functionUserInfo/badges')
const idioma = require("../../database/models/language")

module.exports = {
    name: "user",
    description: "Exibe informaçãoes do usuário.",
    type: discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'info',
            description: 'Exibe informaçãoes do usuário.',
            type: discord.ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "usuario",
                    type: discord.ApplicationCommandOptionType.User,
                    description: "Selecione o usuário que deseja ver as informações.",
                    required: false
                },
            ]
        }

    ],

    async run(client, interaction, args) {

        let lang = await idioma.findOne({
            guildId: interaction.guild.id
        })
        lang = lang ? require(`../../languages/${lang.language}.js`) : require('../../languages/pt.js')


        const btnInfo = new discord.ActionRowBuilder().addComponents([
            new discord.ButtonBuilder()
                .setStyle(discord.ButtonStyle.Primary)
                .setLabel(`${lang.msg246}`)
                .setCustomId("infos"),
        ])
        const btnPaginaInicial = new discord.ActionRowBuilder().addComponents([
            new discord.ButtonBuilder()
                .setStyle(discord.ButtonStyle.Secondary)
                .setLabel(`${lang.msg247}`)
                .setCustomId("inicial"),
        ])
        const btnAvatarBannerPermissão = new discord.ActionRowBuilder().addComponents([

            new discord.ButtonBuilder()
                .setStyle(discord.ButtonStyle.Primary)
                .setLabel(`${lang.msg248}`)
                .setCustomId("avatar"),

            new discord.ButtonBuilder()
                .setStyle(discord.ButtonStyle.Secondary)
                .setLabel(`${lang.msg249}`)
                .setCustomId("banner"),

            new discord.ButtonBuilder()
                .setLabel(`${lang.msg250}`)
                .setEmoji("<:9081settings:1167219166898557029>")
                .setStyle(discord.ButtonStyle.Danger)
                .setCustomId('verPerms')

        ])
        const btnVoltar = new discord.ActionRowBuilder().addComponents([
            new discord.ButtonBuilder()
                .setStyle(discord.ButtonStyle.Secondary)
                .setLabel(`${lang.msg251}`)
                .setCustomId("voltar"),

        ])
        const btnAvatarPermissão = new discord.ActionRowBuilder().addComponents([
            new discord.ButtonBuilder()
                .setStyle(discord.ButtonStyle.Primary)
                .setLabel(`${lang.msg248}`)
                .setCustomId("avatar"),

            new discord.ButtonBuilder()
                .setLabel(`${lang.msg250}`)
                .setEmoji("<:9081settings:1167219166898557029>")
                .setStyle(discord.ButtonStyle.Danger)
                .setCustomId('verPerms')
        ])


        const cmd = await comandos.findOne({
            guildId: interaction.guild.id
        })

        if (!cmd)
            return interaction.reply({
                content: `${lang.alertCommandos}`,
                ephemeral: true
            })


        let cmd1 = cmd.canal1

        if (cmd1 === null || cmd1 === false || !client.channels.cache.get(cmd1) || cmd1 === interaction.channel.id) {

            const membro = interaction.options.getUser('usuario') || interaction.user


            const userInGuild = interaction.guild.members.cache.has(membro.id)
            if (!userInGuild) return interaction.reply({ content: `> \`-\` <a:alerta:1163274838111162499> Usuário não encontrado no servidor.`, ephemeral: false })


            const user = interaction.guild.members.cache.get(membro.id)
            const member = interaction.guild.members.cache.get(user.id)

            let AvatarUser = user.displayAvatarURL({ size: 4096, dynamic: true, format: "png" })


            await interaction.deferReply();

            const userDataResponse = await fetch(`https://groveapi.discloud.app/user/${user.id}`);
            const userData = await userDataResponse.json();

            const {
                user: {
                    globalName: userDataNameGlobal = "Nome padrão",
                    premiumSince: nitroData = null,
                    legacyUsername: nameOrifinal = "Nome original"
                } = {}, // Verifica se 'user' existe, se não, usa um objeto vazio
                profile: {
                    badgesArray: badgesArrayUser = [],
                    bannerUrl: userBanner = null
                } = {}, // Verifica se 'profile' existe, se não, usa um objeto vazio
                boost: {
                    boost = null,
                    boostDate = null,
                    nextBoost = null
                } = {} // Verifica se 'boost' existe, se não, usa um objeto vazio
            } = userData || {}; // Verifica se 'userData' existe, se não, usa um objeto vazio



            function convertBoostLevel(boost) {
                if (!boost) {
                    return "No Boost Level"; // Retorna uma string padrão ou uma mensagem indicando que não há boost
                }
                return `Boost Level ${boost.replace(/\D/g, '')}`;
            }

            function convertNextBoostLevel(nextBoost) {
                if (!nextBoost) {
                    return "No Next Boost Level"; // Retorna uma string padrão ou uma mensagem indicando que não há próximo boost
                }
                return `Boost Level ${nextBoost.replace(/\D/g, '')}`;
            }


            const stringData = nitroData
            const data = new Date(stringData)
            const boostDateTemp = data.getTime()


            const stringData2 = boostDate
            const data2 = new Date(stringData2)
            const nextBoostDateTemp = data2.getTime()


            function getBoostEmoji(boostLevel) {
                const emojiMap = {
                    BoostLevel1: 'discordboost1:1178527220474576957',
                    BoostLevel2: 'discordboost2:1178527223683240006',
                    BoostLevel3: 'discordboost3:1178527224832466965',
                    BoostLevel4: 'discordboost4:1178527227730739210',
                    BoostLevel5: 'discordboost5:1178527229391675472',
                    BoostLevel6: 'discordboost6:1178527232260579430',
                    BoostLevel7: 'discordboost7:1178527233791504454',
                    BoostLevel8: 'discordboost8:1178527236211617874',
                    BoostLevel9: 'discordboost9:1178527237734137916',
                };

                return emojiMap[boostLevel] ? `<:${emojiMap[boostLevel]}>` : '❌';
            }

            let emoji = getBoostEmoji(boost);
            let emoji2 = getBoostEmoji(nextBoost);




            let list = []

            const desiredBadges = [
                'Nitro', 'BoostLevel1', 'BoostLevel2', 'BoostLevel3', 'BoostLevel4',
                'BoostLevel5', 'BoostLevel6', 'BoostLevel7', 'BoostLevel8', 'BoostLevel9',
                'HypeSquadOnlineHouse1', 'HypeSquadOnlineHouse2', 'HypeSquadOnlineHouse3',
                'ActiveDeveloper', 'PremiumEarlySupporter', 'VerifiedDeveloper',
                'CertifiedModerator', 'VerifiedBot', 'ApplicationCommandBadge',
                'ApplicationAutoModerationRuleCreateBadge'
            ];


            desiredBadges.forEach(badge => {
                if (badgesModule.hasBadge(badgesArrayUser, badge)) {
                    list.push(badge);
                }
            })

            if (nameOrifinal !== null && nameOrifinal !== undefined) {
                list.push("TAG");
            }

            list = list
                .map(badge => badgesModule.getFormattedBadge(badge))
                .join(',');


            // Inicia a construção da embed
            const embed = new discord.EmbedBuilder()
                .setColor("#ba68c8")
                .setTitle(`${list.split(",").join(" ")}`)
                .setAuthor({ name: `${userDataNameGlobal}`, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
                .setThumbnail(AvatarUser);

            // Adiciona campos fixos que sempre estarão presentes
            embed.addFields(
                {
                    name: '<:crvt:1179217380715544668> Tag',
                    value: `\`\`\`${member.user.tag}\`\`\``,
                    inline: true
                },
                {
                    name: '<:filas:1183481870051201184> ID',
                    value: `\`\`\`${member.user.id}\`\`\``,
                    inline: true
                },
                {
                    name: `<:crvt:1179215960754896977> ${lang.msg233}`,
                    value: `<t:${~~Math.ceil(member.user.createdTimestamp / 1000)}> (<t:${~~(member.user.createdTimestamp / 1000)}:R>)`,
                    inline: false
                },
                {
                    name: `<:crvt:1179215962839453817> ${lang.msg234}`,
                    value: `<t:${~~(user.joinedTimestamp / 1000)}:f> (<t:${~~(user.joinedTimestamp / 1000)}:R>)`,
                    inline: false
                }
            );

            // Adiciona o campo relacionado ao Nitro Boost apenas se a data de boost existir
            if (boostDateTemp) {
                embed.addFields({
                    name: `<:discordnitro:1178827913106305024> ${lang.msg235}`,
                    value: `<t:${~~(boostDateTemp / 1000)}:f> (<t:${~~(boostDateTemp / 1000)}:R>)`,
                    inline: false
                });
            }

            // Adiciona o campo relacionado ao próximo Boost apenas se a data existir
            if (nextBoostDateTemp) {
                embed.addFields({
                    name: `<:1592wumpuswaveboost:1180830275182276658> ${lang.msg236}`,
                    value: `<t:${~~(nextBoostDateTemp / 1000)}:f> (<t:${~~(nextBoostDateTemp / 1000)}:R>)`,
                    inline: false
                });
            }

            // Adiciona o campo do Boost Level atual se o boost existir
            if (boost) {
                let emoji = getBoostEmoji(boost);
                embed.addFields({
                    name: `${lang.msg237}`,
                    value: `${emoji} ${convertBoostLevel(boost)}`,
                    inline: true
                });
            }

            // Adiciona o campo do próximo Boost Level se o nextBoost existir
            if (nextBoost) {
                let emoji2 = getBoostEmoji(nextBoost);
                embed.addFields({
                    name: `${lang.msg238}`,
                    value: `${emoji2} ${convertNextBoostLevel(nextBoost)}`,
                    inline: true
                });
            }

            // Envia a embed
            interaction.editReply({ embeds: [embed] });



            interaction.editReply({ embeds: [embed] })
        }




        else if (interaction.channel.id !== cmd1) {
            interaction.reply({
                content: `${lang.alertCanalErrado} <#${cmd1}>.`,
                ephemeral: true
            })
        }
    }
}