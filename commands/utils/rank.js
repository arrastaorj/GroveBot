const discord = require("discord.js")
const comandos = require("../../database/models/comandos")
const level = require("../../database/models/level")
const { createCanvas, loadImage, registerFont } = require('canvas')
const canvas = require("canvas")
registerFont("./fonts/Pelita.otf", { family: "Pelita" })

module.exports = {
    name: "rank",
    description: "Exibe seu rank no servidor.",
    type: discord.ApplicationCommandType.ChatInput,


    async run(client, interaction, args) {

        const cmd = await comandos.findOne({
            guildId: interaction.guild.id
        })

        if (!cmd) return interaction.reply({ content: `> \`+\` Um Adminitrador ainda não configurou o canal para uso de comandos!`, ephemeral: true })

        let cmd1 = cmd.canal1

        if (cmd1 === null || cmd1 === false || !client.channels.cache.get(cmd1) || cmd1 === interaction.channel.id) {


            await interaction.deferReply({ fetchReply: true })


            let dataGlobal = await level.find({
                guildId: interaction.guild.id
            }).sort([["xp", "descending"]]).exec()


            dataGlobal = dataGlobal.slice(0, 10)
            if (!dataGlobal) return interaction.reply({ content: `este servido n tem rank`, ephemeral: true })

            const puestoUsuario = dataGlobal.findIndex(dataUser => dataUser.userId === interaction.user.id) + 1


            let nome1 = ""
            let nome2 = ""
            let nome3 = ""
            let nome4 = ""
            let nome5 = ""
            let nome6 = ""
            let nome7 = ""
            let nome8 = ""
            let nome9 = ""
            let nome10 = ""

            let content1 = "";
            let content2 = "";
            let content3 = "";
            let content4 = "";
            let content5 = "";
            let content6 = "";
            let content7 = "";
            let content8 = "";
            let content9 = "";
            let content10 = "";

            const ranks = dataGlobal.length > 10 ? 10 : dataGlobal.length



            for (i = 0; i < ranks; i++) {
                const user = client.users.cache.get(dataGlobal[0]?.userId)?.tag
                nome1 = `${user} | Level: [${dataGlobal[0]?.level}]`
                if (user == undefined || user == null) nome1 = ' '
            }

            for (i = 0; i < ranks; i++) {
                const user = client.users.cache.get(dataGlobal[1]?.userId)?.tag
                nome2 = `${user} | Level: [${dataGlobal[1]?.level}]`
                if (user == undefined || user == null) nome2 = ' '
            }

            for (i = 0; i < ranks; i++) {
                const user = client.users.cache.get(dataGlobal[2]?.userId)?.tag
                nome3 = `${user} | Level: [${dataGlobal[2]?.level}]`
                if (user == undefined || user == null) nome3 = ' '
            }

            for (i = 0; i < ranks; i++) {
                const user = client.users.cache.get(dataGlobal[3]?.userId)?.tag
                nome4 = `${user} | Level: [${dataGlobal[3]?.level}]`
                if (user == undefined || user == null) nome4 = ' '
            }

            for (i = 0; i < ranks; i++) {
                const user = client.users.cache.get(dataGlobal[4]?.userId)?.tag
                nome5 = `${user} | Level: [${dataGlobal[4]?.level}]`
                if (user == undefined || user == null) nome5 = ' '
            }

            for (i = 0; i < ranks; i++) {
                const user = client.users.cache.get(dataGlobal[5]?.userId)?.tag
                nome6 = `${user} | Level: [${dataGlobal[5]?.level}]`
                if (user == undefined || user == null) nome6 = ' '
            }

            for (i = 0; i < ranks; i++) {
                const user = client.users.cache.get(dataGlobal[6]?.userId)?.tag
                nome7 = `${user} | Level: [${dataGlobal[6]?.level}]`
                if (user == undefined || user == null) nome7 = ' '
            }

            for (i = 0; i < ranks; i++) {
                const user = client.users.cache.get(dataGlobal[7]?.userId)?.tag
                nome8 = `${user} | Level: [${dataGlobal[7]?.level}]`
                if (user == undefined || user == null) nome8 = ' '
            }

            for (i = 0; i < ranks; i++) {
                const user = client.users.cache.get(dataGlobal[8]?.userId)?.tag
                nome9 = `${user} | Level: [${dataGlobal[8]?.level}]`
                if (user == undefined || user == null) nome9 = ' '
            }

            for (i = 0; i < ranks; i++) {
                const user = client.users.cache.get(dataGlobal[9]?.userId)?.tag
                nome10 = `${user} | Level: [${dataGlobal[9]?.level}]`
                if (user == undefined || user == null) nome10 = ' '
            }


            ////////////////////////////////////////////////

            for (let i = 0; i < ranks; i++) {
                const user = client.users.cache.get(dataGlobal[0]?.userId)?.id
                content1 = `${user}`;
                if (user == undefined || user == null) content1 = ' '
            }


            for (let i = 0; i < ranks; i++) {
                const user = client.users.cache.get(dataGlobal[1]?.userId)?.id
                content2 = `${user}`;
                if (user == undefined || user == null) content2 = ' '
            }

            for (let i = 0; i < ranks; i++) {
                const user = client.users.cache.get(dataGlobal[2]?.userId)?.id
                content3 = `${user}`;
                if (user == undefined || user == null) content3 = ' '
            }

            for (let i = 0; i < ranks; i++) {
                const user = client.users.cache.get(dataGlobal[3]?.userId)?.id
                content4 = `${user}`;
                if (user == undefined || user == null) content4 = ' '
            }

            for (let i = 0; i < ranks; i++) {
                const user = client.users.cache.get(dataGlobal[4]?.userId)?.id
                content5 = `${user}`;
                if (user == undefined || user == null) content5 = ' '
            }

            for (let i = 0; i < ranks; i++) {
                const user = client.users.cache.get(dataGlobal[5]?.userId)?.id
                content6 = `${user}`;
                if (user == undefined || user == null) content6 = ' '
            }

            for (let i = 0; i < ranks; i++) {
                const user = client.users.cache.get(dataGlobal[6]?.userId)?.id
                content7 = `${user}`;
                if (user == undefined || user == null) content7 = ' '
            }

            for (let i = 0; i < ranks; i++) {
                const user = client.users.cache.get(dataGlobal[7]?.userId)?.id
                content8 = `${user}`;
                if (user == undefined || user == null) content8 = ' '
            }

            for (let i = 0; i < ranks; i++) {
                const user = client.users.cache.get(dataGlobal[8]?.userId)?.id
                content9 = `${user}`;
                if (user == undefined || user == null) content9 = ' '
            }

            for (let i = 0; i < ranks; i++) {
                const user = client.users.cache.get(dataGlobal[9]?.userId)?.id
                content10 = `${user}`;
                if (user == undefined || user == null) content10 = ' '
            }

            /////////////////////////////////////////


            const canvas = createCanvas(680, 745),

                ctx = canvas.getContext('2d'),
                bg = await loadImage("https://raw.githubusercontent.com/arrastaorj/flags/main/DrBC72T.png")


            ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

            ctx.font = "30px 'Pelita'"
            ctx.fillStyle = "white";
            ctx.textAlign = "left";
            ctx.fillText(nome1, 250, 105)

            ctx.font = "30px 'Pelita'"
            ctx.fillStyle = "white";
            ctx.textAlign = "left";
            ctx.fillText(nome2, 250, 160)

            ctx.font = "30px 'Pelita'"
            ctx.fillStyle = "white";
            ctx.textAlign = "left";
            ctx.fillText(nome3, 250, 215)

            ctx.font = "30px 'Pelita'"
            ctx.fillStyle = "white";
            ctx.textAlign = "left";
            ctx.fillText(nome4, 250, 272)

            ctx.font = "30px 'Pelita'"
            ctx.fillStyle = "white";
            ctx.textAlign = "left";
            ctx.fillText(nome5, 250, 331)

            ctx.font = "30px 'Pelita'"
            ctx.fillStyle = "white";
            ctx.textAlign = "left";
            ctx.fillText(nome6, 250, 387)

            ctx.font = "30px 'Pelita'"
            ctx.fillStyle = "white";
            ctx.textAlign = "left";
            ctx.fillText(nome7, 250, 442)

            ctx.font = "30px 'Pelita'"
            ctx.fillStyle = "white";
            ctx.textAlign = "left";
            ctx.fillText(nome8, 250, 497)

            ctx.font = "30px 'Pelita'"
            ctx.fillStyle = "white";
            ctx.textAlign = "left";
            ctx.fillText(nome9, 250, 552)

            ctx.font = "30px 'Pelita'"
            ctx.fillStyle = "white";
            ctx.textAlign = "left";
            ctx.fillText(nome10, 250, 608)



            ////////////////////////////////////////////////// 



            let avatar1 = client.users.cache.get(content1)
            let avatar2 = client.users.cache.get(content2)
            let avatar3 = client.users.cache.get(content3)
            let avatar4 = client.users.cache.get(content4)
            let avatar5 = client.users.cache.get(content5)
            let avatar6 = client.users.cache.get(content6)
            let avatar7 = client.users.cache.get(content7)
            let avatar8 = client.users.cache.get(content8)
            let avatar9 = client.users.cache.get(content9)
            let avatar10 = client.users.cache.get(content10)




            let foto = `https://raw.githubusercontent.com/arrastaorj/flags/main/user.png`


            if (avatar1 == undefined || avatar1 == null) {
                await loadImage(foto).then(async (i) => {
                    ctx.drawImage(i, 199, 75, 38, 38)
                })
            }
            else {

                await loadImage(avatar1.displayAvatarURL({ extension: 'png', dynamic: false })).then(async (i) => {
                    ctx.drawImage(i, 199, 75, 38, 38);
                })
            }



            if (avatar2 == undefined || avatar2 == null) {
                await loadImage(foto).then(async (i) => {
                    ctx.drawImage(i, 198, 132, 38, 38)
                })
            }
            else {

                await loadImage(avatar2.displayAvatarURL({ extension: 'png', dynamic: false })).then(async (i) => {
                    ctx.drawImage(i, 198, 132, 38, 38);
                })
            }


            if (avatar3 == undefined || avatar3 == null) {
                await loadImage(foto).then(async (i) => {
                    ctx.drawImage(i, 198, 189, 38, 38)
                })
            }
            else {

                await loadImage(avatar3.displayAvatarURL({ extension: 'png', dynamic: false })).then(async (i) => {
                    ctx.drawImage(i, 198, 189, 38, 38);
                })
            }



            if (avatar4 == undefined || avatar4 == null) {
                await loadImage(foto).then(async (i) => {
                    ctx.drawImage(i, 198, 244, 38, 38)
                })
            }
            else {

                await loadImage(avatar4.displayAvatarURL({ extension: 'png', dynamic: false })).then(async (i) => {
                    ctx.drawImage(i, 198, 246, 38, 38);
                })
            }

            if (avatar5 == undefined || avatar5 == null) {
                await loadImage(foto).then(async (i) => {
                    ctx.drawImage(i, 198, 300, 38, 38)
                })
            }
            else {

                await loadImage(avatar5.displayAvatarURL({ extension: 'png', dynamic: false })).then(async (i) => {
                    ctx.drawImage(i, 198, 303, 38, 38);
                })
            }

            if (avatar6 == undefined || avatar6 == null) {
                await loadImage(foto).then(async (i) => {
                    ctx.drawImage(i, 198, 357, 38, 38)
                })
            }
            else {

                await loadImage(avatar6.displayAvatarURL({ extension: 'png', dynamic: false })).then(async (i) => {
                    ctx.drawImage(i, 198, 356, 38, 38);
                })
            }

            if (avatar7 == undefined || avatar7 == null) {
                await loadImage(foto).then(async (i) => {
                    ctx.drawImage(i, 198, 413, 38, 38)
                })
            }
            else {

                await loadImage(avatar7.displayAvatarURL({ extension: 'png', dynamic: false })).then(async (i) => {
                    ctx.drawImage(i, 198, 417, 38, 38);
                })
            }


            if (avatar8 == undefined || avatar8 == null) {
                await loadImage(foto).then(async (i) => {
                    ctx.drawImage(i, 198, 470, 38, 38)
                })
            }
            else {

                await loadImage(avatar8.displayAvatarURL({ extension: 'png', dynamic: false })).then(async (i) => {
                    ctx.drawImage(i, 198, 474, 38, 38);
                })
            }


            if (avatar9 == undefined || avatar9 == null) {
                await loadImage(foto).then(async (i) => {
                    ctx.drawImage(i, 198, 526, 38, 38)
                })
            }
            else {

                await loadImage(avatar9.displayAvatarURL({ extension: 'png', dynamic: false })).then(async (i) => {
                    ctx.drawImage(i, 198, 526, 38, 38);
                })
            }

            if (avatar10 == undefined || avatar10 == null) {
                await loadImage(foto).then(async (i) => {
                    ctx.drawImage(i, 198, 583, 38, 38)
                })
            }
            else {

                await loadImage(avatar10.displayAvatarURL({ extension: 'png', dynamic: false })).then(async (i) => {
                    ctx.drawImage(i, 198, 583, 38, 38);
                })
            }


            const at = new discord.AttachmentBuilder(canvas.toBuffer(), "rank.png");

            return interaction.editReply({ files: [at] })

        }
        else

            if (interaction.channel.id !== cmd1) { interaction.reply({ content: `> \`+\` Você estar tentando usar um comando no canal de texto errado, tente utiliza-lo no canal de <#${cmd1}>.`, ephemeral: true }) }

    }
}