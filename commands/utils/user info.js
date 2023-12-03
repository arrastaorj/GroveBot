const discord = require("discord.js");
const a = require('../../plugins/getUser')
const comandos = require("../../database/models/comandos")



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



        const cmd = await comandos.findOne({
            guildId: interaction.guild.id
        })

        if (!cmd) return interaction.reply({ content: `> \`-\` <a:alerta:1163274838111162499> Um Adminitrador ainda não configurou o canal para uso de comandos!`, ephemeral: true })


        let cmd1 = cmd.canal1

        if (cmd1 === null || cmd1 === false || !client.channels.cache.get(cmd1) || cmd1 === interaction.channel.id) {

            let membro = interaction.options.getUser('usuario') || interaction.user
            let user = interaction.guild.members.cache.get(membro.id)

            let user2 = await a.getUser(membro.id, client.token)

            const member = interaction.guild.members.cache.get(user.id)

            let AvatarUser = user.displayAvatarURL({ size: 4096, dynamic: true, format: "png" })

            let list = []

            const userDataResponse = await fetch(`https://groveapi.discloud.app/user/${user.id}`);
            const userData = await userDataResponse.json();



            if (userData.user && userData.profile && userData.boost) {

                const {
                    user: { globalName: userDataNameGlobal, premiumSince: nitroData },
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

                if (badgesArrayUser.includes('Nitro')) list.push("Nitro")
                if (badgesArrayUser.includes('BoostLevel1')) list.push("BoostLevel1")
                if (badgesArrayUser.includes('BoostLevel2')) list.push("BoostLevel2")
                if (badgesArrayUser.includes('BoostLevel3')) list.push("BoostLevel3")
                if (badgesArrayUser.includes('BoostLevel4')) list.push("BoostLevel4")
                if (badgesArrayUser.includes('BoostLevel5')) list.push("BoostLevel5")
                if (badgesArrayUser.includes('BoostLevel6')) list.push("BoostLevel6")
                if (badgesArrayUser.includes('BoostLevel7')) list.push("BoostLevel7")
                if (badgesArrayUser.includes('BoostLevel8')) list.push("BoostLevel8")
                if (badgesArrayUser.includes('BoostLevel9')) list.push("BoostLevel9")
                if (badgesArrayUser.includes('HypeSquadOnlineHouse1')) list.push("HypeSquadOnlineHouse1")
                if (badgesArrayUser.includes('HypeSquadOnlineHouse2')) list.push("HypeSquadOnlineHouse2")
                if (badgesArrayUser.includes('HypeSquadOnlineHouse3')) list.push("HypeSquadOnlineHouse3")
                if (badgesArrayUser.includes('ActiveDeveloper')) list.push("ActiveDeveloper")//desenvolvedor ativo
                if (badgesArrayUser.includes('PremiumEarlySupporter')) list.push("PremiumEarlySupporter")//apoiador inicial
                if (badgesArrayUser.includes('VerifiedDeveloper')) list.push("VerifiedDeveloper")//desenvolvedor verificado de bots pioneiro
                if (badgesArrayUser.includes('CertifiedModerator')) list.push("CertifiedModerator")//ex moderador do discord
                if (badgesArrayUser.includes('VerifiedBot')) list.push("VerifiedBot")//bot verificado
                if (badgesArrayUser.includes('ApplicationCommandBadge')) list.push("ApplicationCommandBadge") //compativel com comandos
                if (badgesArrayUser.includes('ApplicationAutoModerationRuleCreateBadge')) list.push("ApplicationAutoModerationRuleCreateBadge") //usa autoMod



                if (!user.discriminator || user.discriminator === 0 || user.tag === `${user.username}#0`) {
                    list.push("TAG")
                }

                list = list
                    .join(",")
                    //Badges NITRO
                    .replace("Nitro", "<:discordnitro:1178827913106305024>")
                    .replace("BoostLevel1", "<:discordboost1:1178527220474576957>")
                    .replace("BoostLevel2", "<:discordboost2:1178527223683240006>")
                    .replace("BoostLevel3", "<:discordboost3:1178527224832466965>")
                    .replace("BoostLevel4", "<:discordboost4:1178527227730739210>")
                    .replace("BoostLevel5", "<:discordboost5:1178527229391675472>")
                    .replace("BoostLevel6", "<:discordboost6:1178527232260579430>")
                    .replace("BoostLevel7", "<:discordboost7:1178527233791504454>")
                    .replace("BoostLevel8", "<:discordboost8:1178527236211617874>")
                    .replace("BoostLevel9", "<:discordboost9:1178527237734137916>")
                    //Badges USER
                    .replace("HypeSquadOnlineHouse1", `<:hypesquadbravery:1178528159503757443>`)
                    .replace("HypeSquadOnlineHouse2", `<:hypesquadbrilliance:1178528160711716934>`)
                    .replace("HypeSquadOnlineHouse3", `<:hypesquadbalance:1178528157368852480>`)
                    .replace("ActiveDeveloper", `<:activedeveloper:1178827904889667744>`)
                    .replace("PremiumEarlySupporter", `<:discordearlysupporter:1178827909683744788>`)
                    .replace("VerifiedDeveloper", `<:discordbotdev:1178827908391915622>`)
                    .replace("CertifiedModerator", `<:discordmod:1178827911667646544>`)
                    .replace("TAG", `<:username:1161109720870948884>`)
                    //Badges BOT
                    .replace("VerifiedBot", `<:VerifiedBot:1178828214039236668>`)
                    .replace("ApplicationCommandBadge", `<:supportscommands:1178827914603659336>`)
                    .replace("ApplicationAutoModerationRuleCreateBadge", `<:automod:1178827907095875604>`)

                const permsObj = {
                    CreateInstantInvite: '\`Criar convite instantâneo\`',
                    KickMembers: '\`Expulsar membros\`',
                    BanMembers: '\`Banir membros\`',
                    Administrator: '\`Administrador\`',
                    ManageChannels: '\`Gerenciar canais\`',
                    ManageGuild: '\`Gerenciar servidor\`',
                    AddReactions: '\`Adicionar reações\`',
                    ViewAuditLog: '\`Ver registro de auditoria\`',
                    PrioritySpeaker: '\`Voz Prioritária\`',
                    Stream: '\`Ao vivo\`',
                    ViewChannel: '\`Ver canais\`',
                    SendMessages: '\`Enviar mensagens\`',
                    SendTTSMessages: '\`Enviar mensagens em tts\`',
                    ManageMessages: '\`Gerenciar mensagens\`',
                    EmbedLinks: '\`Enviar links\`',
                    AttachFiles: '\`Enviar anexos\`',
                    ReadMessageHistory: '\`Ver histórico de mensagens\`',
                    MentionEveryone: '\`Mencionar everyone e cargos\`',
                    UseExternalEmojis: '\`Usar emojis externos\`',
                    UseExternalStickers: '\`Usar figurinhas externas\`',
                    ViewGuildInsights: '\`Ver análises do servidor\`',
                    Connect: "\`Conectar em call's\`",
                    Speak: `\`Falar em call's\``,
                    MuteMembers: `\`Mutar membros\``,
                    DeafenMembers: `\`Ensurdecer membros\``,
                    MoveMembers: `\`Mover membros\``,
                    UseVAD: `\`Utilizar detecção de voz\``,
                    ChangeNickname: `\`Alterar apelido\``,
                    ManageNicknames: `\`Gerenciar apelidos\``,
                    ManageRoles: `\`Gerenciar cargos\``,
                    ManageWebhooks: `\`Gerenciar webhooks\``,
                    ManageEmojisAndStickers: `\`Gerenciar emojis e figurinhas\``,
                    UseApplicationCommands: `\`Utilizar comandos slashs (/)\``,
                    RequestToSpeak: `\`Pedir para falar\``,
                    ManageEvents: `\`Gerenciar eventos\``,
                    ManageThreads: `\`Gerenciar threads\``,
                    CreatePublicThreads: `\`Criar threads públicas\``,
                    CreatePrivateThreads: `\`Criar threads privadas\``,
                    SendMessagesInThreads: `\`Falar em threads\``,
                    UseEmbeddedActivities: `\`Iniciar atividades\``,
                    ModerateMembers: `\`Gerenciar moderação do servidor\``
                }


                let btn1 = new discord.ActionRowBuilder().addComponents([

                    new discord.ButtonBuilder()
                        .setStyle("Primary")
                        .setLabel("Avatar")
                        .setCustomId("avatar"),

                    new discord.ButtonBuilder()
                        .setStyle("Secondary")
                        .setLabel("Banner")
                        .setCustomId("banner"),

                    new discord.ButtonBuilder()
                        .setLabel('Permissões do Membro')
                        .setEmoji("<:9081settings:1167219166898557029>")
                        .setStyle("Success")
                        .setCustomId('verPerms')

                ]);

                let btn2 = new discord.ActionRowBuilder().addComponents([

                    new discord.ButtonBuilder()
                        .setStyle("Secondary")
                        .setLabel("Pagina inicial")
                        .setCustomId("inicial"),

                ])

                let btn3 = new discord.ActionRowBuilder().addComponents([

                    new discord.ButtonBuilder()
                        .setStyle("Primary")
                        .setLabel("Avatar")
                        .setCustomId("avatar"),

                    new discord.ButtonBuilder()
                        .setLabel('Permissões do Membro')
                        .setEmoji("<:9081settings:1167219166898557029>")
                        .setStyle("Success")
                        .setCustomId('verPerms')
                ])


                const embed = new discord.EmbedBuilder()
                    .setColor("#41b2b0")
                    .setTitle(`${list.split(",").join(" ")}`)
                    .setAuthor({ name: `${userDataNameGlobal}` })
                    .setThumbnail(AvatarUser)
                    .setFooter({ text: `Sobre mim: ${descricaoUsuario}` })
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
                            name: '<:crvt:1179215960754896977> Data de criação da conta',
                            value: `<t:${~~Math.ceil(member.user.createdTimestamp / 1000)}> (<t:${~~(member.user.createdTimestamp / 1000)}:R>)`,
                            inline: false
                        },
                        {
                            name: '<:crvt:1179215962839453817> Entrou em',
                            value: `<t:${~~(user.joinedTimestamp / 1000)}:f> (<t:${~~(user.joinedTimestamp / 1000)}:R>)`,
                            inline: false
                        },
                        {
                            name: '<:discordnitro:1178827913106305024> Assinante Nitro desde',
                            value: `<t:${~~(boostDateTemp / 1000)}:f> (<t:${~~(boostDateTemp / 1000)}:R>)`,
                            inline: false
                        },
                        {
                            name: '<:1592wumpuswaveboost:1180830275182276658> Impulsionando servidor desde',
                            value: `<t:${~~(nextBoostDateTemp / 1000)}:f> (<t:${~~(nextBoostDateTemp / 1000)}:R>)`,
                            inline: false
                        },
                        {
                            name: ' Nível atual',
                            value: `${emoji} ${convertBoostLevel(boost)}`,
                            inline: true
                        },
                        {
                            name: ' Próximo Nível',
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
                                name: 'Maior Cargo:',
                                value: `${member.roles.cache.sort((a, b) => b.position - a.position).first()}`,
                                inline: false
                            },
                            {
                                name: `Permissões de ${membro.username}`,
                                value: `${permsArray.join(', ')}`
                            }
                        )


                    const m = await interaction.reply({ embeds: [embed], components: [btn1], fetchReply: true })

                    const collector = m.createMessageComponentCollector({ time: 10 * 60000 });


                    collector.on('collect', async (i) => {

                        if (i.user.id != interaction.user.id) return i.reply({ content: `> \`-\` <a:alerta:1163274838111162499> Essa interação e somente do: ${user}\n> \`-\` Utilize \`\`/user info\`\` para vizualizar seu perfil.`, ephemeral: true })

                        i.deferUpdate()
                        switch (i.customId) {


                            case `avatar`:
                                m.edit({ embeds: [avatar], components: [btn2] })
                                break;

                            case `inicial`:
                                m.edit({ embeds: [embed], components: [btn1] })
                                break;


                            case `banner`:
                                m.edit({ embeds: [banner], components: [btn2] })
                                break;

                            case `verPerms`:
                                m.edit({ embeds: [embedPerms], components: [btn2] })
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
                                name: 'Maior Cargo:',
                                value: `${member.roles.cache.sort((a, b) => b.position - a.position).first()}`,
                                inline: false
                            },
                            {
                                name: `Permissões de ${membro.username}`,
                                value: `${permsArray.join(', ')}`
                            }
                        )


                    let avatar = new discord.EmbedBuilder()
                        .setImage(AvatarUser)
                        .setColor("#41b2b0")

                    const m = await interaction.reply({ embeds: [embed], components: [btn3], fetchReply: true })



                    const collector = m.createMessageComponentCollector({ time: 10 * 60000 });


                    collector.on('collect', async (i) => {

                        if (i.user.id != interaction.user.id) return i.reply({ content: `> \`-\` <a:alerta:1163274838111162499> Essa interação e somente do: ${user}\n> \`-\` Utilize \`\`/user info\`\` para vizualizar seu perfil.`, ephemeral: true })

                        i.deferUpdate()
                        switch (i.customId) {


                            case `avatar`:
                                m.edit({ embeds: [avatar], components: [btn2] })
                                break;


                            case `inicial`:
                                m.edit({ embeds: [embed], components: [btn3] })
                                break;


                            case `verPerms`:
                                m.edit({ embeds: [embedPerms], components: [btn2] })
                                break;

                            case `fechar`:
                        }
                    })
                }



            } else if (userData.user.premiumSince) {

                const {
                    user: { globalName: userDataNameGlobal, premiumSince: nitroData },
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

                if (badgesArrayUser.includes('Nitro')) list.push("Nitro")
                if (badgesArrayUser.includes('BoostLevel1')) list.push("BoostLevel1")
                if (badgesArrayUser.includes('BoostLevel2')) list.push("BoostLevel2")
                if (badgesArrayUser.includes('BoostLevel3')) list.push("BoostLevel3")
                if (badgesArrayUser.includes('BoostLevel4')) list.push("BoostLevel4")
                if (badgesArrayUser.includes('BoostLevel5')) list.push("BoostLevel5")
                if (badgesArrayUser.includes('BoostLevel6')) list.push("BoostLevel6")
                if (badgesArrayUser.includes('BoostLevel7')) list.push("BoostLevel7")
                if (badgesArrayUser.includes('BoostLevel8')) list.push("BoostLevel8")
                if (badgesArrayUser.includes('BoostLevel9')) list.push("BoostLevel9")
                if (badgesArrayUser.includes('HypeSquadOnlineHouse1')) list.push("HypeSquadOnlineHouse1")
                if (badgesArrayUser.includes('HypeSquadOnlineHouse2')) list.push("HypeSquadOnlineHouse2")
                if (badgesArrayUser.includes('HypeSquadOnlineHouse3')) list.push("HypeSquadOnlineHouse3")
                if (badgesArrayUser.includes('ActiveDeveloper')) list.push("ActiveDeveloper")//desenvolvedor ativo
                if (badgesArrayUser.includes('PremiumEarlySupporter')) list.push("PremiumEarlySupporter")//apoiador inicial
                if (badgesArrayUser.includes('VerifiedDeveloper')) list.push("VerifiedDeveloper")//desenvolvedor verificado de bots pioneiro
                if (badgesArrayUser.includes('CertifiedModerator')) list.push("CertifiedModerator")//ex moderador do discord
                if (badgesArrayUser.includes('VerifiedBot')) list.push("VerifiedBot")//bot verificado
                if (badgesArrayUser.includes('ApplicationCommandBadge')) list.push("ApplicationCommandBadge") //compativel com comandos
                if (badgesArrayUser.includes('ApplicationAutoModerationRuleCreateBadge')) list.push("ApplicationAutoModerationRuleCreateBadge") //usa autoMod



                if (!user.discriminator || user.discriminator === 0 || user.tag === `${user.username}#0`) {
                    list.push("TAG")
                }

                list = list
                    .join(",")
                    //Badges NITRO
                    .replace("Nitro", "<:discordnitro:1178827913106305024>")
                    .replace("BoostLevel1", "<:discordboost1:1178527220474576957>")
                    .replace("BoostLevel2", "<:discordboost2:1178527223683240006>")
                    .replace("BoostLevel3", "<:discordboost3:1178527224832466965>")
                    .replace("BoostLevel4", "<:discordboost4:1178527227730739210>")
                    .replace("BoostLevel5", "<:discordboost5:1178527229391675472>")
                    .replace("BoostLevel6", "<:discordboost6:1178527232260579430>")
                    .replace("BoostLevel7", "<:discordboost7:1178527233791504454>")
                    .replace("BoostLevel8", "<:discordboost8:1178527236211617874>")
                    .replace("BoostLevel9", "<:discordboost9:1178527237734137916>")
                    //Badges USER
                    .replace("HypeSquadOnlineHouse1", `<:hypesquadbravery:1178528159503757443>`)
                    .replace("HypeSquadOnlineHouse2", `<:hypesquadbrilliance:1178528160711716934>`)
                    .replace("HypeSquadOnlineHouse3", `<:hypesquadbalance:1178528157368852480>`)
                    .replace("ActiveDeveloper", `<:activedeveloper:1178827904889667744>`)
                    .replace("PremiumEarlySupporter", `<:discordearlysupporter:1178827909683744788>`)
                    .replace("VerifiedDeveloper", `<:discordbotdev:1178827908391915622>`)
                    .replace("CertifiedModerator", `<:discordmod:1178827911667646544>`)
                    .replace("TAG", `<:username:1161109720870948884>`)
                    //Badges BOT
                    .replace("VerifiedBot", `<:VerifiedBot:1178828214039236668>`)
                    .replace("ApplicationCommandBadge", `<:supportscommands:1178827914603659336>`)
                    .replace("ApplicationAutoModerationRuleCreateBadge", `<:automod:1178827907095875604>`)

                const permsObj = {
                    CreateInstantInvite: '\`Criar convite instantâneo\`',
                    KickMembers: '\`Expulsar membros\`',
                    BanMembers: '\`Banir membros\`',
                    Administrator: '\`Administrador\`',
                    ManageChannels: '\`Gerenciar canais\`',
                    ManageGuild: '\`Gerenciar servidor\`',
                    AddReactions: '\`Adicionar reações\`',
                    ViewAuditLog: '\`Ver registro de auditoria\`',
                    PrioritySpeaker: '\`Voz Prioritária\`',
                    Stream: '\`Ao vivo\`',
                    ViewChannel: '\`Ver canais\`',
                    SendMessages: '\`Enviar mensagens\`',
                    SendTTSMessages: '\`Enviar mensagens em tts\`',
                    ManageMessages: '\`Gerenciar mensagens\`',
                    EmbedLinks: '\`Enviar links\`',
                    AttachFiles: '\`Enviar anexos\`',
                    ReadMessageHistory: '\`Ver histórico de mensagens\`',
                    MentionEveryone: '\`Mencionar everyone e cargos\`',
                    UseExternalEmojis: '\`Usar emojis externos\`',
                    UseExternalStickers: '\`Usar figurinhas externas\`',
                    ViewGuildInsights: '\`Ver análises do servidor\`',
                    Connect: "\`Conectar em call's\`",
                    Speak: `\`Falar em call's\``,
                    MuteMembers: `\`Mutar membros\``,
                    DeafenMembers: `\`Ensurdecer membros\``,
                    MoveMembers: `\`Mover membros\``,
                    UseVAD: `\`Utilizar detecção de voz\``,
                    ChangeNickname: `\`Alterar apelido\``,
                    ManageNicknames: `\`Gerenciar apelidos\``,
                    ManageRoles: `\`Gerenciar cargos\``,
                    ManageWebhooks: `\`Gerenciar webhooks\``,
                    ManageEmojisAndStickers: `\`Gerenciar emojis e figurinhas\``,
                    UseApplicationCommands: `\`Utilizar comandos slashs (/)\``,
                    RequestToSpeak: `\`Pedir para falar\``,
                    ManageEvents: `\`Gerenciar eventos\``,
                    ManageThreads: `\`Gerenciar threads\``,
                    CreatePublicThreads: `\`Criar threads públicas\``,
                    CreatePrivateThreads: `\`Criar threads privadas\``,
                    SendMessagesInThreads: `\`Falar em threads\``,
                    UseEmbeddedActivities: `\`Iniciar atividades\``,
                    ModerateMembers: `\`Gerenciar moderação do servidor\``
                }


                let btn1 = new discord.ActionRowBuilder().addComponents([

                    new discord.ButtonBuilder()
                        .setStyle("Primary")
                        .setLabel("Avatar")
                        .setCustomId("avatar"),

                    new discord.ButtonBuilder()
                        .setStyle("Secondary")
                        .setLabel("Banner")
                        .setCustomId("banner"),

                    new discord.ButtonBuilder()
                        .setLabel('Permissões do Membro')
                        .setEmoji("<:9081settings:1167219166898557029>")
                        .setStyle("Success")
                        .setCustomId('verPerms')

                ]);

                let btn2 = new discord.ActionRowBuilder().addComponents([

                    new discord.ButtonBuilder()
                        .setStyle("Secondary")
                        .setLabel("Pagina inicial")
                        .setCustomId("inicial"),

                ])

                let btn3 = new discord.ActionRowBuilder().addComponents([

                    new discord.ButtonBuilder()
                        .setStyle("Primary")
                        .setLabel("Avatar")
                        .setCustomId("avatar"),

                    new discord.ButtonBuilder()
                        .setLabel('Permissões do Membro')
                        .setEmoji("<:9081settings:1167219166898557029>")
                        .setStyle("Success")
                        .setCustomId('verPerms')
                ])


                const embed = new discord.EmbedBuilder()
                    .setColor("#41b2b0")
                    .setTitle(`${list.split(",").join(" ")}`)
                    .setAuthor({ name: `${userDataNameGlobal}` })
                    .setThumbnail(AvatarUser)
                    .setFooter({ text: `Sobre mim: ${descricaoUsuario}` })
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
                            name: '<:crvt:1179215960754896977> Data de criação da conta',
                            value: `<t:${~~Math.ceil(member.user.createdTimestamp / 1000)}> (<t:${~~(member.user.createdTimestamp / 1000)}:R>)`,
                            inline: false
                        },
                        {
                            name: '<:crvt:1179215962839453817> Entrou em',
                            value: `<t:${~~(user.joinedTimestamp / 1000)}:f> (<t:${~~(user.joinedTimestamp / 1000)}:R>)`,
                            inline: false
                        },
                        {
                            name: '<:discordnitro:1178827913106305024> Assinante Nitro desde',
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
                                name: 'Maior Cargo:',
                                value: `${member.roles.cache.sort((a, b) => b.position - a.position).first()}`,
                                inline: false
                            },
                            {
                                name: `Permissões de ${membro.username}`,
                                value: `${permsArray.join(', ')}`
                            }
                        )


                    const m = await interaction.reply({ embeds: [embed], components: [btn1], fetchReply: true })

                    const collector = m.createMessageComponentCollector({ time: 10 * 60000 });


                    collector.on('collect', async (i) => {

                        if (i.user.id != interaction.user.id) return i.reply({ content: `> \`-\` <a:alerta:1163274838111162499> Essa interação e somente do: ${user}\n> \`-\` Utilize \`\`/user info\`\` para vizualizar seu perfil.`, ephemeral: true })

                        i.deferUpdate()
                        switch (i.customId) {


                            case `avatar`:
                                m.edit({ embeds: [avatar], components: [btn2] })
                                break;

                            case `inicial`:
                                m.edit({ embeds: [embed], components: [btn1] })
                                break;


                            case `banner`:
                                m.edit({ embeds: [banner], components: [btn2] })
                                break;

                            case `verPerms`:
                                m.edit({ embeds: [embedPerms], components: [btn2] })
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
                                name: 'Maior Cargo:',
                                value: `${member.roles.cache.sort((a, b) => b.position - a.position).first()}`,
                                inline: false
                            },
                            {
                                name: `Permissões de ${membro.username}`,
                                value: `${permsArray.join(', ')}`
                            }
                        )


                    let avatar = new discord.EmbedBuilder()
                        .setImage(AvatarUser)
                        .setColor("#41b2b0")
                    const m = await interaction.reply({ embeds: [embed], components: [btn3], fetchReply: true })



                    const collector = m.createMessageComponentCollector({ time: 10 * 60000 });


                    collector.on('collect', async (i) => {

                        if (i.user.id != interaction.user.id) return i.reply({ content: `> \`-\` <a:alerta:1163274838111162499> Essa interação e somente do: ${user}\n> \`-\` Utilize \`\`/user info\`\` para vizualizar seu perfil.`, ephemeral: true })

                        i.deferUpdate()
                        switch (i.customId) {


                            case `avatar`:
                                m.edit({ embeds: [avatar], components: [btn2] })
                                break;


                            case `inicial`:
                                m.edit({ embeds: [embed], components: [btn3] })
                                break;


                            case `verPerms`:
                                m.edit({ embeds: [embedPerms], components: [btn2] })
                                break;

                            case `fechar`:
                        }
                    })
                }



            } else {

                const {
                    user: { globalName: userDataNameGlobal, },
                    profile: { badgesArray: badgesArrayUser, aboutMe: sobreMim, bannerUrl: userBanner },
                } = userData;


                let descricaoUsuario = sobreMim
                if (sobreMim == null) descricaoUsuario = "⠀⠀"

                if (badgesArrayUser.includes('Nitro')) list.push("Nitro")
                if (badgesArrayUser.includes('BoostLevel1')) list.push("BoostLevel1")
                if (badgesArrayUser.includes('BoostLevel2')) list.push("BoostLevel2")
                if (badgesArrayUser.includes('BoostLevel3')) list.push("BoostLevel3")
                if (badgesArrayUser.includes('BoostLevel4')) list.push("BoostLevel4")
                if (badgesArrayUser.includes('BoostLevel5')) list.push("BoostLevel5")
                if (badgesArrayUser.includes('BoostLevel6')) list.push("BoostLevel6")
                if (badgesArrayUser.includes('BoostLevel7')) list.push("BoostLevel7")
                if (badgesArrayUser.includes('BoostLevel8')) list.push("BoostLevel8")
                if (badgesArrayUser.includes('BoostLevel9')) list.push("BoostLevel9")
                if (badgesArrayUser.includes('HypeSquadOnlineHouse1')) list.push("HypeSquadOnlineHouse1")
                if (badgesArrayUser.includes('HypeSquadOnlineHouse2')) list.push("HypeSquadOnlineHouse2")
                if (badgesArrayUser.includes('HypeSquadOnlineHouse3')) list.push("HypeSquadOnlineHouse3")
                if (badgesArrayUser.includes('ActiveDeveloper')) list.push("ActiveDeveloper")//desenvolvedor ativo
                if (badgesArrayUser.includes('PremiumEarlySupporter')) list.push("PremiumEarlySupporter")//apoiador inicial
                if (badgesArrayUser.includes('VerifiedDeveloper')) list.push("VerifiedDeveloper")//desenvolvedor verificado de bots pioneiro
                if (badgesArrayUser.includes('CertifiedModerator')) list.push("CertifiedModerator")//ex moderador do discord
                if (badgesArrayUser.includes('VerifiedBot')) list.push("VerifiedBot")//bot verificado
                if (badgesArrayUser.includes('ApplicationCommandBadge')) list.push("ApplicationCommandBadge") //compativel com comandos
                if (badgesArrayUser.includes('ApplicationAutoModerationRuleCreateBadge')) list.push("ApplicationAutoModerationRuleCreateBadge") //usa autoMod



                if (!user.discriminator || user.discriminator === 0 || user.tag === `${user.username}#0`) {
                    list.push("TAG")
                }


                list = list
                    .join(",")
                    //Badges NITRO
                    .replace("Nitro", "<:discordnitro:1178827913106305024>")
                    .replace("BoostLevel1", "<:discordboost1:1178527220474576957>")
                    .replace("BoostLevel2", "<:discordboost2:1178527223683240006>")
                    .replace("BoostLevel3", "<:discordboost3:1178527224832466965>")
                    .replace("BoostLevel4", "<:discordboost4:1178527227730739210>")
                    .replace("BoostLevel5", "<:discordboost5:1178527229391675472>")
                    .replace("BoostLevel6", "<:discordboost6:1178527232260579430>")
                    .replace("BoostLevel7", "<:discordboost7:1178527233791504454>")
                    .replace("BoostLevel8", "<:discordboost8:1178527236211617874>")
                    .replace("BoostLevel9", "<:discordboost9:1178527237734137916>")
                    //Badges USER
                    .replace("HypeSquadOnlineHouse1", `<:hypesquadbravery:1178528159503757443>`)
                    .replace("HypeSquadOnlineHouse2", `<:hypesquadbrilliance:1178528160711716934>`)
                    .replace("HypeSquadOnlineHouse3", `<:hypesquadbalance:1178528157368852480>`)
                    .replace("ActiveDeveloper", `<:activedeveloper:1178827904889667744>`)
                    .replace("PremiumEarlySupporter", `<:discordearlysupporter:1178827909683744788>`)
                    .replace("VerifiedDeveloper", `<:discordbotdev:1178827908391915622>`)
                    .replace("CertifiedModerator", `<:discordmod:1178827911667646544>`)
                    .replace("TAG", `<:username:1161109720870948884>`)
                    //Badges BOT
                    .replace("VerifiedBot", `<:VerifiedBot:1178828214039236668>`)
                    .replace("ApplicationCommandBadge", `<:supportscommands:1178827914603659336>`)
                    .replace("ApplicationAutoModerationRuleCreateBadge", `<:automod:1178827907095875604>`)


                const permsObj = {
                    CreateInstantInvite: '\`Criar convite instantâneo\`',
                    KickMembers: '\`Expulsar membros\`',
                    BanMembers: '\`Banir membros\`',
                    Administrator: '\`Administrador\`',
                    ManageChannels: '\`Gerenciar canais\`',
                    ManageGuild: '\`Gerenciar servidor\`',
                    AddReactions: '\`Adicionar reações\`',
                    ViewAuditLog: '\`Ver registro de auditoria\`',
                    PrioritySpeaker: '\`Voz Prioritária\`',
                    Stream: '\`Ao vivo\`',
                    ViewChannel: '\`Ver canais\`',
                    SendMessages: '\`Enviar mensagens\`',
                    SendTTSMessages: '\`Enviar mensagens em tts\`',
                    ManageMessages: '\`Gerenciar mensagens\`',
                    EmbedLinks: '\`Enviar links\`',
                    AttachFiles: '\`Enviar anexos\`',
                    ReadMessageHistory: '\`Ver histórico de mensagens\`',
                    MentionEveryone: '\`Mencionar everyone e cargos\`',
                    UseExternalEmojis: '\`Usar emojis externos\`',
                    UseExternalStickers: '\`Usar figurinhas externas\`',
                    ViewGuildInsights: '\`Ver análises do servidor\`',
                    Connect: "\`Conectar em call's\`",
                    Speak: `\`Falar em call's\``,
                    MuteMembers: `\`Mutar membros\``,
                    DeafenMembers: `\`Ensurdecer membros\``,
                    MoveMembers: `\`Mover membros\``,
                    UseVAD: `\`Utilizar detecção de voz\``,
                    ChangeNickname: `\`Alterar apelido\``,
                    ManageNicknames: `\`Gerenciar apelidos\``,
                    ManageRoles: `\`Gerenciar cargos\``,
                    ManageWebhooks: `\`Gerenciar webhooks\``,
                    ManageEmojisAndStickers: `\`Gerenciar emojis e figurinhas\``,
                    UseApplicationCommands: `\`Utilizar comandos slashs (/)\``,
                    RequestToSpeak: `\`Pedir para falar\``,
                    ManageEvents: `\`Gerenciar eventos\``,
                    ManageThreads: `\`Gerenciar threads\``,
                    CreatePublicThreads: `\`Criar threads públicas\``,
                    CreatePrivateThreads: `\`Criar threads privadas\``,
                    SendMessagesInThreads: `\`Falar em threads\``,
                    UseEmbeddedActivities: `\`Iniciar atividades\``,
                    ModerateMembers: `\`Gerenciar moderação do servidor\``
                }


                let btn1 = new discord.ActionRowBuilder().addComponents([

                    new discord.ButtonBuilder()
                        .setStyle("Primary")
                        .setLabel("Avatar")
                        .setCustomId("avatar"),

                    new discord.ButtonBuilder()
                        .setStyle("Secondary")
                        .setLabel("Banner")
                        .setCustomId("banner"),

                    new discord.ButtonBuilder()
                        .setLabel('Permissões do Membro')
                        .setEmoji("<:9081settings:1167219166898557029>")
                        .setStyle("Success")
                        .setCustomId('verPerms')

                ]);

                let btn2 = new discord.ActionRowBuilder().addComponents([

                    new discord.ButtonBuilder()
                        .setStyle("Secondary")
                        .setLabel("Pagina inicial")
                        .setCustomId("inicial"),

                ])

                let btn3 = new discord.ActionRowBuilder().addComponents([

                    new discord.ButtonBuilder()
                        .setStyle("Primary")
                        .setLabel("Avatar")
                        .setCustomId("avatar"),

                    new discord.ButtonBuilder()
                        .setLabel('Permissões do Membro')
                        .setEmoji("<:9081settings:1167219166898557029>")
                        .setStyle("Success")
                        .setCustomId('verPerms')
                ])

                const embed = new discord.EmbedBuilder()
                    .setColor("#41b2b0")
                    .setTitle(`${list.split(",").join(" ")}`)
                    .setAuthor({ name: `${userDataNameGlobal}` })
                    .setThumbnail(AvatarUser)
                    .setFooter({ text: `Sobre mim: ${descricaoUsuario}` })
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
                            name: '<:crvt:1179215960754896977> Data de criação da conta',
                            value: `<t:${~~Math.ceil(member.user.createdTimestamp / 1000)}> (<t:${~~(member.user.createdTimestamp / 1000)}:R>)`,
                            inline: false
                        },
                        {
                            name: '<:crvt:1179215962839453817> Entrou em',
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
                                name: 'Maior Cargo:',
                                value: `${member.roles.cache.sort((a, b) => b.position - a.position).first()}`,
                                inline: false
                            },
                            {
                                name: `Permissões de ${membro.username}`,
                                value: `${permsArray.join(', ')}`
                            }
                        )


                    const m = await interaction.reply({ embeds: [embed], components: [btn1], fetchReply: true })

                    const collector = m.createMessageComponentCollector({ time: 10 * 60000 });


                    collector.on('collect', async (i) => {

                        if (i.user.id != interaction.user.id) return i.reply({ content: `> \`-\` <a:alerta:1163274838111162499> Essa interação e somente do: ${user}\n> \`-\` Utilize \`\`/user info\`\` para vizualizar seu perfil.`, ephemeral: true })

                        i.deferUpdate()
                        switch (i.customId) {


                            case `avatar`:
                                m.edit({ embeds: [avatar], components: [btn2] })
                                break;

                            case `inicial`:
                                m.edit({ embeds: [embed], components: [btn1] })
                                break;


                            case `banner`:
                                m.edit({ embeds: [banner], components: [btn2] })
                                break;

                            case `verPerms`:
                                m.edit({ embeds: [embedPerms], components: [btn2] })
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
                                name: 'Maior Cargo:',
                                value: `${member.roles.cache.sort((a, b) => b.position - a.position).first()}`,
                                inline: false
                            },
                            {
                                name: `Permissões de ${membro.username}`,
                                value: `${permsArray.join(', ')}`
                            }
                        )


                    let avatar = new discord.EmbedBuilder()
                        .setImage(AvatarUser)
                        .setColor("#41b2b0")
                    const m = await interaction.reply({ embeds: [embed], components: [btn3], fetchReply: true })

                    const collector = m.createMessageComponentCollector({ time: 10 * 60000 });
                    collector.on('collect', async (i) => {

                        if (i.user.id != interaction.user.id) return i.reply({ content: `> \`-\` <a:alerta:1163274838111162499> Essa interação e somente do: ${user}\n> \`-\` Utilize \`\`/user info\`\` para vizualizar seu perfil.`, ephemeral: true })

                        i.deferUpdate()
                        switch (i.customId) {

                            case `avatar`:
                                m.edit({ embeds: [avatar], components: [btn2] })
                                break;


                            case `inicial`:
                                m.edit({ embeds: [embed], components: [btn3] })
                                break;


                            case `verPerms`:
                                m.edit({ embeds: [embedPerms], components: [btn2] })
                                break;

                            case `fechar`:
                        }
                    })
                }
            }
        }
        else
            if (interaction.channel.id !== cmd1) { interaction.reply({ content: `> \`-\` <a:alerta:1163274838111162499> Você estar tentando usar um comando no canal de texto errado, tente utiliza-lo no canal de <#${cmd1}>.`, ephemeral: true }) }
    }
}


