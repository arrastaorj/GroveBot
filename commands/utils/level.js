const discord = require("discord.js")
const comandos = require("../../database/models/comandos")
const Level = require('../../database/models/level')
const calculateLevelXp = require('../../plugins/calculateLevelXp')
const { createCanvas, loadImage, registerFont } = require('canvas')
const canvas = require("canvas")

registerFont("./fonts/CODE.otf", { family: "CODE" })

module.exports = {
    name: "level",
    description: "Exibe o level de um usuário no servidor.",
    type: discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "user",
            type: discord.ApplicationCommandOptionType.User,
            description: "Selecione o usuário que deseja ver o level.",
            required: false
        },
    ],


    run: async (client, interaction, args) => {


        const cmd = await comandos.findOne({
            guildId: interaction.guild.id
        })

        if (!cmd) return interaction.reply({ content: `> \`-\` Um Adminitrador ainda não configurou o canal para uso de comandos!`, ephemeral: true })

        let cmd1 = cmd.canal1

        if (cmd1 === null || cmd1 === false || !client.channels.cache.get(cmd1) || cmd1 === interaction.channel.id) {


            let mentionedUserId = interaction.options.getUser('user') || interaction.user

            let targetUserId = mentionedUserId.id

            const targetUserObj = await interaction.guild.members.fetch(targetUserId)


            const fetchedLevel = await Level.findOne({
                userId: targetUserId,
                guildId: interaction.guild.id,
            })

            if (!fetchedLevel) {
                interaction.reply({
                    content:
                        mentionedUserId
                            ? `> \`-\` ${targetUserObj.user.tag} ainda não tem níveis. Tente novamente quando ele conversarem um pouco mais.`
                            : "> \`-\` Você ainda não tem nenhum nível. Converse mais um pouco e tente novamente.",
                    ephemeral: true
                })
                return
            }

            let allLevels = await Level.find({
                guildId: interaction.guild.id
            }).select('-_id userId level xp')

            allLevels.sort((a, b) => {
                if (a.level === b.level) {
                    return b.xp - a.xp
                } else {
                    return b.level - a.level
                }
            })

            let currentRank = allLevels.findIndex((lvl) => lvl.userId === targetUserId) + 1


            const canvas = createCanvas(800, 200),
                ctx = canvas.getContext('2d'),
                bar_width = 600,
                bg = await loadImage("https://raw.githubusercontent.com/arrastaorj/flags/main/x3Zs9BS.png"),
                av = await loadImage(interaction.user.displayAvatarURL({ extension: 'png', dynamic: false }))

            ctx.drawImage(bg, 0, 0, canvas.width, canvas.height)


            // XP Bar
            ctx.lineJoin = "round"
            ctx.lineWidth = 30

            // Sombra da barra xp
            ctx.strokeRect(30, 170, bar_width, 0)

            // barra vazia
            ctx.strokeStyle = "white"
            ctx.strokeRect(30, 170, bar_width, 0)

            // Barra Preenchida
            ctx.strokeStyle = "#41b2b0"
            ctx.strokeRect(30, 170, bar_width * fetchedLevel.xp / calculateLevelXp(fetchedLevel.level), 0)

            // Adicionando nome de usuário
            ctx.font = "bold 25px Sans"
            ctx.fillStyle = "white" // Username color
            ctx.textAlign = "left"
            ctx.fillText(targetUserObj.user.tag, 150, 70, 200)

            // Adicionando estatísticas
            ctx.font = "bold 25px Sans"
            ctx.fillText("#" + currentRank, 740, 40, 80)
            ctx.fillText(fetchedLevel.level, 230, 130, 80)

            // Adicionando títulos 
            ctx.fillStyle = "white"
            ctx.font = "bold 25px Sans"
            ctx.fillText("Rank:", 665, 40, 200)
            ctx.fillText("Level:", 150, 130, 200)

            // Adicionando título da barra
            ctx.fillStyle = "white"
            ctx.font = "bold 25px Sans"
            ctx.fillText(`XP: ${fetchedLevel.xp}/${calculateLevelXp(fetchedLevel.level)}`, 300, 130)
            // ctx.fillText(`${((xp * 100) / reqXP).toFixed(0)}/100 %`, 350, 158)



            // Adicione o avatar

            ctx.beginPath()
            ctx.arc(80, 85, 48, 0, Math.PI * 2, true)
            ctx.strokeStyle = "#41b2b0"
            ctx.stroke()

            ctx.save()
            await loadImage(targetUserObj.user.displayAvatarURL({ extension: 'png', dynamic: false })).then(async (i) => {
                ctx.beginPath()
                ctx.arc(80, 85, 60, 0, Math.PI * 2)
                ctx.clip()
                ctx.drawImage(i, 20, 25, 130, 130)
            })
            ctx.restore()


            const at = new discord.AttachmentBuilder(canvas.toBuffer(), "rank.png")

            interaction.reply({ files: [at] })
        }

        else

            if (interaction.channel.id !== cmd1) { interaction.reply({ content: `> \`-\` Você estar tentando usar um comando no canal de texto errado, tente utiliza-lo no canal de <#${cmd1}>.`, ephemeral: true }) }

    }
}