const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ComponentType, ApplicationCommandType } = require("discord.js");
const comandos = require("../../database/models/comandos");
const idioma = require("../../database/models/language");

module.exports = {
    name: "badges",
    description: "Veja todas as insígnias que os membros possuem neste servidor",
    type: ApplicationCommandType.ChatInput,

    run: async (client, interaction) => {
        let lang = await idioma.findOne({ guildId: interaction.guild.id });
        lang = lang ? require(`../../languages/${lang.language}.js`) : require('../../languages/pt.js');

        const cmd = await comandos.findOne({ guildId: interaction.guild.id });

        if (!cmd) {
            return interaction.reply({ content: `${lang.alertCommandos}`, ephemeral: true });
        }

        const cmd1 = cmd.canal1;
        if (!cmd1 || !client.channels.cache.get(cmd1) || cmd1 === interaction.channel.id) {
            let counts = {};

            // Contando as insígnias dos membros
            for (const member of interaction.guild.members.cache.values()) {
                const user = await client.users.fetch(member.user.id);
                const badges = user.flags?.toArray() || [];
                badges.forEach(badge => counts[badge] = (counts[badge] || 0) + 1);
            }



            function generateBadgeDescription(counts) {
                return `
                <:discordstaff:1282352857273864223> Discord Staff: \`${counts['Staff'] || 0}\`
                <:discordpartner:1282353010231738511> Partner: \`${counts['Partner'] || 0}\`
                <:certifiedmoderator:1282353057816121515> Certified Moderator: \`${counts['CertifiedModerator'] || 0}\`
                <:HypeSquadEvents:1282353106063196242> HypeSquad Events: \`${counts['Hypesquad'] || 0}\`
                <:HypeSquadBravery:1282353144805851238> HypeSquad Bravery: \`${counts['HypeSquadOnlineHouse1'] || 0}\`
                <:HypeSquadBrilliance:1282353194625925170> HypeSquad Brilliance: \`${counts['HypeSquadOnlineHouse2'] || 0}\`
                <:HypeSquadBalance:1282353224929509505> HypeSquad Balance: \`${counts['HypeSquadOnlineHouse3'] || 0}\`
                <:BugHunter:1282353259738169365> Bug Hunter: \`${counts['BugHunterLevel1'] || 0}\`
                <:BugHunterGold:1282353295607992411> Bug Hunter Gold: \`${counts['BugHunterLevel2'] || 0}\`
                <:ActiveDeveloper:1282353335319527536> Active Developer: \`${counts['ActiveDeveloper'] || 0}\`
                <:EarlyVerifiedBotDeveloper:1282353381851140136> Early Verified Bot Developer: \`${counts['VerifiedDeveloper'] || 0}\`
                <:EarlySupporter:1282353409990852731> Early Supporter: \`${counts['PremiumEarlySupporter'] || 0}\`
                <:verifiedbot:1282353437362618501> Bot Verificado: \`${counts['VerifiedBot'] || 0}\``
            }


            // Criando embed de exibição das insígnias
            const embed1 = new EmbedBuilder()
                .setColor("#ba68c8")
                .setAuthor({ name: `Badges - ${interaction.guild.name}`, iconURL: client.user.displayAvatarURL() })
                .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                .setDescription(generateBadgeDescription(counts))

            const menu = new StringSelectMenuBuilder()
                .setCustomId("badges")
                .setPlaceholder("Badges")
                .addOptions(
                    Object.entries(counts).map(([key, value]) => ({
                        label: `${key} (${value})`,
                        emoji: getEmojiForBadge(key), // Adicione uma função para obter o emoji correto
                        value: key,
                    }))
                );

            const row = new ActionRowBuilder().addComponents(menu);

            const msg = await interaction.reply({ embeds: [embed1], components: [row] });

            // Coletor para interações com o menu de seleção
            const collector = msg.createMessageComponentCollector({ componentType: ComponentType.StringSelect });

            collector.on('collect', async (interaction) => {
                const badgeType = interaction.values[0];
                const members = interaction.guild.members.cache
                    .filter(member => member.user.flags?.toArray().includes(badgeType))
                    .map(member => member.user.username);

                const description = members.length > 0
                    ? `${lang.msg156}\n\n> ${members.join('\n> ')}`
                    : lang.msg155;

                const embed = new EmbedBuilder()
                    .setColor("#ba68c8")
                    .setTitle(`${getEmojiForBadge(badgeType)} ${badgeType} (${counts[badgeType] || 0})`)
                    .setDescription(description);

                await interaction.reply({ embeds: [embed], ephemeral: true });
                
            });
        } else {
            interaction.reply({ content: `${lang.alertCanalErrado} <#${cmd1}>.`, ephemeral: true });
        }
    },
};

function getEmojiForBadge(badge) {
    const badgeEmojis = {
        'Staff': '<:discordstaff:1282352857273864223>',
        'Partner': '<:discordpartner:1282353010231738511>',
        'CertifiedModerator': '<:certifiedmoderator:1282353057816121515>',
        'Hypesquad': '<:HypeSquadEvents:1282353106063196242>',
        'HypeSquadOnlineHouse1': '<:HypeSquadBravery:1282353144805851238>',
        'HypeSquadOnlineHouse2': '<:HypeSquadBrilliance:1282353194625925170>',
        'HypeSquadOnlineHouse3': '<:HypeSquadBalance:1282353224929509505>',
        'BugHunterLevel1': '<:BugHunter:1282353259738169365>',
        'BugHunterLevel2': '<<:BugHunterGold:1282353295607992411>',
        'ActiveDeveloper': '<:ActiveDeveloper:1282353335319527536>',
        'VerifiedDeveloper': '<:EarlyVerifiedBotDeveloper:1282353381851140136>',
        'PremiumEarlySupporter': '<:EarlySupporter:1282353409990852731>',
        'VerifiedBot': '<:verifiedbot:1282353437362618501>',
    };
    return badgeEmojis[badge] || '❓'; // Retorna um emoji padrão caso o badge não esteja mapeado
}