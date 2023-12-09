const discord = require("discord.js");
const comandos = require("../../database/models/comandos")
const badgesModule = require('../../functionUserInfo/badges')
const badgeFormatter = require('../../functionUserInfo/badges')
const idioma = require("../../database/models/language")
const { btnInfo, btnPaginaInicial, btnAvatarBannerPermissão, btnVoltar, btnAvatarPermissão } = require("../../buttons/userButtons")

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

        if (!lang || !lang.language) {
            lang = { language: client.language };
        }
        lang = require(`../../languages/${lang.language}.js`)



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

            let membro = interaction.options.getUser('usuario') || interaction.user
            let user = interaction.guild.members.cache.get(membro.id)




            const member = interaction.guild.members.cache.get(user.id)

            let AvatarUser = user.displayAvatarURL({ size: 4096, dynamic: true, format: "png" })



            const userDataResponse = await fetch(`https://groveapi.discloud.app/user/${user.id}`);
            const userData = await userDataResponse.json();


            if (userData.user.premiumSince && userData.boost) {

                const {
                    user: { globalName: userDataNameGlobal, premiumSince: nitroData, legacyUsername: nameOrifinal },
                    profile: { badgesArray: badgesArrayUser, aboutMe: sobreMim, bannerUrl: userBanner },
                    boost: { boost, boostDate, nextBoost }
                } = userData;

                function convertBoostLevel(boost) {
                    return `Boost Level ${boost.replace(/\D/g, '')}`;
                }

                function convertNextBoostLevel(nextBoost) {
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

                let descricaoUsuario = sobreMim
                if (sobreMim == null) descricaoUsuario = "⠀⠀"


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



                const permsObj = {
                    CreateInstantInvite: `\`${lang.msg260}\``,
                    KickMembers: `\`${lang.msg261}\``,
                    BanMembers: `\`${lang.msg262}\``,
                    Administrator: `\`${lang.msg263}\``,
                    ManageChannels: `\`${lang.msg264}\``,
                    ManageGuild: `\`${lang.msg265}\``,
                    AddReactions: `\`${lang.msg266}\``,
                    ViewAuditLog: `\`${lang.msg267}\``,
                    PrioritySpeaker: `\`${lang.msg268}\``,
                    Stream: `\`${lang.msg269}\``,
                    ViewChannel: `\`${lang.msg270}\``,
                    SendMessages: `\`${lang.msg271}\``,
                    SendTTSMessages: `\`${lang.msg272}\``,
                    ManageMessages: `\`${lang.msg273}\``,
                    EmbedLinks: `\`${lang.msg274}\``,
                    AttachFiles: `\`${lang.msg275}\``,
                    ReadMessageHistory: `\`${lang.msg276}\``,
                    MentionEveryone: `\`${lang.msg277}\``,
                    UseExternalEmojis: `\`${lang.msg278}\``,
                    UseExternalStickers: `\`${lang.msg279}\``,
                    ViewGuildInsights: `\`${lang.msg280}\``,
                    Connect: `\`${lang.msg281}\``,
                    Speak: `\`${lang.msg282}\``,
                    MuteMembers: `\`${lang.msg283}\``,
                    DeafenMembers: `\`${lang.msg284}\``,
                    MoveMembers: `\`${lang.msg285}\``,
                    UseVAD: `\`${lang.msg286}\``,
                    ChangeNickname: `\`${lang.msg287}\``,
                    ManageNicknames: `\`${lang.msg288}\``,
                    ManageRoles: `\`${lang.msg289}\``,
                    ManageWebhooks: `\`${lang.msg290}\``,
                    ManageEmojisAndStickers: `\`${lang.msg291}\``,
                    UseApplicationCommands: `\`${lang.msg292}\``,
                    RequestToSpeak: `\`${lang.msg293}\``,
                    ManageEvents: `\`${lang.msg294}\``,
                    ManageThreads: `\`${lang.msg295}\``,
                    CreatePublicThreads: `\`${lang.msg296}\``,
                    CreatePrivateThreads: `\`${lang.msg297}\``,
                    SendMessagesInThreads: `\`${lang.msg298}\``,
                    UseEmbeddedActivities: `\`${lang.msg299}\``,
                    ModerateMembers: `\`${lang.msg300}\``,

                }





                const embed = new discord.EmbedBuilder()
                    .setColor("#41b2b0")
                    .setTitle(`${list.split(",").join(" ")}`)
                    .setAuthor({ name: `${userDataNameGlobal}` })
                    .setThumbnail(AvatarUser)
                    .setFooter({ text: `${lang.msg232} ${descricaoUsuario}` })
                    .setFields(
                        {
                            name: '<:crvt:1179217380715544668> Tag',
                            value: `\`\`\`${member.user.tag}\`\`\``,
                            inline: true
                        },
                        {
                            name: '<:crvt:1179554534301896764> ID',
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
                        },
                        {
                            name: `<:discordnitro:1178827913106305024> ${lang.msg235}`,
                            value: `<t:${~~(boostDateTemp / 1000)}:f> (<t:${~~(boostDateTemp / 1000)}:R>)`,
                            inline: false
                        },
                        {
                            name: `<:1592wumpuswaveboost:1180830275182276658> ${lang.msg236}`,
                            value: `<t:${~~(nextBoostDateTemp / 1000)}:f> (<t:${~~(nextBoostDateTemp / 1000)}:R>)`,
                            inline: false
                        },
                        {
                            name: `${lang.msg237}`,
                            value: `${emoji} ${convertBoostLevel(boost)}`,
                            inline: true
                        },
                        {
                            name: `${lang.msg238}`,
                            value: `${emoji2} ${convertNextBoostLevel(nextBoost)}`,
                            inline: true
                        }
                    )


                if (userBanner) {

                    let avatar = new discord.EmbedBuilder()

                        .setImage(AvatarUser)
                        .setColor("#41b2b0")
                    let banner = new discord.EmbedBuilder()

                        .setImage(userBanner)
                        .setColor("#41b2b0")

                    const permsArray = member.permissions.toArray().map(p => permsObj[p])

                    const embedPerms = new discord.EmbedBuilder()
                        .setColor('#41b2b0')
                        .addFields(
                            {
                                name: `${lang.msg239}`,
                                value: `${member.roles.cache.sort((a, b) => b.position - a.position).first()}`,
                                inline: false
                            },
                            {
                                name: `${lang.msg240} ${membro.username}`,
                                value: `${permsArray.join(', ')}`
                            }
                        )


                    const m = await interaction.reply({ embeds: [embed], components: [btnInfo], fetchReply: true })

                    const collector = m.createMessageComponentCollector({ time: 10 * 60000 });


                    collector.on('collect', async (i) => {

                        if (i.user.id != interaction.user.id)
                            return i.reply({
                                content: `${lang.msg241} ${user}\n${lang.msg242}`,
                                ephemeral: true
                            })

                        i.deferUpdate()
                        switch (i.customId) {

                            case `infos`:
                                m.edit({ embeds: [embed], components: [btnAvatarBannerPermissão, btnPaginaInicial] })
                                break;

                            case `avatar`:
                                m.edit({ embeds: [avatar], components: [btnVoltar] })
                                break;


                            case `voltar`:
                                m.edit({ embeds: [embed], components: [btnAvatarBannerPermissão, btnPaginaInicial] })
                                break;


                            case `banner`:
                                m.edit({ embeds: [banner], components: [btnVoltar] })
                                break;

                            case `verPerms`:
                                m.edit({ embeds: [embedPerms], components: [btnVoltar] })
                                break;

                            case `inicial`:
                                m.edit({ embeds: [embed], components: [btnInfo] })
                                break;


                            case `fechar`:
                        }
                    })

                } else {

                    const permsArray = member.permissions.toArray().map(p => permsObj[p])

                    const embedPerms = new discord.EmbedBuilder()
                        .setColor('#41b2b0')
                        .addFields(
                            {
                                name: `${lang.msg239}`,
                                value: `${member.roles.cache.sort((a, b) => b.position - a.position).first()}`,
                                inline: false
                            },
                            {
                                name: `${lang.msg240} ${membro.username}`,
                                value: `${permsArray.join(', ')}`
                            }
                        )


                    let avatar = new discord.EmbedBuilder()
                        .setImage(AvatarUser)
                        .setColor("#41b2b0")

                    const m = await interaction.reply({ embeds: [embed], components: [btnInfo], fetchReply: true })



                    const collector = m.createMessageComponentCollector({ time: 10 * 60000 });


                    collector.on('collect', async (i) => {

                        if (i.user.id != interaction.user.id) return i.reply({ content: `${lang.msg241} ${user}\n${lang.msg242}`, ephemeral: true })

                        i.deferUpdate()
                        switch (i.customId) {



                            case `infos`:
                                m.edit({ embeds: [embed], components: [btnAvatarPermissão, btnPaginaInicial] })
                                break;

                            case `avatar`:
                                m.edit({ embeds: [avatar], components: [btnVoltar] })
                                break;

                            case `voltar`:
                                m.edit({ embeds: [embed], components: [btnAvatarPermissão, btnPaginaInicial] })
                                break;

                            case `verPerms`:
                                m.edit({ embeds: [embedPerms], components: [btnVoltar] })
                                break;

                            case `inicial`:
                                m.edit({ embeds: [embed], components: [btnInfo] })
                                break;



                            case `fechar`:
                        }
                    })
                }


            } else if (userData.user.premiumSince) {

                const {
                    user: { globalName: userDataNameGlobal, premiumSince: nitroData, legacyUsername: nameOrifinal },
                    profile: { badgesArray: badgesArrayUser, aboutMe: sobreMim, bannerUrl: userBanner },
                } = userData;

                function convertBoostLevel(boost) {
                    return `Boost Level ${boost.replace(/\D/g, '')}`;
                }

                function convertNextBoostLevel(nextBoost) {
                    return `Boost Level ${nextBoost.replace(/\D/g, '')}`;
                }

                const stringData = nitroData
                const data = new Date(stringData)
                const boostDateTemp = data.getTime()


                let descricaoUsuario = sobreMim
                if (sobreMim == null) descricaoUsuario = "⠀⠀"

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


                const permsObj = {
                    CreateInstantInvite: `\`${lang.msg260}\``,
                    KickMembers: `\`${lang.msg261}\``,
                    BanMembers: `\`${lang.msg262}\``,
                    Administrator: `\`${lang.msg263}\``,
                    ManageChannels: `\`${lang.msg264}\``,
                    ManageGuild: `\`${lang.msg265}\``,
                    AddReactions: `\`${lang.msg266}\``,
                    ViewAuditLog: `\`${lang.msg267}\``,
                    PrioritySpeaker: `\`${lang.msg268}\``,
                    Stream: `\`${lang.msg269}\``,
                    ViewChannel: `\`${lang.msg270}\``,
                    SendMessages: `\`${lang.msg271}\``,
                    SendTTSMessages: `\`${lang.msg272}\``,
                    ManageMessages: `\`${lang.msg273}\``,
                    EmbedLinks: `\`${lang.msg274}\``,
                    AttachFiles: `\`${lang.msg275}\``,
                    ReadMessageHistory: `\`${lang.msg276}\``,
                    MentionEveryone: `\`${lang.msg277}\``,
                    UseExternalEmojis: `\`${lang.msg278}\``,
                    UseExternalStickers: `\`${lang.msg279}\``,
                    ViewGuildInsights: `\`${lang.msg280}\``,
                    Connect: `\`${lang.msg281}\``,
                    Speak: `\`${lang.msg282}\``,
                    MuteMembers: `\`${lang.msg283}\``,
                    DeafenMembers: `\`${lang.msg284}\``,
                    MoveMembers: `\`${lang.msg285}\``,
                    UseVAD: `\`${lang.msg286}\``,
                    ChangeNickname: `\`${lang.msg287}\``,
                    ManageNicknames: `\`${lang.msg288}\``,
                    ManageRoles: `\`${lang.msg289}\``,
                    ManageWebhooks: `\`${lang.msg290}\``,
                    ManageEmojisAndStickers: `\`${lang.msg291}\``,
                    UseApplicationCommands: `\`${lang.msg292}\``,
                    RequestToSpeak: `\`${lang.msg293}\``,
                    ManageEvents: `\`${lang.msg294}\``,
                    ManageThreads: `\`${lang.msg295}\``,
                    CreatePublicThreads: `\`${lang.msg296}\``,
                    CreatePrivateThreads: `\`${lang.msg297}\``,
                    SendMessagesInThreads: `\`${lang.msg298}\``,
                    UseEmbeddedActivities: `\`${lang.msg299}\``,
                    ModerateMembers: `\`${lang.msg300}\``,

                }




                const embed = new discord.EmbedBuilder()
                    .setColor("#41b2b0")
                    .setTitle(`${list.split(",").join(" ")}`)
                    .setAuthor({ name: `${userDataNameGlobal}` })
                    .setThumbnail(AvatarUser)
                    .setFooter({ text: `${lang.msg232} ${descricaoUsuario}` })
                    .setFields(
                        {
                            name: '<:crvt:1179217380715544668> Tag',
                            value: `\`\`\`${member.user.tag}\`\`\``,
                            inline: true
                        },
                        {
                            name: '<:crvt:1179554534301896764> ID',
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
                        },
                        {
                            name: `<:discordnitro:1178827913106305024> ${lang.msg235}`,
                            value: `<t:${~~(boostDateTemp / 1000)}:f> (<t:${~~(boostDateTemp / 1000)}:R>)`,
                            inline: false
                        },

                    )

                if (userBanner) {

                    let avatar = new discord.EmbedBuilder()
                        .setImage(AvatarUser)
                        .setColor("#41b2b0")
                    let banner = new discord.EmbedBuilder()
                        .setImage(userBanner)
                        .setColor("#41b2b0")

                    const permsArray = member.permissions.toArray().map(p => permsObj[p])

                    const embedPerms = new discord.EmbedBuilder()
                        .setColor('#41b2b0')
                        .addFields(
                            {
                                name: `${lang.msg239}`,
                                value: `${member.roles.cache.sort((a, b) => b.position - a.position).first()}`,
                                inline: false
                            },
                            {
                                name: `${lang.msg240} ${membro.username}`,
                                value: `${permsArray.join(', ')}`
                            }
                        )


                    const m = await interaction.reply({ embeds: [embed], components: [btnInfo], fetchReply: true })

                    const collector = m.createMessageComponentCollector({ time: 10 * 60000 });


                    collector.on('collect', async (i) => {

                        if (i.user.id != interaction.user.id) return i.reply({ content: `${lang.msg241} ${user}\n${lang.msg242}`, ephemeral: true })

                        i.deferUpdate()
                        switch (i.customId) {


                            case `infos`:
                                m.edit({ embeds: [embed], components: [btnAvatarBannerPermissão, btnPaginaInicial] })
                                break;

                            case `avatar`:
                                m.edit({ embeds: [avatar], components: [btnVoltar] })
                                break;

                            case `voltar`:
                                m.edit({ embeds: [embed], components: [btnAvatarBannerPermissão, btnPaginaInicial] })
                                break;

                            case `banner`:
                                m.edit({ embeds: [banner], components: [btnVoltar] })
                                break;

                            case `verPerms`:
                                m.edit({ embeds: [embedPerms], components: [btnVoltar] })
                                break;

                            case `inicial`:
                                m.edit({ embeds: [embed], components: [btnInfo] })
                                break;


                            case `fechar`:
                        }
                    })

                } else {

                    const permsArray = member.permissions.toArray().map(p => permsObj[p])

                    const embedPerms = new discord.EmbedBuilder()
                        .setColor('#41b2b0')
                        .addFields(
                            {
                                name: `${lang.msg239}`,
                                value: `${member.roles.cache.sort((a, b) => b.position - a.position).first()}`,
                                inline: false
                            },
                            {
                                name: `${lang.msg240} ${membro.username}`,
                                value: `${permsArray.join(', ')}`
                            }
                        )


                    let avatar = new discord.EmbedBuilder()
                        .setImage(AvatarUser)
                        .setColor("#41b2b0")
                    const m = await interaction.reply({ embeds: [embed], components: [btnAvatarPermissão], fetchReply: true })



                    const collector = m.createMessageComponentCollector({ time: 10 * 60000 });


                    collector.on('collect', async (i) => {

                        if (i.user.id != interaction.user.id) return i.reply({ content: `${lang.msg241} ${user}\n${lang.msg242}`, ephemeral: true })

                        i.deferUpdate()
                        switch (i.customId) {

                            case `infos`:
                                m.edit({ embeds: [embed], components: [btnAvatarPermissão, btnPaginaInicial] })
                                break;

                            case `avatar`:
                                m.edit({ embeds: [avatar], components: [btnVoltar] })
                                break;

                            case `voltar`:
                                m.edit({ embeds: [embed], components: [btnAvatarPermissão, btnPaginaInicial] })
                                break;

                            case `verPerms`:
                                m.edit({ embeds: [embedPerms], components: [btnVoltar] })
                                break;

                            case `inicial`:
                                m.edit({ embeds: [embed], components: [btnInfo] })
                                break;

                            case `fechar`:
                        }
                    })
                }

            } else if (userData.boost) {

                const {
                    user: { globalName: userDataNameGlobal, legacyUsername: nameOrifinal },
                    profile: { badgesArray: badgesArrayUser, aboutMe: sobreMim, bannerUrl: userBanner },
                    boost: { boost, boostDate, nextBoost }
                } = userData;

                function convertBoostLevel(boost) {
                    return `Boost Level ${boost.replace(/\D/g, '')}`;
                }

                function convertNextBoostLevel(nextBoost) {
                    return `Boost Level ${nextBoost.replace(/\D/g, '')}`;
                }


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

                let descricaoUsuario = sobreMim
                if (sobreMim == null) descricaoUsuario = "⠀⠀"


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


                const permsObj = {
                    CreateInstantInvite: `\`${lang.msg260}\``,
                    KickMembers: `\`${lang.msg261}\``,
                    BanMembers: `\`${lang.msg262}\``,
                    Administrator: `\`${lang.msg263}\``,
                    ManageChannels: `\`${lang.msg264}\``,
                    ManageGuild: `\`${lang.msg265}\``,
                    AddReactions: `\`${lang.msg266}\``,
                    ViewAuditLog: `\`${lang.msg267}\``,
                    PrioritySpeaker: `\`${lang.msg268}\``,
                    Stream: `\`${lang.msg269}\``,
                    ViewChannel: `\`${lang.msg270}\``,
                    SendMessages: `\`${lang.msg271}\``,
                    SendTTSMessages: `\`${lang.msg272}\``,
                    ManageMessages: `\`${lang.msg273}\``,
                    EmbedLinks: `\`${lang.msg274}\``,
                    AttachFiles: `\`${lang.msg275}\``,
                    ReadMessageHistory: `\`${lang.msg276}\``,
                    MentionEveryone: `\`${lang.msg277}\``,
                    UseExternalEmojis: `\`${lang.msg278}\``,
                    UseExternalStickers: `\`${lang.msg279}\``,
                    ViewGuildInsights: `\`${lang.msg280}\``,
                    Connect: `\`${lang.msg281}\``,
                    Speak: `\`${lang.msg282}\``,
                    MuteMembers: `\`${lang.msg283}\``,
                    DeafenMembers: `\`${lang.msg284}\``,
                    MoveMembers: `\`${lang.msg285}\``,
                    UseVAD: `\`${lang.msg286}\``,
                    ChangeNickname: `\`${lang.msg287}\``,
                    ManageNicknames: `\`${lang.msg288}\``,
                    ManageRoles: `\`${lang.msg289}\``,
                    ManageWebhooks: `\`${lang.msg290}\``,
                    ManageEmojisAndStickers: `\`${lang.msg291}\``,
                    UseApplicationCommands: `\`${lang.msg292}\``,
                    RequestToSpeak: `\`${lang.msg293}\``,
                    ManageEvents: `\`${lang.msg294}\``,
                    ManageThreads: `\`${lang.msg295}\``,
                    CreatePublicThreads: `\`${lang.msg296}\``,
                    CreatePrivateThreads: `\`${lang.msg297}\``,
                    SendMessagesInThreads: `\`${lang.msg298}\``,
                    UseEmbeddedActivities: `\`${lang.msg299}\``,
                    ModerateMembers: `\`${lang.msg300}\``,

                }






                const embed = new discord.EmbedBuilder()
                    .setColor("#41b2b0")
                    .setTitle(`${list.split(",").join(" ")}`)
                    .setAuthor({ name: `${userDataNameGlobal}` })
                    .setThumbnail(AvatarUser)
                    .setFooter({ text: `${lang.msg232} ${descricaoUsuario}` })
                    .setFields(
                        {
                            name: '<:crvt:1179217380715544668> Tag',
                            value: `\`\`\`${member.user.tag}\`\`\``,
                            inline: true
                        },
                        {
                            name: '<:crvt:1179554534301896764> ID',
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
                        },

                        {
                            name: `<:1592wumpuswaveboost:1180830275182276658> ${lang.msg236}`,
                            value: `<t:${~~(nextBoostDateTemp / 1000)}:f> (<t:${~~(nextBoostDateTemp / 1000)}:R>)`,
                            inline: false
                        },
                        {
                            name: `${lang.msg237}`,
                            value: `${emoji} ${convertBoostLevel(boost)}`,
                            inline: true
                        },
                        {
                            name: `${lang.msg238}`,
                            value: `${emoji2} ${convertNextBoostLevel(nextBoost)}`,
                            inline: true
                        }
                    )


                if (userBanner) {

                    let avatar = new discord.EmbedBuilder()

                        .setImage(AvatarUser)
                        .setColor("#41b2b0")
                    let banner = new discord.EmbedBuilder()

                        .setImage(userBanner)
                        .setColor("#41b2b0")

                    const permsArray = member.permissions.toArray().map(p => permsObj[p])

                    const embedPerms = new discord.EmbedBuilder()
                        .setColor('#41b2b0')
                        .addFields(
                            {
                                name: `${lang.msg239}`,
                                value: `${member.roles.cache.sort((a, b) => b.position - a.position).first()}`,
                                inline: false
                            },
                            {
                                name: `${lang.msg240} ${membro.username}`,
                                value: `${permsArray.join(', ')}`
                            }
                        )


                    const m = await interaction.reply({ embeds: [embed], components: [btnInfo], fetchReply: true })

                    const collector = m.createMessageComponentCollector({ time: 10 * 60000 });


                    collector.on('collect', async (i) => {

                        if (i.user.id != interaction.user.id) return i.reply({ content: `${lang.msg241} ${user}\n${lang.msg242}`, ephemeral: true })

                        i.deferUpdate()
                        switch (i.customId) {

                            case `infos`:
                                m.edit({ embeds: [embed], components: [btnAvatarBannerPermissão, btnPaginaInicial] })
                                break;

                            case `avatar`:
                                m.edit({ embeds: [avatar], components: [btnVoltar] })
                                break;


                            case `voltar`:
                                m.edit({ embeds: [embed], components: [btnAvatarBannerPermissão, btnPaginaInicial] })
                                break;


                            case `banner`:
                                m.edit({ embeds: [banner], components: [btnVoltar] })
                                break;

                            case `verPerms`:
                                m.edit({ embeds: [embedPerms], components: [btnVoltar] })
                                break;

                            case `inicial`:
                                m.edit({ embeds: [embed], components: [btnInfo] })
                                break;


                            case `fechar`:
                        }
                    })

                } else {

                    const permsArray = member.permissions.toArray().map(p => permsObj[p])

                    const embedPerms = new discord.EmbedBuilder()
                        .setColor('#41b2b0')
                        .addFields(
                            {
                                name: `${lang.msg239}`,
                                value: `${member.roles.cache.sort((a, b) => b.position - a.position).first()}`,
                                inline: false
                            },
                            {
                                name: `${lang.msg240} ${membro.username}`,
                                value: `${permsArray.join(', ')}`
                            }
                        )


                    let avatar = new discord.EmbedBuilder()
                        .setImage(AvatarUser)
                        .setColor("#41b2b0")

                    const m = await interaction.reply({ embeds: [embed], components: [btnInfo], fetchReply: true })



                    const collector = m.createMessageComponentCollector({ time: 10 * 60000 });


                    collector.on('collect', async (i) => {

                        if (i.user.id != interaction.user.id)
                            return i.reply({
                                content: `${lang.msg241} ${user}\n${lang.msg242}`,
                                ephemeral: true
                            })

                        i.deferUpdate()
                        switch (i.customId) {



                            case `infos`:
                                m.edit({
                                    embeds: [embed],
                                    components: [btnAvatarPermissão, btnPaginaInicial]
                                })
                                break;

                            case `avatar`:
                                m.edit({
                                    embeds: [avatar],
                                    components: [btnVoltar]
                                })
                                break;

                            case `voltar`:
                                m.edit({
                                    embeds: [embed],
                                    components: [btnAvatarPermissão, btnPaginaInicial]
                                })
                                break;

                            case `verPerms`:
                                m.edit({
                                    embeds: [embedPerms],
                                    components: [btnVoltar]
                                })
                                break;

                            case `inicial`:
                                m.edit({
                                    embeds: [embed],
                                    components: [btnInfo]
                                })
                                break;

                            case `fechar`:
                        }
                    })
                }

            } else if (!userData.user.premiumSince || !userData.boost.boost) {


                const {
                    user: { globalName: userDataNameGlobal, legacyUsername: nameOrifinal },
                    profile: { badgesArray: badgesArrayUser, aboutMe: sobreMim, bannerUrl: userBanner },

                } = userData;





                let descricaoUsuario = sobreMim
                if (sobreMim == null) descricaoUsuario = "⠀⠀"

                let list = [];

                if (Array.isArray(badgesArrayUser)) {
                    const desiredBadges = [

                        'HypeSquadOnlineHouse1', 'HypeSquadOnlineHouse2', 'HypeSquadOnlineHouse3',
                        'ActiveDeveloper', 'PremiumEarlySupporter', 'VerifiedDeveloper', 'CertifiedModerator',
                        'VerifiedBot', 'ApplicationCommandBadge', 'ApplicationAutoModerationRuleCreateBadge'

                    ]

                    desiredBadges.forEach(badge => {
                        if (badgesArrayUser.includes(badge)) {
                            list.push(badge)
                        }
                    });
                }

                if (nameOrifinal !== null && nameOrifinal !== undefined) {
                    list.push("TAG")
                }

                if (list.length > 0) {
                    list = list
                        .map(badge => badgeFormatter.formatBadge(badge))
                        .join(",")


                    const permsObj = {
                        CreateInstantInvite: `\`${lang.msg260}\``,
                        KickMembers: `\`${lang.msg261}\``,
                        BanMembers: `\`${lang.msg262}\``,
                        Administrator: `\`${lang.msg263}\``,
                        ManageChannels: `\`${lang.msg264}\``,
                        ManageGuild: `\`${lang.msg265}\``,
                        AddReactions: `\`${lang.msg266}\``,
                        ViewAuditLog: `\`${lang.msg267}\``,
                        PrioritySpeaker: `\`${lang.msg268}\``,
                        Stream: `\`${lang.msg269}\``,
                        ViewChannel: `\`${lang.msg270}\``,
                        SendMessages: `\`${lang.msg271}\``,
                        SendTTSMessages: `\`${lang.msg272}\``,
                        ManageMessages: `\`${lang.msg273}\``,
                        EmbedLinks: `\`${lang.msg274}\``,
                        AttachFiles: `\`${lang.msg275}\``,
                        ReadMessageHistory: `\`${lang.msg276}\``,
                        MentionEveryone: `\`${lang.msg277}\``,
                        UseExternalEmojis: `\`${lang.msg278}\``,
                        UseExternalStickers: `\`${lang.msg279}\``,
                        ViewGuildInsights: `\`${lang.msg280}\``,
                        Connect: `\`${lang.msg281}\``,
                        Speak: `\`${lang.msg282}\``,
                        MuteMembers: `\`${lang.msg283}\``,
                        DeafenMembers: `\`${lang.msg284}\``,
                        MoveMembers: `\`${lang.msg285}\``,
                        UseVAD: `\`${lang.msg286}\``,
                        ChangeNickname: `\`${lang.msg287}\``,
                        ManageNicknames: `\`${lang.msg288}\``,
                        ManageRoles: `\`${lang.msg289}\``,
                        ManageWebhooks: `\`${lang.msg290}\``,
                        ManageEmojisAndStickers: `\`${lang.msg291}\``,
                        UseApplicationCommands: `\`${lang.msg292}\``,
                        RequestToSpeak: `\`${lang.msg293}\``,
                        ManageEvents: `\`${lang.msg294}\``,
                        ManageThreads: `\`${lang.msg295}\``,
                        CreatePublicThreads: `\`${lang.msg296}\``,
                        CreatePrivateThreads: `\`${lang.msg297}\``,
                        SendMessagesInThreads: `\`${lang.msg298}\``,
                        UseEmbeddedActivities: `\`${lang.msg299}\``,
                        ModerateMembers: `\`${lang.msg300}\``,

                    }




                    const embed = new discord.EmbedBuilder()
                        .setColor("#41b2b0")
                        .setTitle(`${list.split(",").join(" ")}`)
                        .setAuthor({ name: `${userDataNameGlobal}` })
                        .setThumbnail(AvatarUser)
                        .setFooter({ text: `${lang.msg232} ${descricaoUsuario}` })
                        .setFields(
                            {
                                name: '<:crvt:1179217380715544668> Tag',
                                value: `\`\`\`${member.user.tag}\`\`\``,
                                inline: true
                            },
                            {
                                name: '<:crvt:1179554534301896764> ID',
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
                            },
                        )


                    if (userBanner) {

                        let avatar = new discord.EmbedBuilder()

                            .setImage(AvatarUser)
                            .setColor("#41b2b0")
                        let banner = new discord.EmbedBuilder()

                            .setImage(userBanner)
                            .setColor("#41b2b0")

                        const permsArray = member.permissions.toArray().map(p => permsObj[p])

                        const embedPerms = new discord.EmbedBuilder()
                            .setColor('#41b2b0')
                            .addFields(
                                {
                                    name: `${lang.msg239}`,
                                    value: `${member.roles.cache.sort((a, b) => b.position - a.position).first()}`,
                                    inline: false
                                },
                                {
                                    name: `${lang.msg240} ${membro.username}`,
                                    value: `${permsArray.join(', ')}`
                                }
                            )


                        const m = await interaction.reply({ embeds: [embed], components: [btnInfo], fetchReply: true })

                        const collector = m.createMessageComponentCollector({ time: 10 * 60000 });


                        collector.on('collect', async (i) => {

                            if (i.user.id != interaction.user.id)
                                return i.reply({
                                    content: `${lang.msg241} ${user}\n${lang.msg242}`,
                                    ephemeral: true
                                })

                            i.deferUpdate()
                            switch (i.customId) {

                                case `infos`:
                                    m.edit({
                                        embeds: [embed],
                                        components: [btnAvatarBannerPermissão, btnPaginaInicial]
                                    })
                                    break;

                                case `avatar`:
                                    m.edit({
                                        embeds: [avatar],
                                        components: [btnVoltar]
                                    })
                                    break;


                                case `voltar`:
                                    m.edit({
                                        embeds: [embed],
                                        components: [btnAvatarBannerPermissão, btnPaginaInicial]
                                    })
                                    break;


                                case `banner`:
                                    m.edit({
                                        embeds: [banner],
                                        components: [btnVoltar]
                                    })
                                    break;

                                case `verPerms`:
                                    m.edit({
                                        embeds: [embedPerms],
                                        components: [btnVoltar]
                                    })
                                    break;

                                case `inicial`:
                                    m.edit({
                                        embeds: [embed],
                                        components: [btnInfo]
                                    })
                                    break;


                                case `fechar`:
                            }
                        })

                    } else {

                        const permsArray = member.permissions.toArray().map(p => permsObj[p])

                        const embedPerms = new discord.EmbedBuilder()
                            .setColor('#41b2b0')
                            .addFields(
                                {
                                    name: `${lang.msg239}`,
                                    value: `${member.roles.cache.sort((a, b) => b.position - a.position).first()}`,
                                    inline: false
                                },
                                {
                                    name: `${lang.msg240} ${membro.username}`,
                                    value: `${permsArray.join(', ')}`
                                }
                            )


                        let avatar = new discord.EmbedBuilder()
                            .setImage(AvatarUser)
                            .setColor("#41b2b0")

                        const m = await interaction.reply({ embeds: [embed], components: [btnInfo], fetchReply: true })



                        const collector = m.createMessageComponentCollector({ time: 10 * 60000 });


                        collector.on('collect', async (i) => {

                            if (i.user.id != interaction.user.id)
                                return i.reply({
                                    content: `${lang.msg241} ${user}\n${lang.msg242}`,
                                    ephemeral: true
                                })

                            i.deferUpdate()
                            switch (i.customId) {



                                case `infos`:
                                    m.edit({
                                        embeds: [embed],
                                        components: [btnAvatarPermissão, btnPaginaInicial]
                                    })
                                    break;

                                case `avatar`:
                                    m.edit({
                                        embeds: [avatar],
                                        components: [btnVoltar]
                                    })
                                    break;

                                case `voltar`:
                                    m.edit({
                                        embeds: [embed],
                                        components: [btnAvatarPermissão, btnPaginaInicial]
                                    })
                                    break;

                                case `verPerms`:
                                    m.edit({
                                        embeds: [embedPerms],
                                        components: [btnVoltar]
                                    })
                                    break;

                                case `inicial`:
                                    m.edit({
                                        embeds: [embed],
                                        components: [btnInfo]
                                    })
                                    break;



                                case `fechar`:
                            }
                        })
                    }

                } else {


                    const {
                        user: { globalName: userDataNameGlobal },
                        profile: { aboutMe: sobreMim, bannerUrl: userBanner },

                    } = userData



                    let descricaoUsuario = sobreMim
                    if (sobreMim == null) descricaoUsuario = "⠀⠀"


                    const permsObj = {
                        CreateInstantInvite: `\`${lang.msg260}\``,
                        KickMembers: `\`${lang.msg261}\``,
                        BanMembers: `\`${lang.msg262}\``,
                        Administrator: `\`${lang.msg263}\``,
                        ManageChannels: `\`${lang.msg264}\``,
                        ManageGuild: `\`${lang.msg265}\``,
                        AddReactions: `\`${lang.msg266}\``,
                        ViewAuditLog: `\`${lang.msg267}\``,
                        PrioritySpeaker: `\`${lang.msg268}\``,
                        Stream: `\`${lang.msg269}\``,
                        ViewChannel: `\`${lang.msg270}\``,
                        SendMessages: `\`${lang.msg271}\``,
                        SendTTSMessages: `\`${lang.msg272}\``,
                        ManageMessages: `\`${lang.msg273}\``,
                        EmbedLinks: `\`${lang.msg274}\``,
                        AttachFiles: `\`${lang.msg275}\``,
                        ReadMessageHistory: `\`${lang.msg276}\``,
                        MentionEveryone: `\`${lang.msg277}\``,
                        UseExternalEmojis: `\`${lang.msg278}\``,
                        UseExternalStickers: `\`${lang.msg279}\``,
                        ViewGuildInsights: `\`${lang.msg280}\``,
                        Connect: `\`${lang.msg281}\``,
                        Speak: `\`${lang.msg282}\``,
                        MuteMembers: `\`${lang.msg283}\``,
                        DeafenMembers: `\`${lang.msg284}\``,
                        MoveMembers: `\`${lang.msg285}\``,
                        UseVAD: `\`${lang.msg286}\``,
                        ChangeNickname: `\`${lang.msg287}\``,
                        ManageNicknames: `\`${lang.msg288}\``,
                        ManageRoles: `\`${lang.msg289}\``,
                        ManageWebhooks: `\`${lang.msg290}\``,
                        ManageEmojisAndStickers: `\`${lang.msg291}\``,
                        UseApplicationCommands: `\`${lang.msg292}\``,
                        RequestToSpeak: `\`${lang.msg293}\``,
                        ManageEvents: `\`${lang.msg294}\``,
                        ManageThreads: `\`${lang.msg295}\``,
                        CreatePublicThreads: `\`${lang.msg296}\``,
                        CreatePrivateThreads: `\`${lang.msg297}\``,
                        SendMessagesInThreads: `\`${lang.msg298}\``,
                        UseEmbeddedActivities: `\`${lang.msg299}\``,
                        ModerateMembers: `\`${lang.msg300}\``,
                    }





                    const embed = new discord.EmbedBuilder()
                        .setColor("#41b2b0")
                        // .setTitle(`${list.split(",").join(" ")}`)
                        .setAuthor({ name: `${userDataNameGlobal}` })
                        .setThumbnail(AvatarUser)
                        .setFooter({ text: `${lang.msg232} ${descricaoUsuario}` })
                        .setFields(
                            {
                                name: '<:crvt:1179217380715544668> Tag',
                                value: `\`\`\`${member.user.tag}\`\`\``,
                                inline: true
                            },
                            {
                                name: '<:crvt:1179554534301896764> ID',
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
                            },
                        )


                    if (userBanner) {

                        let avatar = new discord.EmbedBuilder()

                            .setImage(AvatarUser)
                            .setColor("#41b2b0")
                        let banner = new discord.EmbedBuilder()

                            .setImage(userBanner)
                            .setColor("#41b2b0")

                        const permsArray = member.permissions.toArray().map(p => permsObj[p])

                        const embedPerms = new discord.EmbedBuilder()
                            .setColor('#41b2b0')
                            .addFields(
                                {
                                    name: `${lang.msg239}`,
                                    value: `${member.roles.cache.sort((a, b) => b.position - a.position).first()}`,
                                    inline: false
                                },
                                {
                                    name: `${lang.msg240} ${membro.username}`,
                                    value: `${permsArray.join(', ')}`
                                }
                            )


                        const m = await interaction.reply({ embeds: [embed], components: [btnInfo], fetchReply: true })

                        const collector = m.createMessageComponentCollector({ time: 10 * 60000 });


                        collector.on('collect', async (i) => {

                            if (i.user.id != interaction.user.id)
                                return i.reply({
                                    content: `${lang.msg241} ${user}\n${lang.msg242}`,
                                    ephemeral: true
                                })

                            i.deferUpdate()
                            switch (i.customId) {

                                case `infos`:
                                    m.edit({
                                        embeds: [embed],
                                        components: [btnAvatarBannerPermissão, btnPaginaInicial]
                                    })
                                    break;

                                case `avatar`:
                                    m.edit({
                                        embeds: [avatar],
                                        components: [btnVoltar]
                                    })
                                    break;


                                case `voltar`:
                                    m.edit({
                                        embeds: [embed],
                                        components: [btnAvatarBannerPermissão, btnPaginaInicial]
                                    })
                                    break;


                                case `banner`:
                                    m.edit({
                                        embeds: [banner],
                                        components: [btnVoltar]
                                    })
                                    break;

                                case `verPerms`:
                                    m.edit({
                                        embeds: [embedPerms],
                                        components: [btnVoltar]
                                    })
                                    break;

                                case `inicial`:
                                    m.edit({
                                        embeds: [embed],
                                        components: [btnInfo]
                                    })
                                    break;


                                case `fechar`:
                            }
                        })

                    } else {



                        const permsArray = member.permissions.toArray().map(p => permsObj[p])

                        const embedPerms = new discord.EmbedBuilder()
                            .setColor('#41b2b0')
                            .addFields(
                                {
                                    name: `${lang.msg239}`,
                                    value: `${member.roles.cache.sort((a, b) => b.position - a.position).first()}`,
                                    inline: false
                                },
                                {
                                    name: `${lang.msg240} ${membro.username}`,
                                    value: `${permsArray.join(', ')}`
                                }
                            )


                        let avatar = new discord.EmbedBuilder()
                            .setImage(AvatarUser)
                            .setColor("#41b2b0")

                        const m = await interaction.reply({
                            embeds: [embed],
                            components: [btnInfo],
                            fetchReply: true
                        })



                        const collector = m.createMessageComponentCollector({ time: 10 * 60000 });


                        collector.on('collect', async (i) => {

                            if (i.user.id != interaction.user.id)
                                return i.reply({
                                    content: `${lang.msg241} ${user}\n${lang.msg242}`,
                                    ephemeral: true
                                })

                            i.deferUpdate()
                            switch (i.customId) {


                                case `infos`:
                                    m.edit({
                                        embeds: [embed],
                                        components: [btnAvatarPermissão, btnPaginaInicial]
                                    })
                                    break;

                                case `avatar`:
                                    m.edit({
                                        embeds: [avatar],
                                        components: [btnVoltar]
                                    })
                                    break;

                                case `voltar`:
                                    m.edit({
                                        embeds: [embed],
                                        components: [btnAvatarPermissão, btnPaginaInicial]
                                    })
                                    break;

                                case `verPerms`:
                                    m.edit({
                                        embeds: [embedPerms],
                                        components: [btnVoltar]
                                    })
                                    break;

                                case `inicial`:
                                    m.edit({
                                        embeds: [embed],
                                        components: [btnInfo]
                                    })
                                    break;



                                case `fechar`:
                            }
                        })
                    }
                }
            }
        }

        else if (interaction.channel.id !== cmd1) {
            interaction.reply({
                content: `${lang.alertCanalErrado} <#${cmd1}>.`,
                ephemeral: true
            })
        }
    }
}