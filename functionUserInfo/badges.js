function getBadgeEmoji(badge) {
    switch (badge) {
        case 'Nitro':
            return '<:discordnitro:1178827913106305024>';
        case 'BoostLevel1':
            return '<:discordboost1:1178527220474576957>';
        case 'BoostLevel2':
            return '<:discordboost2:1178527223683240006>';
        case 'BoostLevel3':
            return '<:discordboost3:1178527224832466965>';
        case 'BoostLevel4':
            return '<:discordboost4:1178527227730739210>';
        case 'BoostLevel5':
            return '<:discordboost5:1178527229391675472>';
        case 'BoostLevel6':
            return '<:discordboost6:1178527232260579430>';
        case 'BoostLevel7':
            return '<:discordboost7:1178527233791504454>';
        case 'BoostLevel8':
            return '<:discordboost8:1178527236211617874>';
        case 'BoostLevel9':
            return '<:discordboost9:1178527237734137916>';
        case 'HypeSquadOnlineHouse1':
            return '<:hypesquadbravery:1178528159503757443>';
        case 'HypeSquadOnlineHouse2':
            return '<:hypesquadbrilliance:1178528160711716934>';
        case 'HypeSquadOnlineHouse3':
            return '<:hypesquadbalance:1178528157368852480>';
        case 'ActiveDeveloper':
            return '<:activedeveloper:1178827904889667744>';
        case 'PremiumEarlySupporter':
            return '<:discordearlysupporter:1178827909683744788>';
        case 'VerifiedDeveloper':
            return '<:discordbotdev:1178827908391915622>';
        case 'CertifiedModerator':
            return '<:discordmod:1178827911667646544>';
        case 'TAG':
            return '<:username:1161109720870948884>';
        case 'VerifiedBot':
            return '<:VerifiedBot:1178828214039236668>';
        case 'ApplicationCommandBadge':
            return '<:supportscommands:1178827914603659336>';
        case 'ApplicationAutoModerationRuleCreateBadge':
            return '<:automod:1178827907095875604>';
        case 'Hypesquad':
            return '<:hypesquadevents:1193268727970549851>';
        case 'BugHunterLevel1':
            return '<:BugHunterLevel1:1193268762577731696>';
        case 'BugHunterLevel2':
            return '<:BugHunterLevel2:1193268813295255672>';
        case 'BugHunterLevel3':
            return '<:BugHunterLevel3:1193268971693166683>';
        default:
            return '';
    }
}

function getFormattedBadge(badge) {
    return getBadgeEmoji(badge)
}

function hasBadge(badgesArrayUser, badge) {
    return badgesArrayUser.includes(badge)
}


function formatBadge(badge) {
    const badgeEmojis = {
        'HypeSquadOnlineHouse1': '<:hypesquadbravery:1178528159503757443>',
        'HypeSquadOnlineHouse2': '<:hypesquadbrilliance:1178528160711716934>',
        'HypeSquadOnlineHouse3': '<:hypesquadbalance:1178528157368852480>',
        'ActiveDeveloper': '<:activedeveloper:1178827904889667744>',
        'PremiumEarlySupporter': '<:discordearlysupporter:1178827909683744788>',
        'VerifiedDeveloper': '<:discordbotdev:1178827908391915622>',
        'CertifiedModerator': '<:discordmod:1178827911667646544>',
        'TAG': '<:username:1161109720870948884>',
        'VerifiedBot': '<:VerifiedBot:1178828214039236668>',
        'ApplicationCommandBadge': '<:supportscommands:1178827914603659336>',
        'ApplicationAutoModerationRuleCreateBadge': '<:automod:1178827907095875604>',
        'Hypesquad': "<:hypesquadevents:1193268727970549851>",
        'BugHunterLevel1': "<:BugHunterLevel1:1193268762577731696>",
        'BugHunterLevel2': "<:BugHunterLevel2:1193268813295255672>",
        'BugHunterLevel3': "<:BugHunterLevel3:1193268971693166683>",
    };

    return badgeEmojis[badge] || '';
}


module.exports = {
    getBadgeEmoji,
    getFormattedBadge,
    hasBadge,
    formatBadge,
}