const discord = require("discord.js")
const Canvas = require('canvas')
const Utils = require("../../plugins/Util")
const { registerFont } = require("canvas")

registerFont("././fonts/florida.otf", { family: "florida" })
registerFont("././fonts/up.otf", { family: "up" })
registerFont("././fonts/sd.ttf", { family: "sd" })
registerFont("././fonts/aAkhirTahun.ttf", { family: "aAkhirTahun" })

const processUserBadges = require('../../functionUserInfo/returnApi')
const comandos = require("../../database/models/comandos")
const perfilID = require("../../database/models/perfil")
const Level = require('../../database/models/level')
const repUser = require('../../database/models/rep')
const sobre = require('../../database/models/sobre')
const skin = require("../../database/models/skin")
const User = require('../../database/models/economia')
const idioma = require("../../database/models/language")

module.exports = {
    name: "perfil",
    description: "Veja o perfil exclusivo na Lexa",
    type: discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "usuario",
            type: discord.ApplicationCommandOptionType.User,
            description: "Mencione o usuário que deseja ver o perfil.",
            required: false
        },
    ],

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
            try {

                await interaction.deferReply({ fetchReply: true })

                const user = interaction.options.getUser("usuario") || interaction.user


                let btn = new discord.ActionRowBuilder().addComponents([
                    new discord.ButtonBuilder()
                        .setStyle(discord.ButtonStyle.Secondary)
                        .setLabel("Skins")
                        .setEmoji("<:diamond_5253785:1162581880047140925>")
                        .setCustomId("sk"),
                    new discord.ButtonBuilder()
                        .setStyle(discord.ButtonStyle.Secondary)
                        .setLabel(`${lang.msg189}`)
                        .setEmoji("<:pencil_3214372:1162580535139373097>")
                        .setCustomId("sms"),
                ])


                let btnn = new discord.ActionRowBuilder().addComponents([
                    new discord.ButtonBuilder()
                        .setStyle(discord.ButtonStyle.Secondary)
                        .setEmoji("<:voltar:1167104944420175984>")
                        .setCustomId("volta"),
                    new discord.ButtonBuilder()
                        .setStyle(discord.ButtonStyle.Success)
                        .setLabel(`${lang.msg190}`)
                        //.setEmoji("<:enviar:1065758776348647495>")
                        .setCustomId("confirma"),
                    new discord.ButtonBuilder()
                        .setStyle(discord.ButtonStyle.Secondary)
                        .setEmoji("<:info:1167105337648742553>")
                        .setCustomId("info"),

                ])


                let btnn2 = new discord.ActionRowBuilder().addComponents([
                    new discord.ButtonBuilder()
                        .setStyle(discord.ButtonStyle.Secondary)
                        .setEmoji("<:voltar:1167104944420175984>")
                        .setCustomId("volta2"),
                    new discord.ButtonBuilder()
                        .setStyle(discord.ButtonStyle.Success)
                        .setLabel(`${lang.msg190}`)
                        .setCustomId("confirma2"),
                    new discord.ButtonBuilder()
                        .setStyle(discord.ButtonStyle.Secondary)
                        .setEmoji("<:info:1167105337648742553>")
                        .setCustomId("info2"),
                ])

                let btnn3 = new discord.ActionRowBuilder().addComponents([
                    new discord.ButtonBuilder()
                        .setStyle(discord.ButtonStyle.Secondary)
                        .setEmoji("<:voltar:1167104944420175984>")
                        .setCustomId("volta3"),
                    new discord.ButtonBuilder()
                        .setStyle(discord.ButtonStyle.Success)
                        .setLabel(`${lang.msg190}`)
                        .setCustomId("confirma3"),
                    new discord.ButtonBuilder()
                        .setStyle(discord.ButtonStyle.Secondary)
                        .setEmoji("<:info:1167105337648742553>")
                        .setCustomId("info3"),
                ])

                let btnn4 = new discord.ActionRowBuilder().addComponents([
                    new discord.ButtonBuilder()
                        .setStyle(discord.ButtonStyle.Secondary)
                        .setEmoji("<:voltar:1167104944420175984>")
                        .setCustomId("volta4"),
                    new discord.ButtonBuilder()
                        .setStyle(discord.ButtonStyle.Secondary)
                        .setEmoji("<:info:1167105337648742553>")
                        .setCustomId("info4"),
                ])

                let btnn5 = new discord.ActionRowBuilder().addComponents([
                    new discord.ButtonBuilder()
                        .setStyle(discord.ButtonStyle.Secondary)
                        .setEmoji("<:voltar:1167104944420175984>")
                        .setCustomId("volta5"),
                    new discord.ButtonBuilder()
                        .setStyle(discord.ButtonStyle.Success)
                        .setLabel(`${lang.msg190}`)
                        .setCustomId("confirma5"),
                    new discord.ButtonBuilder()
                        .setStyle(discord.ButtonStyle.Secondary)
                        .setEmoji("<:info:1167105337648742553>")
                        .setCustomId("info5"),
                ])


                let btnn6 = new discord.ActionRowBuilder().addComponents([
                    new discord.ButtonBuilder()
                        .setStyle(discord.ButtonStyle.Secondary)
                        .setEmoji("<:voltar:1167104944420175984>")
                        .setCustomId("volta6"),
                    new discord.ButtonBuilder()
                        .setStyle(discord.ButtonStyle.Success)
                        .setLabel(`${lang.msg190}`)
                        .setCustomId("confirma6"),
                    new discord.ButtonBuilder()
                        .setStyle(discord.ButtonStyle.Secondary)
                        .setEmoji("<:info:1167105337648742553>")
                        .setCustomId("info6"),
                ])

                let btnn7 = new discord.ActionRowBuilder().addComponents([
                    new discord.ButtonBuilder()
                        .setStyle(discord.ButtonStyle.Secondary)
                        .setEmoji("<:voltar:1167104944420175984>")
                        .setCustomId("volta7"),
                    new discord.ButtonBuilder()
                        .setStyle(discord.ButtonStyle.Success)
                        .setLabel(`${lang.msg190}`)
                        .setCustomId("confirma7"),
                    new discord.ButtonBuilder()
                        .setStyle(discord.ButtonStyle.Secondary)
                        .setEmoji("<:info:1167105337648742553>")
                        .setCustomId("info7"),
                ])


                let verific = new discord.ActionRowBuilder().addComponents([
                    new discord.ButtonBuilder()
                        .setStyle(discord.ButtonStyle.Secondary)
                        .setEmoji("<:voltar:1167104944420175984>")
                        .setCustomId("voltaa"),
                    new discord.ButtonBuilder()
                        .setStyle(discord.ButtonStyle.Secondary)
                        .setLabel(`${lang.msg191}`)
                        .setCustomId("nao")
                        .setDisabled(true),
                    new discord.ButtonBuilder()
                        .setStyle(discord.ButtonStyle.Secondary)
                        .setEmoji("<:info:1167105337648742553>")
                        .setCustomId("infoVerif")
                        .setDisabled(false),
                ])


                const modal = new discord.ModalBuilder()
                    .setCustomId('sm')
                    .setTitle(`${lang.msg192}`)
                    .setComponents(
                        new discord.ActionRowBuilder().setComponents(
                            new discord.TextInputBuilder()
                                .setCustomId('sobremim')
                                .setLabel(`${lang.msg193}`)
                                .setMaxLength(337)
                                .setMinLength(1)
                                .setStyle(discord.TextInputStyle.Paragraph)
                        )
                    )

                let painel = new discord.ActionRowBuilder().addComponents(new discord.StringSelectMenuBuilder()
                    .setCustomId('menu')
                    .setPlaceholder(`${lang.msg194}`)
                    .addOptions([
                        {
                            label: 'Minecraft',
                            description: 'Minecraft Defaut',
                            emoji: "<:epica:1167121548226854944>",
                            value: 'mc',
                        },
                        {
                            label: 'League of Legends',
                            description: 'Sett Defaut',
                            emoji: "<:epica:1167121548226854944>",
                            value: 'sett',
                        },
                        {
                            label: 'League of Legends',
                            description: 'Vayne Arco Celeste',
                            emoji: "<:epica:1167121548226854944>",
                            value: 'vayne',
                        },
                        {
                            label: 'League of Legends',
                            description: 'SoulFighter',
                            emoji: "<:lendaria:1167123019752280114>",
                            value: 'soulfighter',
                        },
                        {
                            label: 'Valorant',
                            description: 'Jett',
                            emoji: "<:lendaria:1167123019752280114>",
                            value: 'jett',
                        },
                        {
                            label: 'Valorant',
                            description: 'Razer E KillJoy',
                            emoji: "<:lendaria:1167123019752280114>",
                            value: 'RazerekillJoy',
                        },
                    ])
                )





                const cmd2 = await perfilID.findOne({
                    guildId: interaction.guild.id,
                    userId: user.id,

                })

                let foto = ""

                if (cmd2 === null) {

                    foto = "././img/shop/default.png"
                } else { foto = cmd2.Img1 }



                let chave = {}
                chave.create = Canvas.createCanvas(900, 600)
                chave.context = chave.create.getContext('2d')
                chave.context.font = '68px tagihan'
                chave.context.fillStyle = '#F8F8FF'

                await Canvas.loadImage(foto).then(async (img) => {
                    chave.context.drawImage(img, 0, 0, 900, 600)
                    chave.context.textAlign = "left"
                    chave.context.font = '37px "aAkhirTahun"'
                    chave.context.fillText(`${user.username.toUpperCase()}`, 270, 210)


                    chave.context.save()
                    await Canvas.loadImage(user.displayAvatarURL({ extension: 'png', size: 1024 })).then(async (interaction) => {
                        chave.context.beginPath()

                        const centerX = 154 - 4 // Coordenada X do centro do círculo deslocada 4 pixels para a esquerda
                        const centerY = 150 + 2 // Coordenada Y do centro do círculo deslocada 2 pixels para baixo
                        const clipRadius = 115  // Raio do círculo de recorte (originalmente 115)
                        const imageWidth = clipRadius * 2
                        const imageHeight = clipRadius * 2
                        const imageX = centerX - clipRadius
                        const imageY = centerY - clipRadius

                        // Desenha o círculo de recorte
                        chave.context.arc(centerX, centerY, clipRadius, 0, Math.PI * 2)
                        chave.context.clip()

                        // Desenha a imagem dentro do círculo de recorte com o tamanho ajustado
                        chave.context.drawImage(interaction, imageX, imageY, imageWidth, imageHeight)

                        // Desenha a borda branca ao redor do círculo de recorte
                        chave.context.lineWidth = 5 // Espessura da linha
                        chave.context.strokeStyle = '101216' // Cor da borda
                        chave.context.beginPath()
                        chave.context.arc(centerX, centerY, clipRadius, 0, Math.PI * 2)
                        chave.context.stroke()

                    })
                    chave.context.restore()



                    Saldo = ""
                    const money2 = await User.findOne({
                        guildId: interaction.guild.id,
                        userId: user.id,
                    })

                    if (money2 === null) {
                        Saldo = 0
                    } else { Saldo = money2.saldo }

                    chave.context.font = '50px "up"'
                    chave.context.fillText(`${Saldo.toLocaleString()}`, 120, 400)



                    lvl = ""
                    const fetchedLevel = await Level.findOne({
                        guildId: interaction.guild.id,
                        userId: user.id,
                    })
                    if (fetchedLevel === null) {
                        lvl = 0
                    } else { lvl = fetchedLevel.level }

                    chave.context.font = '50px "up"'
                    chave.context.fillText(`${lvl}`, 245, 470)
                    chave.context.textAlign = "center"
                    chave.context.font = '45px "up"'



                    rep = ""
                    const userRep = await repUser.findOne({
                        guildId: interaction.guild.id,
                        userId: user.id,
                    })
                    if (userRep === null) {
                        rep = 0
                    } else { rep = userRep.Rep }
                    chave.context.fillText(`${rep}`, 136, 552)



                    const cmdSobre = await sobre.findOne({
                        guildId: interaction.guild.id,
                        userId: user.id,
                    })
                    chave.context.textAlign = "left"
                    chave.context.font = '22px "up"'
                    chave.context.strokeStyle = "#a7a7a7"
                    chave.context.fillStyle = "#a7a7a7"
                    chave.context.fillText(cmdSobre == null ? `${user.username} ${lang.msg195.match(/.{1,40}/g).join("\n")}` : cmdSobre.sobreMim.match(/.{1,40}/g).join("\n"), 450, 395)
                })



                const formattedBadges = await processUserBadges(user)
                const lengthOfFormattedBadges = formattedBadges !== null ? formattedBadges.length.toString() : "";
                const formattedBadgesString = formattedBadges !== null ? formattedBadges.split(",").join(" ") : "";



                chave.context.textAlign = "right"
                chave.context.strokeStyle = '#0a0a0c'
                chave.context.fillStyle = '#0a0a0c'
                chave.context.beginPath()
                fundo = -3.7
                chave.context.roundRect(883, 226, fundo * lengthOfFormattedBadges / 2, 70, [10])
                chave.context.fill()
                chave.context.stroke()
                chave.context.textAlign = "right"
                chave.context.font = '50px "up"'


                await Utils.renderEmoji(chave.context, formattedBadgesString.split(",").join(" "), 877, 280)


                const mensagem = new discord.AttachmentBuilder(chave.create.toBuffer(), `${interaction.user.tag}.png`)

                if (interaction.user != user) {

                    interaction.editReply({
                        files: [mensagem]
                    })

                } else {


                    const m = await interaction.editReply({
                        files: [mensagem],
                        components: [btn],
                        fetchReply: true
                    })

                    const filtro = (i) => i.user.id === interaction.user.id

                    const collector = m.createMessageComponentCollector({ filtro, time: 9000000 })

                    collector.on('collect', async (i) => {

                        if (i.user != user)
                            return i.reply({
                                content: `${lang.msg196} ${user}\n${lang.msg197}`,
                                ephemeral: true
                            })


                        if (i.customId === 'sms') {

                            i.showModal(modal)

                            
                            client.on('interactionCreate', async interaction => {


                                if (!interaction.isModalSubmit()) return

                                if (interaction.customId === 'sm') {

                                    await interaction.deferUpdate()
                                    const favoriteColor = interaction.fields.getTextInputValue('sobremim')


                                    const teste5 = await sobre.findOne({
                                        guildId: interaction.guild.id,
                                        userId: user.id,
                                    })

                                    if (!teste5) {
                                        const newCmd = {
                                            guildId: interaction.guild.id,
                                            userId: user.id,
                                        }
                                        if (favoriteColor) {
                                            newCmd.sobreMim = favoriteColor
                                        }

                                        await sobre.create(newCmd)

                                    } else {

                                        if (!favoriteColor) {
                                            await sobre.findOneAndUpdate({
                                                guildId: interaction.guild.id,
                                                userId: user.id,

                                            }, { $unset: { "sobreMim": "" } })
                                        } else {
                                            await sobre.findOneAndUpdate({
                                                guildId: interaction.guild.id,
                                                userId: user.id,
                                            }, { $set: { "sobreMim": favoriteColor } })
                                        }

                                    }


                                    const cmd2 = await perfilID.findOne({
                                        guildId: interaction.guild.id,
                                        userId: user.id
                                    })

                                    let foto = ""

                                    if (cmd2 === null) {

                                        foto = "././img/shop/default.png"
                                    } else { foto = cmd2.Img1 }


                                    let chave = {}
                                    chave.create = Canvas.createCanvas(900, 600)
                                    chave.context = chave.create.getContext('2d')
                                    chave.context.font = '68px tagihan'
                                    chave.context.fillStyle = '#F8F8FF'

                                    await Canvas.loadImage(foto).then(async (img) => {
                                        chave.context.drawImage(img, 0, 0, 900, 600)
                                        chave.context.textAlign = "left"
                                        chave.context.font = '37px "aAkhirTahun"'
                                        chave.context.fillText(`${user.username.toUpperCase()}`, 270, 210)


                                        chave.context.save()
                                        await Canvas.loadImage(user.displayAvatarURL({ extension: 'png', size: 1024 })).then(async (interaction) => {
                                            chave.context.beginPath()
                                            const centerX = 154 - 4
                                            const centerY = 150 + 2
                                            const clipRadius = 115
                                            const imageWidth = clipRadius * 2
                                            const imageHeight = clipRadius * 2
                                            const imageX = centerX - clipRadius
                                            const imageY = centerY - clipRadius
                                            chave.context.arc(centerX, centerY, clipRadius, 0, Math.PI * 2)
                                            chave.context.clip()
                                            chave.context.drawImage(interaction, imageX, imageY, imageWidth, imageHeight)
                                            chave.context.lineWidth = 5
                                            chave.context.strokeStyle = '101216'
                                            chave.context.beginPath()
                                            chave.context.arc(centerX, centerY, clipRadius, 0, Math.PI * 2)
                                            chave.context.stroke()
                                        })
                                        chave.context.restore()


                                        Saldo = ""

                                        const money2 = await User.findOne({
                                            guildId: interaction.guild.id,
                                            userId: user.id,
                                        })


                                        if (money2 === null) {
                                            Saldo = 0
                                        } else { Saldo = money2.saldo }

                                        chave.context.font = '50px "up"'
                                        chave.context.fillText(`${Saldo.toLocaleString()}`, 120, 400)


                                        lvl = ""

                                        const fetchedLevel = await Level.findOne({
                                            guildId: interaction.guild.id,
                                            userId: user.id,
                                        })


                                        if (fetchedLevel === null) {
                                            lvl = 0
                                        } else { lvl = fetchedLevel.level }

                                        chave.context.font = '50px "up"'
                                        chave.context.fillText(`${lvl}`, 245, 470)

                                        chave.context.textAlign = "center"
                                        chave.context.font = '45px "up"'


                                        rep = ""

                                        const userRep = await repUser.findOne({
                                            guildId: interaction.guild.id,
                                            userId: user.id,
                                        })

                                        if (userRep === null) {
                                            rep = 0
                                        } else { rep = userRep.Rep }



                                        chave.context.fillText(`${rep}`, 136, 552)

                                        const cmdSobre = await sobre.findOne({
                                            guildId: interaction.guild.id,
                                            userId: user.id,
                                        })


                                        chave.context.textAlign = "left"
                                        chave.context.font = '22px "up"'
                                        chave.context.strokeStyle = "#a7a7a7"
                                        chave.context.fillStyle = "#a7a7a7"
                                        chave.context.fillText(cmdSobre == null ? `${user.username} ${lang.msg195.match(/.{1,40}/g).join("\n")}` : cmdSobre.sobreMim.match(/.{1,40}/g).join("\n"), 450, 395)

                                    })


                                    const formattedBadges = await processUserBadges(user)
                                    const lengthOfFormattedBadges = formattedBadges !== null ? formattedBadges.length.toString() : "";
                                    const formattedBadgesString = formattedBadges !== null ? formattedBadges.split(",").join(" ") : "";


                                    chave.context.textAlign = "right"
                                    chave.context.strokeStyle = '#0a0a0c'
                                    chave.context.fillStyle = '#0a0a0c'
                                    chave.context.beginPath()
                                    fundo = -3.7
                                    chave.context.roundRect(883, 226, fundo * lengthOfFormattedBadges / 2, 70, [10])
                                    chave.context.fill()
                                    chave.context.stroke()
                                    chave.context.textAlign = "right"
                                    chave.context.font = '50px "up"'


                                    await Utils.renderEmoji(chave.context, formattedBadgesString.split(",").join(" "), 877, 280)

                                    const mensagem2 = new discord.AttachmentBuilder(chave.create.toBuffer(), `${interaction.user.tag}.png`)

                                    await interaction.editReply({ files: [mensagem2] })



                                }

                            })


                        }

                        if (i.customId === 'sk') {

                            i.deferUpdate()

                            const mm = await interaction.editReply({ components: [painel, btnn4], ephemeral: true })
                            const filtro = (i) => i.user.id === interaction.user.id
                            const coletor = mm.createMessageComponentCollector({ filtro, time: 9000000 })


                            coletor.on('collect', async (i) => {



                                if (!i.isStringSelectMenu()) return

                                let valor = i.values[0]

                                if (i.customId === "menu") {

                                    const attachments = {
                                        mc: {
                                            path: "././img/perfil/minecraft.png",
                                            component: [painel, btnn]
                                        },
                                        sett: {
                                            path: "././img/perfil/sett.png",
                                            component: [painel, btnn2]
                                        },

                                        vayne: {
                                            path: "././img/perfil/vaynearcoceleste.png",
                                            component: [painel, btnn3]
                                        },

                                        soulfighter: {
                                            path: "././img/perfil/soulfighter.png",
                                            component: [painel, btnn5]
                                        },
                                        jett: {
                                            path: "././img/perfil/jett.png",
                                            component: [painel, btnn6]
                                        },
                                        RazerekillJoy: {
                                            path: "././img/perfil/RazerEKillJoyu.png",
                                            component: [painel, btnn7]
                                        }
                                    }

                                    const attachment = attachments[valor]
                                    if (!attachment) {
                                        console.error(`Valor inválido: ${valor}`)
                                        return
                                    }

                                    const usuarioID = i.user.id
                                    const guildID = i.guild.id
                                    const imagemComprada = attachment.path

                                    const skins = await skin.findOne({
                                        guildId: guildID,
                                        userId: usuarioID
                                    })

                                    if (skins && (
                                        skins.Img1 === imagemComprada ||
                                        skins.Img2 === imagemComprada ||
                                        skins.Img3 === imagemComprada ||
                                        skins.Img4 === imagemComprada ||
                                        skins.Img5 === imagemComprada ||
                                        skins.Img6 === imagemComprada
                                    )) {

                                        const file = new discord.AttachmentBuilder(attachment.path, `${i.user.tag}.png`)
                                        await i.update({ files: [file], components: attachment.component })

                                    } else {
                                        const file = new discord.AttachmentBuilder(attachment.path, `${i.user.tag}.png`)

                                        await i.update({ files: [file], components: [painel, verific] })

                                    }

                                }


                            })

                        }


                        async function handleConfirmaButton(customId, image, user, interaction) {
                            if (interaction.customId === customId && interaction.isButton()) {
                                const attachment = `././img/perfil/${image}.png`
                                await interaction.reply({
                                    content: `${lang.msg198}\n ${lang.msg199}`,
                                    ephemeral: true
                                })

                                const teste = await perfilID.findOne({
                                    guildId: interaction.guild.id,
                                    userId: user.id
                                })

                                if (!teste) {
                                    const newCmd = {
                                        guildId: interaction.guild.id,
                                        userId: user.id
                                    }
                                    if (attachment) {
                                        newCmd.Img1 = attachment
                                    }

                                    await perfilID.create(newCmd)
                                } else {
                                    if (!attachment) {
                                        await perfilID.findOneAndUpdate({
                                            guildId: interaction.guild.id,
                                            userId: user.id
                                        }, { $unset: { "Img1": "" } })
                                    } else {
                                        await perfilID.findOneAndUpdate({
                                            guildId: interaction.guild.id,
                                            userId: user.id
                                        }, { $set: { "Img1": attachment } })
                                    }
                                }
                            }
                        }

                        // Chame a função para cada identificador personalizado
                        handleConfirmaButton('confirma', 'minecraft', user, i)
                        handleConfirmaButton('confirma2', 'sett', user, i)
                        handleConfirmaButton('confirma3', 'vaynearcoceleste', user, i)
                        handleConfirmaButton('confirma5', 'soulfighter', user, i)
                        handleConfirmaButton('confirma6', 'jett', user, i)
                        handleConfirmaButton('confirma7', 'RazerEKillJoyu', user, i)



                        const customIdss = ['volta', 'volta2', 'volta3', 'volta4', 'volta5', 'volta6', 'volta7', 'voltaa']

                        for (const customId of customIdss) {
                            if (i.customId === customId) {
                                await i.deferUpdate()

                                let chave = {}
                                chave.create = Canvas.createCanvas(900, 600)
                                chave.context = chave.create.getContext('2d')
                                chave.context.font = '68px tagihan'
                                chave.context.fillStyle = '#F8F8FF'



                                const cmd2 = await perfilID.findOne({
                                    guildId: interaction.guild.id,
                                    userId: user.id
                                })

                                let foto = ""

                                if (cmd2 === null) {

                                    foto = "././img/shop/default.png"
                                } else { foto = cmd2.Img1 }


                                await Canvas.loadImage(foto).then(async (img) => {
                                    chave.context.drawImage(img, 0, 0, 900, 600)
                                    chave.context.textAlign = "left"
                                    chave.context.font = '37px "aAkhirTahun"'
                                    chave.context.fillText(`${user.username.toUpperCase()}`, 270, 210)


                                    chave.context.save()
                                    await Canvas.loadImage(user.displayAvatarURL({ extension: 'png', size: 1024 })).then(async (interaction) => {
                                        chave.context.beginPath()
                                        // Calcula as coordenadas e dimensões da imagem e do círculo de recorte deslocados 4 pixels para a esquerda e com tamanho aumentado
                                        const centerX = 154 - 4 // Coordenada X do centro do círculo deslocada 4 pixels para a esquerda
                                        const centerY = 150 + 2 // Coordenada Y do centro do círculo deslocada 2 pixels para baixo
                                        const clipRadius = 115  // Raio do círculo de recorte (originalmente 115)
                                        const imageWidth = clipRadius * 2
                                        const imageHeight = clipRadius * 2
                                        const imageX = centerX - clipRadius
                                        const imageY = centerY - clipRadius

                                        // Desenha o círculo de recorte
                                        chave.context.arc(centerX, centerY, clipRadius, 0, Math.PI * 2)
                                        chave.context.clip()

                                        // Desenha a imagem dentro do círculo de recorte com o tamanho ajustado
                                        chave.context.drawImage(interaction, imageX, imageY, imageWidth, imageHeight)

                                        // Desenha a borda branca ao redor do círculo de recorte
                                        chave.context.lineWidth = 5 // Espessura da linha
                                        chave.context.strokeStyle = '101216' // Cor da borda
                                        chave.context.beginPath()
                                        chave.context.arc(centerX, centerY, clipRadius, 0, Math.PI * 2)
                                        chave.context.stroke()

                                    })
                                    chave.context.restore()


                                    Saldo = ""

                                    const money2 = await User.findOne({
                                        guildId: interaction.guild.id,
                                        userId: user.id,
                                    })


                                    if (money2 === null) {
                                        Saldo = 0
                                    } else { Saldo = money2.saldo }

                                    chave.context.font = '50px "up"'
                                    chave.context.fillText(`${Saldo.toLocaleString()}`, 120, 400)


                                    lvl = ""

                                    const fetchedLevel = await Level.findOne({
                                        guildId: interaction.guild.id,
                                        userId: user.id,
                                    })


                                    if (fetchedLevel === null) {
                                        lvl = 0
                                    } else { lvl = fetchedLevel.level }


                                    chave.context.font = '50px "up"'
                                    chave.context.fillText(`${lvl}`, 245, 470)
                                    chave.context.textAlign = "center"
                                    chave.context.font = '45px "up"'

                                    rep = ""

                                    const userRep = await repUser.findOne({
                                        guildId: interaction.guild.id,
                                        userId: user.id,
                                    })

                                    if (userRep === null) {
                                        rep = 0
                                    } else { rep = userRep.Rep }


                                    chave.context.fillText(`${rep}`, 136, 552)


                                    const cmdSobre = await sobre.findOne({
                                        guildId: interaction.guild.id,
                                        userId: user.id,
                                    })



                                    chave.context.textAlign = "left"
                                    chave.context.font = '22px "up"'
                                    chave.context.strokeStyle = "#a7a7a7"
                                    chave.context.fillStyle = "#a7a7a7"
                                    chave.context.fillText(cmdSobre == null ? `${user.username} ${lang.msg195.match(/.{1,40}/g).join("\n")}` : cmdSobre.sobreMim.match(/.{1,40}/g).join("\n"), 450, 395)


                                })


                                const formattedBadges = await processUserBadges(user)
                                const lengthOfFormattedBadges = formattedBadges !== null ? formattedBadges.length.toString() : "";
                                const formattedBadgesString = formattedBadges !== null ? formattedBadges.split(",").join(" ") : "";



                                chave.context.textAlign = "right"
                                chave.context.strokeStyle = '#0a0a0c'
                                chave.context.fillStyle = '#0a0a0c'
                                chave.context.beginPath()
                                fundo = -3.7
                                chave.context.roundRect(883, 226, fundo * lengthOfFormattedBadges / 2, 70, [10])
                                chave.context.fill()
                                chave.context.stroke()
                                chave.context.textAlign = "right"
                                chave.context.font = '50px "up"'


                                await Utils.renderEmoji(chave.context, formattedBadgesString.split(",").join(" "), 877, 280)

                                const mensagem = new discord.AttachmentBuilder(chave.create.toBuffer(), `${interaction.user.tag}.png`)

                                await i.editReply({ files: [mensagem], components: [btn] })

                                break
                            }
                        }

                        const customIds = ['info', 'info2', 'info3', 'info4', 'info5', 'info6', 'info7']

                        const replyContent = `${lang.msg200}`

                        for (const customId of customIds) {
                            if (i.customId === customId) {
                                await i.reply({ content: replyContent, ephemeral: true })
                                break
                            }
                        }

                        if (i.customId === 'infoVerif') {
                            if (interaction.isButton()) return
                            await i.reply({
                                content: `${lang.msg201}`,
                                ephemeral: true
                            })

                        }

                    })

                }
            } catch (e) {

                interaction.editReply({
                    content: `${lang.AlertApiUser}`,
                    ephemeral: true
                })

            }
        }

        else if (interaction.channel.id !== cmd1) {
            interaction.reply({
                content: `${lang.alertCanalErrado} <#${cmd1}>.`,
                ephemeral: true
            })
        }
    }
}