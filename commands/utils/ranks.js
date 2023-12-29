const {
    ApplicationCommandType,
    ApplicationCommandOptionType,
    AttachmentBuilder
} = require("discord.js")
const {
    createCanvas,
    loadImage,
    registerFont,
} = require('canvas')

registerFont("././fonts/aAkhirTahun.ttf", { family: "aAkhirTahun" })
registerFont("././fonts/ChunkFive-Regular.otf", { family: "ChunkFive" })
registerFont("./fonts/Pelita.otf", { family: "Pelita" })

const level = require("../../database/models/level")
const idioma = require("../../database/models/language")
const comandos = require("../../database/models/comandos")

module.exports = {
    name: "rank",
    description: "teste",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "global",
            type: ApplicationCommandOptionType.Subcommand,
            description: "Exibir a classificação global do grove.",
        },
        {
            name: "server",
            type: ApplicationCommandOptionType.Subcommand,
            description: "Exibir a classificação atual do servidor.",

        },

    ],


    run: async (client, interaction) => {

        const subcommands = interaction.options.getSubcommand()


        switch (subcommands) {

            case "global": {

                let lang = await idioma.findOne({
                    guildId: interaction.guild.id
                })
                lang = lang ? require(`../../languages/${lang.language}.js`) : require('../../languages/pt.js')

                const cmd = await comandos.findOne({
                    guildId: interaction.guild.id
                })

                if (!cmd)
                    return interaction.reply({
                        content: `${lang.alertCommandos}`,
                        ephemeral: true
                    })

                let cmd1 = cmd.canal1

                if (cmd1 === null || cmd1 === false || !client.channels.cache.get(cmd1) || cmd1 === interaction.channel.id) {


                    await interaction.deferReply({ fetchReply: true })

                    const canvas = createCanvas(751, 500),
                        ctx = canvas.getContext('2d'),
                        bg = await loadImage("https://raw.githubusercontent.com/arrastaorj/flags/main/rankGlobal.png")
                    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height)


                    const allUserData = await level.find({}).exec()

                    const uniqueUsers = {}

                    allUserData.forEach((userData) => {
                        const userId = userData.userId

                        if (!uniqueUsers[userId] ||
                            uniqueUsers[userId].level < userData.level ||
                            (uniqueUsers[userId].level === userData.level && uniqueUsers[userId].xp < userData.xp)
                        ) {
                            uniqueUsers[userId] = userData
                        }
                    })

                    const dataGlobal = Object.values(uniqueUsers).sort((a, b) => {
                        if (b.level !== a.level) {
                            return b.level - a.level;
                        } else {
                            return b.xp - a.xp;
                        }
                    }).slice(0, 10)


                    if (!dataGlobal || dataGlobal.length === 0) {
                        return interaction.reply({
                            content: `${lang.msg204}`,
                            ephemeral: true
                        })
                    }


                    const ranks = Math.min(10, dataGlobal.length)

                    const userNames = []
                    const userContents = []

                    for (let i = 0; i < ranks; i++) {
                        const userData = dataGlobal[i]
                        const user = client.users.cache.get(userData?.userId)

                        if (user) {
                            userNames.push(user.tag)
                            userContents.push(user.id)
                        }
                    }

                    userContents.sort((a, b) => {
                        const userDataA = dataGlobal.find((user) => user.userId === a)
                        const userDataB = dataGlobal.find((user) => user.userId === b)
                        const levelA = userDataA ? userDataA.level : 0
                        const levelB = userDataB ? userDataB.level : 0

                        if (levelB !== levelA) {
                            return levelB - levelA
                        } else {
                            const xpA = userDataA ? userDataA.xp : 0
                            const xpB = userDataB ? userDataB.xp : 0
                            return xpB - xpA
                        }
                    })

                    const positions = [
                        { x: 375, y: 225 },
                        { x: 195, y: 285 },
                        { x: 555, y: 285 },
                        { x: 145, y: 344 },
                        { x: 145, y: 401 },
                        { x: 145, y: 458 },
                        { x: 495, y: 344 },
                        { x: 495, y: 401 },
                        { x: 495, y: 458 }
                    ]

                    for (let i = 0; i < positions.length; i++) {
                        const { x, y } = positions[i]
                        ctx.font = '17px "ChunkFive"'
                        ctx.fillStyle = "white"
                        ctx.textAlign = i < 3 ? "center" : "left"
                        ctx.fillText(userNames[i], x, y)
                    }

                    async function drawUserAvatar(ctx, user, x, y, radius) {
                        return new Promise(async (resolve) => {
                            ctx.save();
                            await loadImage(user?.displayAvatarURL({ extension: 'png', dynamic: false })).then(async (i) => {
                                ctx.beginPath();
                                ctx.arc(x + radius, y + radius, radius, 0, Math.PI * 2);
                                ctx.clip();
                                ctx.drawImage(i, x, y, radius * 2, radius * 2);
                                ctx.restore();
                                resolve();
                            });
                        });
                    }

                    const userCoordinates = [
                        { x: 317, y: 86, radius: 59 },
                        { x: 145, y: 165, radius: 50 },
                        { x: 505, y: 165, radius: 50 },
                        { x: 91, y: 313, radius: 23 },
                        { x: 91, y: 373, radius: 23 },
                        { x: 91, y: 430, radius: 23 },
                        { x: 443, y: 313, radius: 23 },
                        { x: 443, y: 373, radius: 23 },
                        { x: 443, y: 430, radius: 23 },
                    ];


                    await Promise.all(userContents.map(async (userId, index) => {
                        const user = client.users.cache.get(userId);
                        if (user) {
                            await drawUserAvatar(ctx, user, userCoordinates[index].x, userCoordinates[index].y, userCoordinates[index].radius);
                        }
                    }))


                    await loadImage("https://raw.githubusercontent.com/arrastaorj/flags/main/rankComplement.png").then(async (i) => {
                        ctx.drawImage(i, 60, 25, 804, 450)
                    })


                    const rankCard = new AttachmentBuilder(canvas.toBuffer(), "rank.png")
                    return await interaction.editReply({
                        files: [rankCard]
                    })
                }

                else if (interaction.channel.id !== cmd1) {
                    await interaction.reply({
                        content: `${lang.alertCanalErrado} <#${cmd1}>.`,
                        ephemeral: true
                    })
                }
                break
            }

            case "server": {

                let lang = await idioma.findOne({
                    guildId: interaction.guild.id
                })
                lang = lang ? require(`../../languages/${lang.language}.js`) : require('../../languages/pt.js')


                const cmd = await comandos.findOne({
                    guildId: interaction.guild.id
                })

                if (!cmd)
                    return interaction.reply({
                        content: `${lang.alertCommandos}`,
                        ephemeral: true
                    })

                let cmd1 = cmd.canal1

                if (cmd1 === null || cmd1 === false || !client.channels.cache.get(cmd1) || cmd1 === interaction.channel.id) {


                    await interaction.deferReply({ fetchReply: true })


                    let allUserData = await level.find({
                        guildId: interaction.guild.id,
                    }).exec();

                    const uniqueUsers = {};

                    allUserData.forEach((userData) => {
                        const userId = userData.userId; // Substitua "userId" pelo campo que contém a identificação única do usuário

                        if (!uniqueUsers[userId] ||
                            uniqueUsers[userId].level < userData.level ||
                            (uniqueUsers[userId].level === userData.level && uniqueUsers[userId].xp < userData.xp)
                        ) {
                            uniqueUsers[userId] = userData;
                        }
                    });

                    const dataGlobal = Object.values(uniqueUsers).sort((a, b) => {
                        if (b.level !== a.level) {
                            return b.level - a.level;
                        } else {
                            return b.xp - a.xp;
                        }
                    }).slice(0, 10)



                    if (!dataGlobal || dataGlobal.length === 0) {
                        return interaction.reply({
                            content: `${lang.msg204}`,
                            ephemeral: true
                        });
                    }




                    const ranks = Math.min(10, dataGlobal.length)


                    const userNames = []
                    const userContents = []

                    for (let i = 0; i < ranks; i++) {

                        const userData = dataGlobal[i]
                        const user = client.users.cache.get(userData?.userId)

                        if (user) {

                            const userName = `${user.tag} | Level: [${userData.level}]`
                            userNames.push(userName)

                            const userContent = `${user.id}`
                            userContents.push(userContent)

                        }
                    }


                    userNames.sort((a, b) => {
                        const levelA = parseInt(a.match(/\[([0-9]+)\]/)[1])
                        const levelB = parseInt(b.match(/\[([0-9]+)\]/)[1])
                        return levelB - levelA
                    })

                    userContents.sort((a, b) => {
                        const userDataA = dataGlobal.find((user) => user.userId === a)
                        const userDataB = dataGlobal.find((user) => user.userId === b)


                        const levelA = userDataA ? userDataA.level : 0
                        const levelB = userDataB ? userDataB.level : 0


                        if (levelB !== levelA) {
                            return levelB - levelA
                        } else {

                            const xpA = userDataA ? userDataA.xp : 0
                            const xpB = userDataB ? userDataB.xp : 0

                            return xpB - xpA
                        }
                    })

                    const canvas = createCanvas(680, 745),
                        ctx = canvas.getContext('2d'),
                        bg = await loadImage("https://raw.githubusercontent.com/arrastaorj/flags/main/rankteste.png");
                    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height)

                    const drawUser = async (userName, userContent, yPos) => {
                        ctx.font = "30px 'Pelita'";
                        ctx.fillStyle = "white";
                        ctx.textAlign = "left";
                        ctx.fillText(userName, 250, yPos)



                        const user = client.users.cache.get(userContent)
                        const avatarURL = user?.displayAvatarURL({
                            extension: 'png',
                            dynamic: false,
                            caches: false
                        })

                        if (avatarURL) {
                            try {
                                const avatarImage = await loadImage(avatarURL);
                                return { userName, avatarImage, yPos }
                            } catch (error) {
                                console.error(`Erro ao carregar avatar para ${userName}:`, error)
                                return null
                            }
                        } else {
                            console.error(`URL de avatar não encontrada para ${userName}`)
                            return null
                        }
                    }


                    const avatarPromises = userNames.map(async (userName, i) => {
                        const userContent = userContents[i]
                        const yPos = 105 + i * 55
                        const userData = await drawUser(userName, userContent, yPos)
                        return userData
                    })

                    const avatarImages = await Promise.all(avatarPromises)

                    avatarImages.sort((a, b) => a.yPos - b.yPos)

                    for (const { avatarImage, yPos } of avatarImages) {
                        ctx.drawImage(avatarImage, 198, yPos - 20, 38, 38)
                    }

                    const at = new AttachmentBuilder(canvas.toBuffer(), "rank.png")
                    return await interaction.editReply({
                        files: [at]
                    })

                }
                else if (interaction.channel.id !== cmd1) {
                    await interaction.reply({
                        content: `${lang.alertCanalErrado} <#${cmd1}>.`,
                        ephemeral: true
                    })
                }
                break
            }
        }
    }
}