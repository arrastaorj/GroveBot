const client = require('../../index');
const discord = require("discord.js")
const bemvindo = require("../../database/models/bemvindo")
const fbv = require("../../database/models/fbv")
const Canvas = require("canvas")

client.on("guildMemberAdd", async (member) => {


    try {

        const cmd = await bemvindo.findOne({
            guildId: member.guild.id
        })

        if (!cmd) return

        let cmd1 = cmd.canal1

        if (!cmd1) return


        const cmd2 = await fbv.findOne({
            guildId: member.guild.id
        })

        let foto = ""

        if (cmd2 === null) {

            foto = "https://raw.githubusercontent.com/arrastaorj/flags/main/bemvindo.png"
        } else { foto = cmd2.canal1 }



        const { registerFont } = require('canvas')
        registerFont('./fonts/Nexa-Heavy.ttf', { family: 'Nexa-Heavy' })

        let chave = {}
        chave.create = Canvas.createCanvas(1024, 500)
        chave.context = chave.create.getContext('2d')

        chave.context.fillStyle = '#F8F8FF'

        Canvas.loadImage(foto).then(async (img) => {

            chave.context.drawImage(img, 0, 0, 1024, 500)

            chave.context.font = '65px "Nexa-Heavy"',
                chave.context.fillText("Bem-Vindo(a)", 300, 360)
            chave.context.textAlign = 'center'

            chave.context.beginPath()
            chave.context.arc(512, 166, 128, 0, Math.PI * 2, true)



            chave.context.font = '42px "Nexa-Heavy"',
                chave.context.textAlign = 'center'
            chave.context.fillText(`${member.user.tag.toUpperCase()}`, 512, 410)
            chave.context.textAlign = 'center'
            chave.context.font = '20px "Nexa-Heavy"',
                chave.context.fillText(`Você e nosso membro de n°${member.guild.memberCount}`, 512, 455)
            chave.context.textAlign = 'center'

            chave.context.beginPath()
            chave.context.arc(512, 166, 119, 0, Math.PI * 2, true)
            chave.context.closePath()
            chave.context.clip()

            await Canvas.loadImage(member.user.displayAvatarURL({ extension: 'png', size: 1024 })).then(async (i) => {
                chave.context.drawImage(i, 393, 47, 238, 238)
            })

            let mensagem = new discord.AttachmentBuilder(chave.create.toBuffer(), `${member.user.tag}.png`)

            client.channels.cache.get(cmd1).send({ content: `Olá ${member}`, files: [mensagem] }).catch(e => {
                console.log(e)
            })
        })

    } catch (error) {
        client.channels.cache.get(cmd1).send("> \`-\` <a:alerta:1163274838111162499> Peço desculpas por não poder enviar a menssagem de boas vindas, pois não tenho as permissões necessárias. Recomendo que entre em contato com o administrador do servidor ou acesse nosso servidor de suporte e abra um ticket para obter assistência.");
    }
})