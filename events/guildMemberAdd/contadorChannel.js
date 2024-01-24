const client = require('../../index')
const CounterModel = require("../../database/models/counter")


client.on('guildMemberAdd', async (member) => {

    await updateDatabase(member.guild)
    await updateChannels(member.guild)

})
client.on('guildMemberRemove', async (member) => {

    await updateDatabase(member.guild)
    await updateChannels(member.guild)
})


async function updateChannels(guild) {
    const counter = await CounterModel.findOne({
        guildId: guild.id
    })

    if (!counter) {
        return
    }


    const members = await guild.members.fetch()
    const stats = [members.size, members.filter(member => member.user.bot).size, members.filter(member => !member.user.bot).size]

    const userChannel = guild.channels.cache.get(counter.userChannel)
    const memberChannel = guild.channels.cache.get(counter.memberChannel)
    const botChannel = guild.channels.cache.get(counter.botChannel)

    if (userChannel && userChannel.type === 2) {
        const newName = userChannel.name.replace(/\d+/, stats[0])
        await userChannel.setName(newName)
    }

    if (memberChannel && memberChannel.type === 2) {
        const newName = memberChannel.name.replace(/\d+/, stats[2])
        await memberChannel.setName(newName)
    }

    if (botChannel && botChannel.type === 2) {
        const newName = botChannel.name.replace(/\d+/, stats[1])
        await botChannel.setName(newName)
    }
}


async function updateDatabase(guild) {

    const members = await guild.members.fetch()
    const stats = [members.size, members.filter(member => member.user.bot).size, members.filter(member => !member.user.bot).size]

    let counter = await CounterModel.findOne({
        guildId: guild.id
    })

    if (!counter) {
        return
    } else {
        await CounterModel.findOneAndUpdate({
            guildId: guild.id
        }, {
            users: `${stats[0]}`,
            bots: `${stats[1]}`,
            members: `${stats[2]}`
        })
    }
}