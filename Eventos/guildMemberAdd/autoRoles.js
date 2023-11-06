const discord = require("discord.js")
const client = require('../../index')
const autorole = require("../../database/models/autorole")

client.on("guildMemberAdd", async (member) => {

    const addRoles = await autorole.findOne({
        guildId: member.guild.id
    })

    if (!addRoles) return

    const botMember = member.guild.members.cache.get(client.user.id)
    const hasPermission = botMember.permissions.has("MANAGE_ROLES")

    if (hasPermission) {
        try {
            if (addRoles.cargo1Id) {
                await member.roles.add(addRoles.cargo1Id)
            }
            if (addRoles.cargo2Id) {
                await member.roles.add(addRoles.cargo2Id)
            }
            if (addRoles.cargo3Id) {
                await member.roles.add(addRoles.cargo3Id)
            }
            if (addRoles.cargo4Id) {
                await member.roles.add(addRoles.cargo4Id)
            }
            if (addRoles.cargo5Id) {
                await member.roles.add(addRoles.cargo5Id)
            }
        } catch (error) {
            member.send("> \`-\` <a:alerta:1163274838111162499> Peço desculpas por não poder adicionar seu cargo automaticamente, pois não tenho as permissões necessárias. Recomendo que entre em contato com o administrador do servidor ou acesse nosso servidor de suporte e abra um ticket para obter assistência.");
        }
    } else {
        console.log("> \`-\` <a:alerta:1163274838111162499> O bot NÃO tem permissão para gerenciar funções (ManageRoles).")
    }
})
