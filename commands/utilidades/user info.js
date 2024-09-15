const discord = require("discord.js");
const comandos = require("../../database/models/comandos.js")
const badgesModule = require('../../functionUserInfo/badges.js')
const badgeFormatter = require('../../functionUserInfo/badges.js')
const idioma = require("../../database/models/language.js")

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

            const userDataResponse = await fetch(`https://groveapi.squareweb.app/user/${user.id}`);
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
                    BoostLevel1: 'boost1:1284902479854571610',
                    BoostLevel2: 'boost2:1284902501346312396',
                    BoostLevel3: 'boost3:1284902527560847381',
                    BoostLevel4: 'boost4:1284902546137157784',
                    BoostLevel5: 'boost5:1284902568044134551',
                    BoostLevel6: 'boost6:1284902586146619473',
                    BoostLevel7: 'boost7:1284902603519430670',
                    BoostLevel8: 'boost8:1284902623199105096',
                    BoostLevel9: 'boost9:1284902642526584852',
                };

                return emojiMap[boostLevel] ? `<:${emojiMap[boostLevel]}>` : '❌';
            }

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
                    name: '<:user:1284903902545711136> Tag',
                    value: `\`\`\`${member.user.tag}\`\`\``,
                    inline: true
                },
                {
                    name: '<:id:1284903920019308604> ID',
                    value: `\`\`\`${member.user.id}\`\`\``,
                    inline: true
                },
                {
                    name: `<:data1:1284903946045100145> ${lang.msg233}`,
                    value: `<t:${~~Math.ceil(member.user.createdTimestamp / 1000)}> (<t:${~~(member.user.createdTimestamp / 1000)}:R>)`,
                    inline: false
                },
                {
                    name: `<:data2:1284903970426323014> ${lang.msg234}`,
                    value: `<t:${~~(user.joinedTimestamp / 1000)}:f> (<t:${~~(user.joinedTimestamp / 1000)}:R>)`,
                    inline: false
                }
            );

            // Adiciona o campo relacionado ao Nitro Boost apenas se a data de boost existir
            if (boostDateTemp) {
                embed.addFields({
                    name: `<:nitro:1284902411894521876> ${lang.msg235}`,
                    value: `<t:${~~(boostDateTemp / 1000)}:f> (<t:${~~(boostDateTemp / 1000)}:R>)`,
                    inline: false
                });
            }

            // Adiciona o campo relacionado ao próximo Boost apenas se a data existir
            if (nextBoostDateTemp) {
                embed.addFields({
                    name: `<:impusona:1284903567034941571> ${lang.msg236}`,
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


            interaction.editReply({ embeds: [embed] });
        }




        else if (interaction.channel.id !== cmd1) {
            interaction.reply({
                content: `${lang.alertCanalErrado} <#${cmd1}>.`,
                ephemeral: true
            })
        }
    }
}