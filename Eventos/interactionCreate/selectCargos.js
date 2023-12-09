const client = require('../../index')
const discord = require("discord.js")
const cargos = require("../../database/models/cargos")
const idioma = require("../../database/models/language")

client.on("interactionCreate", async (interaction) => {
    const { options, guild, member, customId, message } = interaction

    let lang = await idioma.findOne({
        guildId: interaction.guild.id
    })

    if (!lang || !lang.language) {
        lang = { language: client.language };
    }
    lang = require(`../../languages/${lang.language}.js`)


    if (interaction.customId === "select2") {

        const teste = await cargos.find({
            guildId: interaction.guild.id
        })

        const found = teste.find(c => c.msgID === message.id)

        if (found) {

            const cargo = await cargos.findOne({
                msgID: found.msgID
            })

            if (!cargo) {
                return interaction.reply({
                    content: `${lang.alertPermissãoBot}`,
                    ephemeral: true
                })
            } else {

                try {

                    let channel = client.channels.cache.get(cargo.logsId)

                    const cargoIds = [
                        cargo.cargo1Id,
                        cargo.cargo2Id,
                        cargo.cargo3Id,
                        cargo.cargo4Id,
                        cargo.cargo5Id,
                        cargo.cargo6Id,
                        cargo.cargo7Id,
                        cargo.cargo8Id,
                        cargo.cargo9Id,
                        cargo.cargo10Id
                    ]

                    const filteredCargoIds = cargoIds.filter(cargoId => cargoId !== undefined)

                    const cargos = [
                        "cargo1",
                        "cargo2",
                        "cargo3",
                        "cargo4",
                        "cargo5",
                        "cargo6",
                        "cargo7",
                        "cargo8",
                        "cargo9",
                        "cargo10"
                    ]

                    const cargoMapping = {}
                    cargos.forEach((cargo, index) => {
                        const role = interaction.guild.roles.cache.get(filteredCargoIds[index])
                        cargoMapping[cargo] = role || false
                    })


                    const { values } = interaction
                    const list = values.filter(value => cargos.includes(value))

                    const rolesToAdd = list
                        .map(value => cargoMapping[value])
                        .filter(role => role)

                    const rolesToRemove = cargos
                        .filter(cargo => !list.includes(cargo))
                        .map(value => cargoMapping[value])
                        .filter(role => role)

                    const currentRoles = member.roles.cache
                    const rolesToAddCheck = rolesToAdd.filter(role => !currentRoles.has(role.id))
                    const rolesToRemoveCheck = rolesToRemove.filter(role => currentRoles.has(role.id))


                    let logsAdd = new discord.EmbedBuilder()
                        .setDescription(` ${interaction.member} **${lang.msg254}** \n\n> \`+\` ${rolesToAddCheck.join("\n> \`+\` ")}`)
                        .setTimestamp()
                        .setColor('13F000')
                        .setFooter({ text: `${interaction.member.user.username}`, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })

                    let logsRemove = new discord.EmbedBuilder()
                        .setDescription(` ${interaction.member} **${lang.msg255}** \n\n> \`-\` ${rolesToRemoveCheck.join("\n> \`-\` ")}`)
                        .setTimestamp()
                        .setColor('E61919')
                        .setFooter({ text: `${interaction.member.user.username}`, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })

                    let LogsAddUser = new discord.EmbedBuilder()
                        .setDescription(`**${lang.msg256}** \n\n> \`+\` ${rolesToAddCheck.join("\n> \`+\` ")}`)
                        .setTimestamp()
                        .setColor('13F000')
                        .setFooter({ text: `${interaction.member.user.username}`, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })

                    let logsRemoveUser = new discord.EmbedBuilder()
                        .setDescription(`**${lang.msg257}** \n\n> \`-\` ${rolesToRemoveCheck.join("\n> \`-\` ")}`)
                        .setTimestamp()
                        .setColor('E61919')
                        .setFooter({ text: `${interaction.member.user.username}`, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })


                    if (rolesToAddCheck.length > 0) {
                        await member.roles.add(rolesToAddCheck)
                        channel.send({ embeds: [logsAdd] })
                        return interaction.reply({ embeds: [LogsAddUser], ephemeral: true })
                    }
                    if (rolesToRemoveCheck.length > 0) {
                        await member.roles.remove(rolesToRemoveCheck)
                        channel.send({ embeds: [logsRemove] })
                        return interaction.reply({ embeds: [logsRemoveUser], ephemeral: true })
                    }

                    return interaction.reply({ content: `${lang.msg258}`, ephemeral: true })

                } catch (error) {

                    return interaction.reply({ content: `${lang.alertPermissãoBot}`, ephemeral: true })
                }
            }
        } else {

            return interaction.reply({ content: `${lang.alertPermissãoBot}`, ephemeral: true })

        }
    }
})