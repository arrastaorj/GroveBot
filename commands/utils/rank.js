const discord = require("discord.js")
const comandos = require("../../database/models/comandos")
const level = require("../../database/models/level")
const { createCanvas, loadImage, registerFont } = require('canvas')
const canvas = require("canvas")
registerFont("./fonts/Pelita.otf", { family: "Pelita" })
const idioma = require("../../database/models/language")

module.exports = {
    name: "rank",
    description: "Exibe seu rank no servidor.",
    type: discord.ApplicationCommandType.ChatInput,


    async run(client, interaction, args) {

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


            let dataGlobal = await level.find({
                guildId: interaction.guild.id
            }).sort([["xp", "descending"]]).exec()


            dataGlobal = dataGlobal.slice(0, 10)
            if (!dataGlobal)
                return interaction.reply({
                    content: `${lang.msg204}`,
                    ephemeral: true
                })


         

            const ranks = Math.min(10, dataGlobal.length);

            const userNames = []
            const userContents = []

            for (let i = 0; i < ranks; i++) {

                const userData = dataGlobal[i];
                const user = client.users.cache.get(userData?.userId);

                if (user) {

                    const userName = `${user.tag} | Level: [${userData.level}]`;
                    userNames.push(userName);

                    const userContent = `${user.id}`;
                    userContents.push(userContent);
                
                }
            }


            userNames.sort((a, b) => {
                const levelA = parseInt(a.match(/\[([0-9]+)\]/)[1]);
                const levelB = parseInt(b.match(/\[([0-9]+)\]/)[1]);
                return levelB - levelA;
            })

            userContents.sort((a, b) => {
                const userDataA = dataGlobal.find((user) => user.userId === a);
                const userDataB = dataGlobal.find((user) => user.userId === b);
            
                // Certifique-se de tratar casos em que userDataA ou userDataB pode ser nulo
                const levelA = userDataA ? userDataA.level : 0;
                const levelB = userDataB ? userDataB.level : 0;
            
                // Compare primeiro com base no nível e, em seguida, no ID se os níveis forem iguais
                if (levelB !== levelA) {
                    return levelB - levelA;
                } else {
                    return parseInt(a) - parseInt(b);
                }
            });

            console.log(userContents)



           // console.log(userContents)

            const canvas = createCanvas(680, 745),
                ctx = canvas.getContext('2d'),
                bg = await loadImage("https://raw.githubusercontent.com/arrastaorj/flags/main/DrBC72T.png");
            ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);



            const drawUser = async (userName, userContent, yPos) => {
                ctx.font = "30px 'Pelita'";
                ctx.fillStyle = "white";
                ctx.textAlign = "left";
                ctx.fillText(userName, 250, yPos);



                const user = client.users.cache.get(userContent);
                const avatarURL = user?.displayAvatarURL({ extension: 'png', dynamic: false, caches: false});
            
                if (avatarURL) {
                    try {
                        const avatarImage = await loadImage(avatarURL);
                        return { userName, avatarImage, yPos };
                    } catch (error) {
                        console.error(`Erro ao carregar avatar para ${userName}:`, error);
                        return null;
                    }
                } else {
                    console.error(`URL de avatar não encontrada para ${userName}`);
                    return null;
                }

                //console.log(userName)
                //console.log(avatarURL)
            }


            const avatarPromises = userNames.map(async (userName, i) => {
                const userContent = userContents[i];
                const yPos = 105 + i * 55;
                const userData = await drawUser(userName, userContent, yPos);
                return userData;
            });
            
            const avatarImages = await Promise.all(avatarPromises);
            
            avatarImages.sort((a, b) => a.yPos - b.yPos);
            
            for (const { avatarImage, yPos } of avatarImages) {
                ctx.drawImage(avatarImage, 198, yPos - 20, 38, 38);
            }

            const at = new discord.AttachmentBuilder(canvas.toBuffer(), "rank.png");
            return interaction.editReply({ files: [at] });

        }
    }
}
