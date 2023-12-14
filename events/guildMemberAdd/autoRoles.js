const discord = require("discord.js")
const client = require('../../index')
const autorole = require("../../database/models/autorole")
const idioma = require("../../database/models/language")


client.on("guildMemberAdd", async (member) => {

    let lang = await idioma.findOne({
        guildId: interaction.guild.id
    })
    lang = lang ? require(`../../languages/${lang.language}.js`) : require('../../languages/pt.js')


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
            member.send(`${lang.alertPermissãoBot}`)
        }
    } else {
        console.log("> \`-\` <a:alerta:1163274838111162499> O bot NÃO tem permissão para gerenciar funções (ManageRoles).")
    }
})
