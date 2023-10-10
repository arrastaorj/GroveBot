const discord = require("discord.js")
const client = require('../../index')
const autorole = require("../../database/models/autorole")


client.on("guildMemberAdd", async (member) => {

    const addRoles = await autorole.findOne({
        guildId: member.guild.id
    })

    if (!addRoles) return

    const botMember = member.guild.members.cache.get(client.user.id)
    const hasPermission = botMember.permissions.has("ManageRoles")

    if (hasPermission) {
        if (addRoles.cargo1Id) {
            member.roles.add(addRoles.cargo1Id)
        }
        if (addRoles.cargo2Id) {
            member.roles.add(addRoles.cargo2Id)
        }
        if (addRoles.cargo3Id) {
            member.roles.add(addRoles.cargo3Id)
        }
        if (addRoles.cargo4Id) {
            member.roles.add(addRoles.cargo4Id)
        }
        if (addRoles.cargo5Id) {
            member.roles.add(addRoles.cargo5Id)
        }
    } else {
        console.log("O bot NÃO tem permissão para gerenciar funções (ManageRoles).")
    }
})

