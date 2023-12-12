const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ComponentType, ApplicationCommandType } = require("discord.js")
const comandos = require("../../database/models/comandos")
const idioma = require("../../database/models/language")

module.exports = {
    name: "badges",
    description: "Veja todas as insígnias que os membros possuem neste servidor",
    type: ApplicationCommandType.ChatInput,

    run: async (client, interaction) => {

        let lang = await idioma.findOne({
            guildId: interaction.guild.id
        })
        lang = lang ? require(`../../languages/${lang.language}.js`) : require('../../languages/pt.js')


        const cmd = await comandos.findOne({
            guildId: interaction.guild.id
        })

        if (!cmd) return interaction.reply({
            content: `${lang.alertCommandos}`,
            ephemeral: true
        })

        let cmd1 = cmd.canal1

        if (cmd1 === null || cmd1 === false || !client.channels.cache.get(cmd1) || cmd1 === interaction.channel.id) {


            let badges = []
            let counts = {}

            for (const member of interaction.guild.members.cache.values()) {
                const user = await client.users.fetch(member.user.id)
                badges = badges.concat(user.flags?.toArray())
            }

            for (const badge of badges) {
                if (counts[badge]) {
                    counts[badge]++
                } else {
                    counts[badge] = 1
                }
            }


            let embed1 = new EmbedBuilder()
                .setColor("#6dfef2")
                .setAuthor({ name: `Badges - ${interaction.guild.name}`, iconURL: client.user.displayAvatarURL() })
                .setThumbnail(`${interaction.guild.iconURL({ dynamic: true })}`)
                .setDescription(`<:1769discordstaff:1157876972031053984> Discord Staff: \`${counts['Staff'] || 0}\`
            <:9928discordpartnerbadge:1157876829596684370> Partner: \`${counts['Partner'] || 0}\`
            <:3446blurplecertifiedmoderator:1157876139151331349> Certified Moderator: \`${counts['CertifiedModerator'] || 0}\`
            <:7606badgehypesquadevents:1157876137347788830> HypeSquad Events: \`${counts['Hypesquad'] || 0}\`
            <:6601hypesquadbravery:1061274089609760908> HypeSquad Bravery: \`${counts['HypeSquadOnlineHouse1'] || 0}\`
            <:6936hypesquadbrilliance:1061274087193854042> HypeSquad Brilliance: \`${counts['HypeSquadOnlineHouse2'] || 0}\`
            <:5242hypesquadbalance:1061274091623034881> HypeSquad Balance: \`${counts['HypeSquadOnlineHouse3'] || 0}\`
            <:4744bughunterbadgediscord:1157875129309724772> Bug Hunter: \`${counts['BugHunterLevel1'] || 0}\`
            <:1692bughunter:1157875132048605234> Bug Hunter Gold: \`${counts['BugHunterLevel2'] || 0}\`
            <:7011activedeveloperbadge:1061277829255413781> Active Developer: \`${counts['ActiveDeveloper'] || 0}\`
            <:Early_Verified_Bot_Developer:1063599974098665592> Early Verified Bot Developer: \`${counts['VerifiedDeveloper'] || 0}\`
            <:Early_Supporter:1063599098135060590> Early Supporter: \`${counts['PremiumEarlySupporter'] || 0}\``)

            const row = new ActionRowBuilder()

            const menu = new StringSelectMenuBuilder()
                .setCustomId("badges")
                .setPlaceholder("Badges")
                .setOptions(
                    {
                        label: `Discord Staff (${counts['Staff'] || 0})`,
                        emoji: "<:1769discordstaff:1157876972031053984>",
                        value: "Staff",
                    },
                    {
                        label: `Partner (${counts['Partner'] || 0})`,
                        emoji: "<:9928discordpartnerbadge:1157876829596684370>",
                        value: "Partner",
                    },
                    {
                        label: `Certified Moderator (${counts['CertifiedModerator'] || 0})`,
                        emoji: "<:3446blurplecertifiedmoderator:1157876139151331349>",
                        value: "CertifiedModerator",
                    },
                    {
                        label: `HypeSquad Events (${counts['Hypesquad'] || 0})`,
                        emoji: "<:7606badgehypesquadevents:1157876137347788830>",
                        value: "Hypesquad",
                    },
                    {
                        label: `HypeSquad Bravery (${counts['HypeSquadOnlineHouse1'] || 0})`,
                        emoji: "<:6601hypesquadbravery:1061274089609760908>",
                        value: "HypeSquadOnlineHouse1",
                    },
                    {
                        label: `HypeSquad Brilliance (${counts['HypeSquadOnline2'] || 0})`,
                        emoji: "<:6936hypesquadbrilliance:1061274087193854042>",
                        value: "HypeSquadOnlineHouse2",
                    },
                    {
                        label: `HypeSquad Balance (${counts['HypeSquadOnlineHouse3'] || 0})`,
                        emoji: "<:5242hypesquadbalance:1061274091623034881>",
                        value: "HypeSquadOnlineHouse3"
                    },
                    {
                        label: `Bug Hunter (${counts['BugHunterLevel1'] || 0})`,
                        emoji: "<:4744bughunterbadgediscord:1157875129309724772>",
                        value: "BugHunterLevel1",
                    },
                    {
                        label: `Bug Hunter Gold (${counts['BugHunterLevel2'] || 0})`,
                        emoji: "<:1692bughunter:1157875132048605234>",
                        value: "BugHunterLevel2",
                    },
                    {
                        label: `Active Developer (${counts['ActiveDeveloper'] || 0})`,
                        emoji: "<:7011activedeveloperbadge:1061277829255413781>",
                        value: "ActiveDeveloper",
                    },
                    {
                        label: `Early Verified Bot Developer (${counts['VerifiedDeveloper'] || 0})`,
                        emoji: "<:Early_Verified_Bot_Developer:1063599974098665592>",
                        value: `VerifiedDeveloper`,
                    },
                    {
                        label: `Early Supporter (${counts['PremiumEarlySupporter'] || 0})`,
                        emoji: `<:Early_Supporter:1063599098135060590>`,
                        value: `PremiumEarlySupporter`,
                    }
                )

            row.addComponents(menu)

            const msg = await interaction.reply({ embeds: [embed1], components: [row] })

            let collector = msg.createMessageComponentCollector({ componentType: ComponentType.StringSelect })

            collector.on('collect', async (interaction) => {
                let check = interaction.values[0]
                interaction.message.edit()

                let members = []
                await interaction.guild.members.cache.forEach(async member => {
                    if (member.user.flags.toArray().includes(check)) members.push(member)
                })

                if (members.length == 0) members.push(`${lang.msg155}`)

                if (check === "Staff") {

                    let embed_staff = new EmbedBuilder()
                        .setColor("Blurple")
                        .setTitle(`<:1769discordstaff:1157876972031053984> Discord Staff (${counts['Staff'] || 0})`)
                        .setDescription(`${lang.msg156} \n\n> ${members.join('\n> ')}`)

                    return interaction.reply({ embeds: [embed_staff], ephemeral: true })

                }
                if (check === "Partner") {

                    let embed_partner = new EmbedBuilder()
                        .setColor("Blurple")
                        .setTitle(`<:9928discordpartnerbadge:1157876829596684370> Partner (${counts['Partner'] || 0})`)
                        .setDescription(`${lang.msg156} \n\n> ${members.join('\n> ')}`)

                    return interaction.reply({ embeds: [embed_partner], ephemeral: true })

                }
                if (check === "CertifiedModerator") {

                    let embed_moderator = new EmbedBuilder()
                        .setColor("Orange")
                        .setTitle(`<:3446blurplecertifiedmoderator:1157876139151331349> Certified Moderator (${counts['CertifiedModerator'] || 0})`)
                        .setDescription(`${lang.msg156} \n\n> ${members.join('\n> ')}`)

                    return interaction.reply({ embeds: [embed_moderator], ephemeral: true })
                }
                if (check === "Hypesquad") {

                    let embed_hypesquad = new EmbedBuilder()
                        .setColor("Gold")
                        .setTitle(`<:7606badgehypesquadevents:1157876137347788830> HypeSquad Events (${counts['Hypesquad'] || 0})`)
                        .setDescription(`${lang.msg156} \n\n> ${members.join('\n> ')}`)

                    return interaction.reply({ embeds: [embed_hypesquad], ephemeral: true })
                }
                if (check === "HypeSquadOnlineHouse1") {

                    let embed_bravery = new EmbedBuilder()
                        .setColor("Purple")
                        .setTitle(`<:6601hypesquadbravery:1061274089609760908> HypeSquad Bravery (${counts['HypeSquadOnlineHouse1'] || 0})`)
                        .setDescription(`${lang.msg156} \n\n> ${members.join('\n> ')}`)

                    return interaction.reply({ embeds: [embed_bravery], ephemeral: true })
                }
                if (check === "HypeSquadOnlineHouse2") {

                    let embed_brilliance = new EmbedBuilder()
                        .setColor("#f17a65")
                        .setTitle(`<:6936hypesquadbrilliance:1061274087193854042> HypeSquad Brilliance (${counts['HypeSquadOnlineHouse2'] || 0})`)
                        .setDescription(`${lang.msg156} \n\n> ${members.join('\n> ')}`)

                    return interaction.reply({ embeds: [embed_brilliance], ephemeral: true })
                }
                if (check === "HypeSquadOnlineHouse3") {

                    let embed_balance = new EmbedBuilder()
                        .setColor("#42d0b9")
                        .setTitle(`<:5242hypesquadbalance:1061274091623034881> HypeSquad Balance (${counts['HypeSquadOnlineHouse3'] || 0})`)
                        .setDescription(`${lang.msg156} \n\n> ${members.join('\n> ')}`)

                    return interaction.reply({ embeds: [embed_balance], ephemeral: true })
                }
                if (check === "BugHunterLevel1") {

                    let embed_bug1 = new EmbedBuilder()
                        .setColor("Green")
                        .setTitle(`<:4744bughunterbadgediscord:1157875129309724772> Bug Hunter (${counts['BugHunterLevel1'] || 0})`)
                        .setDescription(`${lang.msg156} \n\n> ${members.join('\n> ')}`)

                    return interaction.reply({ embeds: [embed_bug1], ephemeral: true })
                }
                if (check === "BugHunterLevel2") {

                    let embed_bug2 = new EmbedBuilder()
                        .setColor("Gold")
                        .setTitle(`<:1692bughunter:1157875132048605234> Bug Hunter Gold (${counts['BugHunterLevel2'] || 0})`)
                        .setDescription(`${lang.msg156} \n\n> ${members.join('\n> ')}`)

                    return interaction.reply({ embeds: [embed_bug2], ephemeral: true })
                }
                if (check === "ActiveDeveloper") {

                    let embed_active_dev = new EmbedBuilder()
                        .setColor("#2da864")
                        .setTitle(`<:7011activedeveloperbadge:1061277829255413781> Active Developer (${counts['ActiveDeveloper'] || 0})`)
                        .setDescription(`${lang.msg156} \n\n> ${members.join('\n> ')}`)

                    return interaction.reply({ embeds: [embed_active_dev], ephemeral: true })
                }
                if (check === "VerifiedDeveloper") {

                    let embed_verified_developer = new EmbedBuilder()
                        .setColor("Blurple")
                        .setTitle(`<:Early_Verified_Bot_Developer:1063599974098665592> Early Verified Bot Developer (${counts['VerifiedDeveloper'] || 0})`)
                        .setDescription(`${lang.msg156} \n\n> ${members.join('\n> ')}`)

                    return interaction.reply({ embeds: [embed_verified_developer], ephemeral: true })
                }
                if (check === "PremiumEarlySupporter") {

                    let embed_verified_developer = new EmbedBuilder()
                        .setColor("Blurple")
                        .setTitle(`<:Early_Supporter:1063599098135060590> Early Supporter (${counts['PremiumEarlySupporter'] || 0})`)
                        .setDescription(`${lang.msg156} \n\n> ${members.join('\n> ')}`)

                    return interaction.reply({ embeds: [embed_verified_developer], ephemeral: true })
                }
            })
        }
        else if (interaction.channel.id !== cmd1) {
            interaction.reply({
                content: `${lang.alertCanalErrado} <#${cmd1}>.`,
                ephemeral: true
            })
        }
    }
}