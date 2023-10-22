const discord = require("discord.js")
const db = require("quick.db")
const Canvas = require('canvas')
const Utils = require("../../plugins/Util")
const { registerFont } = require("canvas")
registerFont("././fonts/florida.otf", { family: "florida" })
registerFont("././fonts/up.otf", { family: "up" })
registerFont("././fonts/sd.ttf", { family: "sd" })
registerFont("././fonts/aAkhirTahun.ttf", { family: "aAkhirTahun" })
const comandos = require("../../database/models/comandos")
const perfilID = require("../../database/models/perfil")
const Level = require('../../database/models/level')
const repUser = require('../../database/models/rep')
const sobre = require('../../database/models/sobre')

const skin = require("../../database/models/skin")
const User = require('../../database/models/economia')


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

        const cmd = await comandos.findOne({
            guildId: interaction.guild.id
        })

        if (!cmd) return interaction.reply({ content: `> \`-\` <a:alerta:1163274838111162499> Um Adminitrador ainda não configurou o canal para uso de comandos!`, ephemeral: true })

        let cmd1 = cmd.canal1

        if (cmd1 === null || cmd1 === false || !client.channels.cache.get(cmd1) || cmd1 === interaction.channel.id) {



            const user = interaction.options.getUser("usuario") || interaction.user


            const membro = interaction.guild.members.cache.get(user.id)

            let btn = new discord.ActionRowBuilder().addComponents([
                new discord.ButtonBuilder()
                    .setStyle(discord.ButtonStyle.Secondary)
                    .setLabel("Skins")
                    .setEmoji("<:diamond_5253785:1162581880047140925>")
                    .setCustomId("sk"),
                new discord.ButtonBuilder()
                    .setStyle(discord.ButtonStyle.Secondary)
                    .setLabel("Sobre Mim")
                    .setEmoji("<:pencil_3214372:1162580535139373097>")
                    .setCustomId("sms"),
            ])


            let btnn = new discord.ActionRowBuilder().addComponents([
                new discord.ButtonBuilder()
                    .setStyle(discord.ButtonStyle.Secondary)
                    .setEmoji("<:leftdown_7013311:1162576819309002762>")
                    .setCustomId("volta"),
                new discord.ButtonBuilder()
                    .setStyle(discord.ButtonStyle.Success)
                    .setLabel("Selecionar Skin")
                    //.setEmoji("<:enviar:1065758776348647495>")
                    .setCustomId("confirma"),
                new discord.ButtonBuilder()
                    .setStyle(discord.ButtonStyle.Secondary)
                    .setEmoji("<:information_4057696:1162576821594890360>")
                    .setCustomId("info"),

            ])


            let btnn2 = new discord.ActionRowBuilder().addComponents([
                new discord.ButtonBuilder()
                    .setStyle(discord.ButtonStyle.Secondary)
                    .setEmoji("<:leftdown_7013311:1162576819309002762>")
                    .setCustomId("volta2"),
                new discord.ButtonBuilder()
                    .setStyle(discord.ButtonStyle.Success)
                    .setLabel("Selecionar Skin")
                    .setCustomId("confirma2"),
                new discord.ButtonBuilder()
                    .setStyle(discord.ButtonStyle.Secondary)
                    .setEmoji("<:information_4057696:1162576821594890360>")
                    .setCustomId("info2"),
            ])

            let btnn3 = new discord.ActionRowBuilder().addComponents([
                new discord.ButtonBuilder()
                    .setStyle(discord.ButtonStyle.Secondary)
                    .setEmoji("<:leftdown_7013311:1162576819309002762>")
                    .setCustomId("volta3"),
                new discord.ButtonBuilder()
                    .setStyle(discord.ButtonStyle.Success)
                    .setLabel("Selecionar Skin")
                    .setCustomId("confirma3"),
                new discord.ButtonBuilder()
                    .setStyle(discord.ButtonStyle.Secondary)
                    .setEmoji("<:information_4057696:1162576821594890360>")
                    .setCustomId("info3"),
            ])

            let btnn4 = new discord.ActionRowBuilder().addComponents([
                new discord.ButtonBuilder()
                    .setStyle(discord.ButtonStyle.Secondary)
                    .setEmoji("<:leftdown_7013311:1162576819309002762>")
                    .setCustomId("volta4"),
                new discord.ButtonBuilder()
                    .setStyle(discord.ButtonStyle.Secondary)
                    .setEmoji("<:information_4057696:1162576821594890360>")
                    .setCustomId("info4"),
            ])

            let btnn5 = new discord.ActionRowBuilder().addComponents([
                new discord.ButtonBuilder()
                    .setStyle(discord.ButtonStyle.Secondary)
                    .setEmoji("<:leftdown_7013311:1162576819309002762>")
                    .setCustomId("volta5"),
                new discord.ButtonBuilder()
                    .setStyle(discord.ButtonStyle.Success)
                    .setLabel("Selecionar Skin")
                    .setCustomId("confirma5"),
                new discord.ButtonBuilder()
                    .setStyle(discord.ButtonStyle.Secondary)
                    .setEmoji("<:information_4057696:1162576821594890360>")
                    .setCustomId("info5"),
            ])


            let btnn6 = new discord.ActionRowBuilder().addComponents([
                new discord.ButtonBuilder()
                    .setStyle(discord.ButtonStyle.Secondary)
                    .setEmoji("<:leftdown_7013311:1162576819309002762>")
                    .setCustomId("volta6"),
                new discord.ButtonBuilder()
                    .setStyle(discord.ButtonStyle.Success)
                    .setLabel("Selecionar Skin")
                    .setCustomId("confirma6"),
                new discord.ButtonBuilder()
                    .setStyle(discord.ButtonStyle.Secondary)
                    .setEmoji("<:information_4057696:1162576821594890360>")
                    .setCustomId("info6"),
            ])

            let btnn7 = new discord.ActionRowBuilder().addComponents([
                new discord.ButtonBuilder()
                    .setStyle(discord.ButtonStyle.Secondary)
                    .setEmoji("<:leftdown_7013311:1162576819309002762>")
                    .setCustomId("volta7"),
                new discord.ButtonBuilder()
                    .setStyle(discord.ButtonStyle.Success)
                    .setLabel("Selecionar Skin")
                    .setCustomId("confirma7"),
                new discord.ButtonBuilder()
                    .setStyle(discord.ButtonStyle.Secondary)
                    .setEmoji("<:information_4057696:1162576821594890360>")
                    .setCustomId("info7"),
            ])


            let verific = new discord.ActionRowBuilder().addComponents([
                new discord.ButtonBuilder()
                    .setStyle(discord.ButtonStyle.Secondary)
                    .setEmoji("<:leftdown_7013311:1162576819309002762>")
                    .setCustomId("voltaa"),
                new discord.ButtonBuilder()
                    .setStyle(discord.ButtonStyle.Secondary)
                    .setLabel("Não Habilitada")
                    .setCustomId("nao")
                    .setDisabled(true),
            ])


            const modal = new discord.ModalBuilder()
                .setCustomId('sm')
                .setTitle('Alterar Biografia de Perfil')
                .setComponents(
                    new discord.ActionRowBuilder().setComponents(
                        new discord.TextInputBuilder()
                            .setCustomId('sobremim')
                            .setLabel("SOBRE MIM:")
                            .setMaxLength(337)
                            .setMinLength(1)
                            .setStyle(discord.TextInputStyle.Paragraph)
                    )
                )

            let painel = new discord.ActionRowBuilder().addComponents(new discord.StringSelectMenuBuilder()
                .setCustomId('menu')
                .setPlaceholder('Selecione uma skin...')
                .addOptions([
                    {
                        label: 'Minecraft',
                        description: 'Minecraft Defaut',
                        value: 'mc',
                    },
                    {
                        label: 'League of Legends',
                        description: 'Sett Defaut',
                        value: 'sett',
                    },
                    {
                        label: 'League of Legends',
                        description: 'Vayne Arco Celeste',
                        value: 'vayne',
                    },
                    {
                        label: 'League of Legends',
                        description: 'SoulFighter',
                        value: 'soulfighter',
                    },
                    {
                        label: 'Valorant',
                        description: 'Jett',
                        value: 'jett',
                    },
                    {
                        label: 'Valorant',
                        description: 'Razer E KillJoy',
                        value: 'RazerekillJoy',
                    },
                ])
            )



            let chave = {}
            chave.create = Canvas.createCanvas(900, 600)
            chave.context = chave.create.getContext('2d')
            chave.context.font = '68px tagihan'
            chave.context.fillStyle = '#F8F8FF'


            const cmd2 = await perfilID.findOne({
                guildId: interaction.guild.id,
                userId: user.id,

            })

            let foto = ""

            if (cmd2 === null) {

                foto = "././img/shop/default.png"
            } else { foto = cmd2.Img1 }



            Canvas.loadImage(foto).then(async (img) => {
                chave.context.drawImage(img, 0, 0, 900, 600)
                chave.context.textAlign = "left"
                chave.context.font = '37px "aAkhirTahun"'
                chave.context.fillText(`${user.username.toUpperCase()}`, 270, 210)


                chave.context.save()
                await Canvas.loadImage(user.displayAvatarURL({ extension: 'png', size: 1024 })).then(async (interaction) => {
                    chave.context.beginPath()
                    // Calcula as coordenadas e dimensões da imagem e do círculo de recorte deslocados 4 pixels para a esquerda e com tamanho aumentado
                    const centerX = 154 - 4; // Coordenada X do centro do círculo deslocada 4 pixels para a esquerda
                    const centerY = 150 + 2; // Coordenada Y do centro do círculo deslocada 2 pixels para baixo
                    const clipRadius = 115;  // Raio do círculo de recorte (originalmente 115)
                    const imageWidth = clipRadius * 2;
                    const imageHeight = clipRadius * 2;
                    const imageX = centerX - clipRadius;
                    const imageY = centerY - clipRadius;

                    // Desenha o círculo de recorte
                    chave.context.arc(centerX, centerY, clipRadius, 0, Math.PI * 2);
                    chave.context.clip();

                    // Desenha a imagem dentro do círculo de recorte com o tamanho ajustado
                    chave.context.drawImage(interaction, imageX, imageY, imageWidth, imageHeight);

                    // Desenha a borda branca ao redor do círculo de recorte
                    chave.context.lineWidth = 5; // Espessura da linha
                    chave.context.strokeStyle = '101216'; // Cor da borda
                    chave.context.beginPath();
                    chave.context.arc(centerX, centerY, clipRadius, 0, Math.PI * 2);
                    chave.context.stroke();

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
                chave.context.fillText(cmdSobre == null ? `${user.username} Não tem o /perfil personalizado \nUse o botom abaixo para personalizado!` : cmdSobre.sobreMim.match(/.{1,45}/g).join("\n"), 450, 395)

            })

            let list = []
            const userData = await fetch(`https://discord-arts.asure.dev/user/${user.id}`)
            const { data } = await userData.json()
            const { public_flags_array } = data


            if (public_flags_array.includes('NITRO')) list.push("NITRO")
            if (public_flags_array.includes('BOOSTER_1')) list.push("BOOSTER_1")
            if (public_flags_array.includes('BOOSTER_2')) list.push("BOOSTER_2")
            if (public_flags_array.includes('BOOSTER_3')) list.push("BOOSTER_3")
            if (public_flags_array.includes('BOOSTER_6')) list.push("BOOSTER_6")
            if (public_flags_array.includes('BOOSTER_9')) list.push("BOOSTER_9")
            if (public_flags_array.includes('BOOSTER_12')) list.push("BOOSTER_12")
            if (public_flags_array.includes('BOOSTER_15')) list.push("BOOSTER_15")
            if (public_flags_array.includes('BOOSTER_18')) list.push("BOOSTER_18")
            if (public_flags_array.includes('BOOSTER_24')) list.push("BOOSTER_24")


            if (public_flags_array.includes('HOUSE_BALANCE')) list.push("HOUSE_BALANCE")
            if (public_flags_array.includes('HOUSE_BRAVERY')) list.push("HOUSE_BRAVERY")
            if (public_flags_array.includes('HOUSE_BRILLIANCE')) list.push("HOUSE_BRILLIANCE")





            if (!membro.discriminator || membro.discriminator === 0 || membro.tag === `${membro.username}#0`) {

                list.push("TAG")
            }

            if (public_flags_array.includes('ACTIVE_DEVELOPER')) list.push("ACTIVE_DEVELOPER")//desenvolvedor ativo
            if (public_flags_array.includes('EARLY_SUPPORTER')) list.push("EARLY_SUPPORTER")//apoiador inicial
            if (public_flags_array.includes('EARLY_VERIFIED_BOT_DEVELOPER')) list.push("EARLY_VERIFIED_BOT_DEVELOPER")//desenvolvedor verificado de bots pioneiro
            if (public_flags_array.includes('VERIFIED_BOT')) list.push("VERIFIED_BOT")//bot verificado
            if (public_flags_array.includes('DISCORD_CERTIFIED_MODERATOR')) list.push("DISCORD_CERTIFIED_MODERATOR")//ex moderador do discord


            list = list
                .join(",")
                .replace("BOOSTER_1", "<:image:1061728732903133359>")
                .replace("BOOSTER_2", "<:image4:1061732682599514313>")
                .replace("BOOSTER_3", "<:image6:1061732685246107749>")
                .replace("BOOSTER_6", "<:image7:1061732687255179365>")
                .replace("BOOSTER_9", "<:image8:1061732688869998612>")
                .replace("BOOSTER_12", "<:image1:1061732675938955384>")
                .replace("BOOSTER_15", "<:image2:1061732678522638438>")
                .replace("BOOSTER_18", "<:image3:1061732680154235000>")
                .replace("BOOSTER_24", "<:image5:1061732683903938640>")
                .replace("NITRO", "<:4306subscribernitro:1061715332378673203>")


                .replace("HOUSE_BALANCE", `<:5242hypesquadbalance:1061274091623034881>`)
                .replace("HOUSE_BRAVERY", `<:6601hypesquadbravery:1061274089609760908>`)
                .replace("HOUSE_BRILLIANCE", `<:6936hypesquadbrilliance:1061274087193854042>`)

                .replace("TAG", `<:username:1161109720870948884>`)
                .replace("ACTIVE_DEVELOPER", `<:7011activedeveloperbadge:1061277829255413781>`)
                .replace("EARLY_SUPPORTER", `<:Early_Supporter:1063599098135060590>`)
                .replace("EARLY_VERIFIED_BOT_DEVELOPER", `<:Early_Verified_Bot_Developer:1063599974098665592>`)
                .replace("VERIFIED_BOT", `<:verifiedbotbadge:1063600609699311676>`)
                .replace("DISCORD_CERTIFIED_MODERATOR", `<:9765badgemoderators:1063603971471720458>`)



            chave.context.textAlign = "right"
            fundo = -3.4
            chave.context.strokeStyle = '#0a0a0c'
            chave.context.fillStyle = '#0a0a0c'
            chave.context.beginPath()
            chave.context.roundRect(883, 226, fundo * list.length / 2, 70, [10])
            chave.context.fill()
            chave.context.stroke()
            chave.context.textAlign = "right"
            chave.context.font = '50px "up"'

            await Utils.renderEmoji(chave.context, list.split(",").join(" "), 877, 280)


            const mensagem = new discord.AttachmentBuilder(chave.create.toBuffer(), `${interaction.user.tag}.png`)

            if (interaction.user != user) {

                interaction.reply({ files: [mensagem] })

            } else {


                const m = await interaction.reply({ files: [mensagem], components: [btn], fetchReply: true })

                const filtro = (i) => i.user.id === interaction.user.id

                const collector = m.createMessageComponentCollector({ filtro, time: 9000000 })

                collector.on('collect', async (i) => {

                    if (i.user != user) return i.reply({ content: `> \`-\` <a:alerta:1163274838111162499> Essa interação e somente do: ${user}\n> \`-\` Utilize \`\`/perfil\`\` para vizualizar seu perfil.`, ephemeral: true })


                    if (i.customId === 'sms') {

                        i.showModal(modal)

                        client.on('interactionCreate', async interaction => {

                            try {

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


                                    let chave = {};
                                    chave.create = Canvas.createCanvas(900, 600);
                                    chave.context = chave.create.getContext('2d');
                                    chave.context.font = '68px tagihan'; ''
                                    chave.context.fillStyle = '#F8F8FF';



                                    const cmd2 = await perfilID.findOne({
                                        guildId: interaction.guild.id,
                                        userId: user.id
                                    })

                                    let foto = ""

                                    if (cmd2 === null) {

                                        foto = "././img/shop/default.png"
                                    } else { foto = cmd2.Img1 }


                                    Canvas.loadImage(foto).then(async (img) => {
                                        chave.context.drawImage(img, 0, 0, 900, 600);
                                        chave.context.textAlign = "left";
                                        chave.context.font = '37px "aAkhirTahun"';
                                        chave.context.fillText(`${user.username.toUpperCase()}`, 270, 210);


                                        chave.context.save()
                                        await Canvas.loadImage(user.displayAvatarURL({ extension: 'png', size: 1024 })).then(async (interaction) => {
                                            chave.context.beginPath()
                                            // Calcula as coordenadas e dimensões da imagem e do círculo de recorte deslocados 4 pixels para a esquerda e com tamanho aumentado
                                            const centerX = 154 - 4; // Coordenada X do centro do círculo deslocada 4 pixels para a esquerda
                                            const centerY = 150 + 2; // Coordenada Y do centro do círculo deslocada 2 pixels para baixo
                                            const clipRadius = 115;  // Raio do círculo de recorte (originalmente 115)
                                            const imageWidth = clipRadius * 2;
                                            const imageHeight = clipRadius * 2;
                                            const imageX = centerX - clipRadius;
                                            const imageY = centerY - clipRadius;

                                            // Desenha o círculo de recorte
                                            chave.context.arc(centerX, centerY, clipRadius, 0, Math.PI * 2);
                                            chave.context.clip();

                                            // Desenha a imagem dentro do círculo de recorte com o tamanho ajustado
                                            chave.context.drawImage(interaction, imageX, imageY, imageWidth, imageHeight);

                                            // Desenha a borda branca ao redor do círculo de recorte
                                            chave.context.lineWidth = 5; // Espessura da linha
                                            chave.context.strokeStyle = '101216'; // Cor da borda
                                            chave.context.beginPath();
                                            chave.context.arc(centerX, centerY, clipRadius, 0, Math.PI * 2);
                                            chave.context.stroke();

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

                                        chave.context.font = '50px "up"';
                                        chave.context.fillText(`${Saldo.toLocaleString()}`, 120, 400)


                                        lvl = ""

                                        const fetchedLevel = await Level.findOne({
                                            guildId: interaction.guild.id,
                                            userId: user.id,
                                        })


                                        if (fetchedLevel === null) {
                                            lvl = 0
                                        } else { lvl = fetchedLevel.level }

                                        chave.context.font = '50px "up"';
                                        chave.context.fillText(`${lvl}`, 245, 470)

                                        chave.context.textAlign = "center";
                                        chave.context.font = '45px "up"';


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


                                        chave.context.textAlign = "left";
                                        chave.context.font = '22px "up"'
                                        chave.context.strokeStyle = "#a7a7a7";
                                        chave.context.fillStyle = "#a7a7a7"
                                        chave.context.fillText(cmdSobre == null ? `${user.username} Não tem o /perfil personalizado \nUse o botom abaixo para personalizado!` : cmdSobre.sobreMim.match(/.{1,45}/g).join("\n"), 450, 395);

                                    })

                                    let list = [];

                                    const userData = await fetch(`https://discord-arts.asure.dev/user/${user.id}`)
                                    const { data } = await userData.json();
                                    const { public_flags_array } = data;

                                    if (public_flags_array.includes('NITRO')) list.push("NITRO")
                                    if (public_flags_array.includes('BOOSTER_1')) list.push("BOOSTER_1")
                                    if (public_flags_array.includes('BOOSTER_2')) list.push("BOOSTER_2")
                                    if (public_flags_array.includes('BOOSTER_3')) list.push("BOOSTER_3")
                                    if (public_flags_array.includes('BOOSTER_6')) list.push("BOOSTER_6")
                                    if (public_flags_array.includes('BOOSTER_9')) list.push("BOOSTER_9")
                                    if (public_flags_array.includes('BOOSTER_12')) list.push("BOOSTER_12")
                                    if (public_flags_array.includes('BOOSTER_15')) list.push("BOOSTER_15")
                                    if (public_flags_array.includes('BOOSTER_18')) list.push("BOOSTER_18")
                                    if (public_flags_array.includes('BOOSTER_24')) list.push("BOOSTER_24")


                                    if (public_flags_array.includes('HOUSE_BALANCE')) list.push("HOUSE_BALANCE")
                                    if (public_flags_array.includes('HOUSE_BRAVERY')) list.push("HOUSE_BRAVERY")
                                    if (public_flags_array.includes('HOUSE_BRILLIANCE')) list.push("HOUSE_BRILLIANCE")


                                    if (!membro.discriminator || membro.discriminator === 0 || membro.tag === `${membro.username}#0`) {

                                        list.push("TAG")
                                    }

                                    if (public_flags_array.includes('ACTIVE_DEVELOPER')) list.push("ACTIVE_DEVELOPER")//desenvolvedor ativo
                                    if (public_flags_array.includes('EARLY_SUPPORTER')) list.push("EARLY_SUPPORTER")//apoiador inicial
                                    if (public_flags_array.includes('EARLY_VERIFIED_BOT_DEVELOPER')) list.push("EARLY_VERIFIED_BOT_DEVELOPER")//desenvolvedor verificado de bots pioneiro
                                    if (public_flags_array.includes('VERIFIED_BOT')) list.push("VERIFIED_BOT")//bot verificado
                                    if (public_flags_array.includes('DISCORD_CERTIFIED_MODERATOR')) list.push("DISCORD_CERTIFIED_MODERATOR")//ex moderador do discord


                                    list = list
                                        .join(",")
                                        .replace("BOOSTER_1", "<:image:1061728732903133359>")
                                        .replace("BOOSTER_2", "<:image4:1061732682599514313>")
                                        .replace("BOOSTER_3", "<:image6:1061732685246107749>")
                                        .replace("BOOSTER_6", "<:image7:1061732687255179365>")
                                        .replace("BOOSTER_9", "<:image8:1061732688869998612>")
                                        .replace("BOOSTER_12", "<:image1:1061732675938955384>")
                                        .replace("BOOSTER_15", "<:image2:1061732678522638438>")
                                        .replace("BOOSTER_18", "<:image3:1061732680154235000>")
                                        .replace("BOOSTER_24", "<:image5:1061732683903938640>")
                                        .replace("NITRO", "<:4306subscribernitro:1061715332378673203>")


                                        .replace("HOUSE_BALANCE", `<:5242hypesquadbalance:1061274091623034881>`)
                                        .replace("HOUSE_BRAVERY", `<:6601hypesquadbravery:1061274089609760908>`)
                                        .replace("HOUSE_BRILLIANCE", `<:6936hypesquadbrilliance:1061274087193854042>`)

                                        .replace("TAG", `<:username:1161109720870948884>`)
                                        .replace("ACTIVE_DEVELOPER", `<:7011activedeveloperbadge:1061277829255413781>`)
                                        .replace("EARLY_SUPPORTER", `<:Early_Supporter:1063599098135060590>`)
                                        .replace("EARLY_VERIFIED_BOT_DEVELOPER", `<:Early_Verified_Bot_Developer:1063599974098665592>`)
                                        .replace("VERIFIED_BOT", `<:verifiedbotbadge:1063600609699311676>`)
                                        .replace("DISCORD_CERTIFIED_MODERATOR", `<:9765badgemoderators:1063603971471720458>`)



                                    chave.context.textAlign = "right"
                                    fundo = -3.4
                                    chave.context.strokeStyle = '#0a0a0c'
                                    chave.context.fillStyle = '#0a0a0c'
                                    chave.context.beginPath()
                                    chave.context.roundRect(883, 226, fundo * list.length / 2, 70, [10])
                                    chave.context.fill()
                                    chave.context.stroke()
                                    chave.context.textAlign = "right"
                                    chave.context.font = '50px "up"'

                                    await Utils.renderEmoji(chave.context, list.split(",").join(" "), 877, 280);

                                    const mensagem2 = new discord.AttachmentBuilder(chave.create.toBuffer(), `${interaction.user.tag}.png`)

                                    await interaction.editReply({ files: [mensagem2] })



                                }
                            } catch (e) {

                            }

                        })


                    }


                    if (i.customId === 'sk') {

                        i.deferUpdate()

                        const mm = await interaction.editReply({ components: [painel, btnn4], ephemeral: true })
                        const filtro = (i) => i.user.id === interaction.user.id
                        const coletor = mm.createMessageComponentCollector({ filtro, time: 9000000 })


                        coletor.on('collect', async (i) => {

                            try {

                                if (!i.isStringSelectMenu()) return

                                let valor = i.values[0]

                                if (i.customId === "menu") {

                                    const attachments = {
                                        mc: {
                                            path: "././img/shop/minecraft.png",
                                            component: [painel, btnn]
                                        },
                                        sett: {
                                            path: "././img/shop/sett.png",
                                            component: [painel, btnn2]
                                        },

                                        vayne: {
                                            path: "././img/shop/vaynearcoceleste.png",
                                            component: [painel, btnn3]
                                        },

                                        soulfighter: {
                                            path: "././img/shop/soulfighter.png",
                                            component: [painel, btnn5]
                                        },
                                        jett: {
                                            path: "././img/shop/jett.png",
                                            component: [painel, btnn6]
                                        },
                                        RazerekillJoy: {
                                            path: "././img/shop/RazerEKillJoyu.png",
                                            component: [painel, btnn7]
                                        }
                                    }

                                    const attachment = attachments[valor]
                                    if (!attachment) {
                                        console.error(`Valor inválido: ${valor}`)
                                        return
                                    }

                                    const usuarioID = i.user.id;
                                    const guildID = i.guild.id;
                                    const imagemComprada = attachment.path;

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

                                        const file = new discord.AttachmentBuilder(attachment.path, `${i.user.tag}.png`);
                                        await i.update({ files: [file], components: attachment.component })

                                    } else {
                                        const file = new discord.AttachmentBuilder(attachment.path, `${i.user.tag}.png`);

                                        await i.update({ files: [file], components: [painel, verific] })

                                    }

                                }

                            } catch (e) {

                            }
                        })

                    }




                    if (i.customId === 'confirma') {
                        if (!i.isButton()) return
                        const attachment = ("././img/shop/minecraft.png")
                        await i.reply({ content: `> \`+\` <:effect_7889005:1162567929271947274> Skin selecionada com sucesso. Aproveite!`, ephemeral: true })


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

                    if (i.customId === 'confirma2') {
                        if (!i.isButton()) return
                        const attachment = ("././img/shop/sett.png")
                        await i.reply({ content: `> \`+\` <:effect_7889005:1162567929271947274> Skin selecionada com sucesso. Aproveite!`, ephemeral: true })

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

                    if (i.customId === 'confirma3') {
                        if (!i.isButton()) return
                        const attachment = ("././img/shop/vaynearcoceleste.png")
                        await i.reply({ content: `> \`+\` <:effect_7889005:1162567929271947274> Skin selecionada com sucesso. Aproveite!`, ephemeral: true })

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

                    if (i.customId === 'confirma5') {
                        if (!i.isButton()) return
                        const attachment = ("././img/shop/soulfighter.png")
                        await i.reply({ content: `> \`+\` <:effect_7889005:1162567929271947274> Skin selecionada com sucesso. Aproveite!`, ephemeral: true })


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

                    if (i.customId === 'confirma6') {
                        if (!i.isButton()) return
                        const attachment = ("././img/shop/jett.png")
                        await i.reply({ content: `> \`+\` <:effect_7889005:1162567929271947274> Skin selecionada com sucesso. Aproveite!`, ephemeral: true })


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

                    if (i.customId === 'confirma7') {
                        if (!i.isButton()) return
                        const attachment = ("././img/shop/RazerEKillJoyu.png")
                        await i.reply({ content: `> \`+\` <:effect_7889005:1162567929271947274> Skin selecionada com sucesso. Aproveite!`, ephemeral: true })


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




                    if (i.customId === 'volta') {
                        if (!i.isButton()) return


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


                        Canvas.loadImage(foto).then(async (img) => {
                            chave.context.drawImage(img, 0, 0, 900, 600)
                            chave.context.textAlign = "left"
                            chave.context.font = '37px "aAkhirTahun"'
                            chave.context.fillText(`${user.username.toUpperCase()}`, 270, 210)


                            chave.context.save()
                            await Canvas.loadImage(user.displayAvatarURL({ extension: 'png', size: 1024 })).then(async (interaction) => {
                                chave.context.beginPath()
                                // Calcula as coordenadas e dimensões da imagem e do círculo de recorte deslocados 4 pixels para a esquerda e com tamanho aumentado
                                const centerX = 154 - 4; // Coordenada X do centro do círculo deslocada 4 pixels para a esquerda
                                const centerY = 150 + 2; // Coordenada Y do centro do círculo deslocada 2 pixels para baixo
                                const clipRadius = 115;  // Raio do círculo de recorte (originalmente 115)
                                const imageWidth = clipRadius * 2;
                                const imageHeight = clipRadius * 2;
                                const imageX = centerX - clipRadius;
                                const imageY = centerY - clipRadius;

                                // Desenha o círculo de recorte
                                chave.context.arc(centerX, centerY, clipRadius, 0, Math.PI * 2);
                                chave.context.clip();

                                // Desenha a imagem dentro do círculo de recorte com o tamanho ajustado
                                chave.context.drawImage(interaction, imageX, imageY, imageWidth, imageHeight);

                                // Desenha a borda branca ao redor do círculo de recorte
                                chave.context.lineWidth = 5; // Espessura da linha
                                chave.context.strokeStyle = '101216'; // Cor da borda
                                chave.context.beginPath();
                                chave.context.arc(centerX, centerY, clipRadius, 0, Math.PI * 2);
                                chave.context.stroke();

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

                            chave.context.font = '50px "up"';
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
                            chave.context.fillText(cmdSobre == null ? `${user.username} Não tem o /perfil personalizado \nUse o botom abaixo para personalizado!` : cmdSobre.sobreMim.match(/.{1,45}/g).join("\n"), 450, 395)


                        })

                        let list = []
                        const userData = await fetch(`https://discord-arts.asure.dev/user/${user.id}`)
                        const { data } = await userData.json()
                        const { public_flags_array } = data

                        if (public_flags_array.includes('NITRO')) list.push("NITRO")
                        if (public_flags_array.includes('BOOSTER_1')) list.push("BOOSTER_1")
                        if (public_flags_array.includes('BOOSTER_2')) list.push("BOOSTER_2")
                        if (public_flags_array.includes('BOOSTER_3')) list.push("BOOSTER_3")
                        if (public_flags_array.includes('BOOSTER_6')) list.push("BOOSTER_6")
                        if (public_flags_array.includes('BOOSTER_9')) list.push("BOOSTER_9")
                        if (public_flags_array.includes('BOOSTER_12')) list.push("BOOSTER_12")
                        if (public_flags_array.includes('BOOSTER_15')) list.push("BOOSTER_15")
                        if (public_flags_array.includes('BOOSTER_18')) list.push("BOOSTER_18")
                        if (public_flags_array.includes('BOOSTER_24')) list.push("BOOSTER_24")


                        if (public_flags_array.includes('HOUSE_BALANCE')) list.push("HOUSE_BALANCE")
                        if (public_flags_array.includes('HOUSE_BRAVERY')) list.push("HOUSE_BRAVERY")
                        if (public_flags_array.includes('HOUSE_BRILLIANCE')) list.push("HOUSE_BRILLIANCE")


                        if (!membro.discriminator || membro.discriminator === 0 || membro.tag === `${membro.username}#0`) {

                            list.push("TAG")
                        }

                        if (public_flags_array.includes('ACTIVE_DEVELOPER')) list.push("ACTIVE_DEVELOPER")//desenvolvedor ativo
                        if (public_flags_array.includes('EARLY_SUPPORTER')) list.push("EARLY_SUPPORTER")//apoiador inicial
                        if (public_flags_array.includes('EARLY_VERIFIED_BOT_DEVELOPER')) list.push("EARLY_VERIFIED_BOT_DEVELOPER")//desenvolvedor verificado de bots pioneiro
                        if (public_flags_array.includes('VERIFIED_BOT')) list.push("VERIFIED_BOT")//bot verificado
                        if (public_flags_array.includes('DISCORD_CERTIFIED_MODERATOR')) list.push("DISCORD_CERTIFIED_MODERATOR")//ex moderador do discord


                        list = list
                            .join(",")
                            .replace("BOOSTER_1", "<:image:1061728732903133359>")
                            .replace("BOOSTER_2", "<:image4:1061732682599514313>")
                            .replace("BOOSTER_3", "<:image6:1061732685246107749>")
                            .replace("BOOSTER_6", "<:image7:1061732687255179365>")
                            .replace("BOOSTER_9", "<:image8:1061732688869998612>")
                            .replace("BOOSTER_12", "<:image1:1061732675938955384>")
                            .replace("BOOSTER_15", "<:image2:1061732678522638438>")
                            .replace("BOOSTER_18", "<:image3:1061732680154235000>")
                            .replace("BOOSTER_24", "<:image5:1061732683903938640>")
                            .replace("NITRO", "<:4306subscribernitro:1061715332378673203>")


                            .replace("HOUSE_BALANCE", `<:5242hypesquadbalance:1061274091623034881>`)
                            .replace("HOUSE_BRAVERY", `<:6601hypesquadbravery:1061274089609760908>`)
                            .replace("HOUSE_BRILLIANCE", `<:6936hypesquadbrilliance:1061274087193854042>`)

                            .replace("TAG", `<:username:1161109720870948884>`)
                            .replace("ACTIVE_DEVELOPER", `<:7011activedeveloperbadge:1061277829255413781>`)
                            .replace("EARLY_SUPPORTER", `<:Early_Supporter:1063599098135060590>`)
                            .replace("EARLY_VERIFIED_BOT_DEVELOPER", `<:Early_Verified_Bot_Developer:1063599974098665592>`)
                            .replace("VERIFIED_BOT", `<:verifiedbotbadge:1063600609699311676>`)
                            .replace("DISCORD_CERTIFIED_MODERATOR", `<:9765badgemoderators:1063603971471720458>`)



                        chave.context.textAlign = "right"
                        fundo = -3.4
                        chave.context.strokeStyle = '#0a0a0c'
                        chave.context.fillStyle = '#0a0a0c'
                        chave.context.beginPath()
                        chave.context.roundRect(883, 226, fundo * list.length / 2, 70, [10])
                        chave.context.fill()
                        chave.context.stroke()
                        chave.context.textAlign = "right"
                        chave.context.font = '50px "up"'


                        await Utils.renderEmoji(chave.context, list.split(",").join(" "), 877, 280)

                        const mensagem = new discord.AttachmentBuilder(chave.create.toBuffer(), `${interaction.user.tag}.png`)

                        await i.editReply({ files: [mensagem], components: [btn] })


                    }

                    if (i.customId === 'volta2') {
                        if (!i.isButton()) return


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



                        Canvas.loadImage(foto).then(async (img) => {
                            chave.context.drawImage(img, 0, 0, 900, 600)
                            chave.context.textAlign = "left"
                            chave.context.font = '37px "aAkhirTahun"'
                            chave.context.fillText(`${user.username.toUpperCase()}`, 270, 210)


                            chave.context.save()
                            await Canvas.loadImage(user.displayAvatarURL({ extension: 'png', size: 1024 })).then(async (interaction) => {
                                chave.context.beginPath()
                                // Calcula as coordenadas e dimensões da imagem e do círculo de recorte deslocados 4 pixels para a esquerda e com tamanho aumentado
                                const centerX = 154 - 4; // Coordenada X do centro do círculo deslocada 4 pixels para a esquerda
                                const centerY = 150 + 2; // Coordenada Y do centro do círculo deslocada 2 pixels para baixo
                                const clipRadius = 115;  // Raio do círculo de recorte (originalmente 115)
                                const imageWidth = clipRadius * 2;
                                const imageHeight = clipRadius * 2;
                                const imageX = centerX - clipRadius;
                                const imageY = centerY - clipRadius;

                                // Desenha o círculo de recorte
                                chave.context.arc(centerX, centerY, clipRadius, 0, Math.PI * 2);
                                chave.context.clip();

                                // Desenha a imagem dentro do círculo de recorte com o tamanho ajustado
                                chave.context.drawImage(interaction, imageX, imageY, imageWidth, imageHeight);

                                // Desenha a borda branca ao redor do círculo de recorte
                                chave.context.lineWidth = 5; // Espessura da linha
                                chave.context.strokeStyle = '101216'; // Cor da borda
                                chave.context.beginPath();
                                chave.context.arc(centerX, centerY, clipRadius, 0, Math.PI * 2);
                                chave.context.stroke();

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

                            chave.context.font = '50px "up"';
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
                            chave.context.fillText(cmdSobre == null ? `${user.username} Não tem o /perfil personalizado \nUse o botom abaixo para personalizado!` : cmdSobre.sobreMim.match(/.{1,45}/g).join("\n"), 450, 395)

                        })

                        let list = []
                        const userData = await fetch(`https://discord-arts.asure.dev/user/${user.id}`)
                        const { data } = await userData.json()
                        const { public_flags_array } = data

                        if (public_flags_array.includes('NITRO')) list.push("NITRO")
                        if (public_flags_array.includes('BOOSTER_1')) list.push("BOOSTER_1")
                        if (public_flags_array.includes('BOOSTER_2')) list.push("BOOSTER_2")
                        if (public_flags_array.includes('BOOSTER_3')) list.push("BOOSTER_3")
                        if (public_flags_array.includes('BOOSTER_6')) list.push("BOOSTER_6")
                        if (public_flags_array.includes('BOOSTER_9')) list.push("BOOSTER_9")
                        if (public_flags_array.includes('BOOSTER_12')) list.push("BOOSTER_12")
                        if (public_flags_array.includes('BOOSTER_15')) list.push("BOOSTER_15")
                        if (public_flags_array.includes('BOOSTER_18')) list.push("BOOSTER_18")
                        if (public_flags_array.includes('BOOSTER_24')) list.push("BOOSTER_24")


                        if (public_flags_array.includes('HOUSE_BALANCE')) list.push("HOUSE_BALANCE")
                        if (public_flags_array.includes('HOUSE_BRAVERY')) list.push("HOUSE_BRAVERY")
                        if (public_flags_array.includes('HOUSE_BRILLIANCE')) list.push("HOUSE_BRILLIANCE")


                        if (!membro.discriminator || membro.discriminator === 0 || membro.tag === `${membro.username}#0`) {

                            list.push("TAG")
                        }

                        if (public_flags_array.includes('ACTIVE_DEVELOPER')) list.push("ACTIVE_DEVELOPER")//desenvolvedor ativo
                        if (public_flags_array.includes('EARLY_SUPPORTER')) list.push("EARLY_SUPPORTER")//apoiador inicial
                        if (public_flags_array.includes('EARLY_VERIFIED_BOT_DEVELOPER')) list.push("EARLY_VERIFIED_BOT_DEVELOPER")//desenvolvedor verificado de bots pioneiro
                        if (public_flags_array.includes('VERIFIED_BOT')) list.push("VERIFIED_BOT")//bot verificado
                        if (public_flags_array.includes('DISCORD_CERTIFIED_MODERATOR')) list.push("DISCORD_CERTIFIED_MODERATOR")//ex moderador do discord


                        list = list
                            .join(",")
                            .replace("BOOSTER_1", "<:image:1061728732903133359>")
                            .replace("BOOSTER_2", "<:image4:1061732682599514313>")
                            .replace("BOOSTER_3", "<:image6:1061732685246107749>")
                            .replace("BOOSTER_6", "<:image7:1061732687255179365>")
                            .replace("BOOSTER_9", "<:image8:1061732688869998612>")
                            .replace("BOOSTER_12", "<:image1:1061732675938955384>")
                            .replace("BOOSTER_15", "<:image2:1061732678522638438>")
                            .replace("BOOSTER_18", "<:image3:1061732680154235000>")
                            .replace("BOOSTER_24", "<:image5:1061732683903938640>")
                            .replace("NITRO", "<:4306subscribernitro:1061715332378673203>")


                            .replace("HOUSE_BALANCE", `<:5242hypesquadbalance:1061274091623034881>`)
                            .replace("HOUSE_BRAVERY", `<:6601hypesquadbravery:1061274089609760908>`)
                            .replace("HOUSE_BRILLIANCE", `<:6936hypesquadbrilliance:1061274087193854042>`)

                            .replace("TAG", `<:username:1161109720870948884>`)
                            .replace("ACTIVE_DEVELOPER", `<:7011activedeveloperbadge:1061277829255413781>`)
                            .replace("EARLY_SUPPORTER", `<:Early_Supporter:1063599098135060590>`)
                            .replace("EARLY_VERIFIED_BOT_DEVELOPER", `<:Early_Verified_Bot_Developer:1063599974098665592>`)
                            .replace("VERIFIED_BOT", `<:verifiedbotbadge:1063600609699311676>`)
                            .replace("DISCORD_CERTIFIED_MODERATOR", `<:9765badgemoderators:1063603971471720458>`)




                        chave.context.textAlign = "right"
                        fundo = -3.4
                        chave.context.strokeStyle = '#0a0a0c'
                        chave.context.fillStyle = '#0a0a0c'
                        chave.context.beginPath()
                        chave.context.roundRect(883, 226, fundo * list.length / 2, 70, [10])
                        chave.context.fill()
                        chave.context.stroke()
                        chave.context.textAlign = "right"
                        chave.context.font = '50px "up"'

                        await Utils.renderEmoji(chave.context, list.split(",").join(" "), 877, 280)

                        const mensagem = new discord.AttachmentBuilder(chave.create.toBuffer(), `${interaction.user.tag}.png`)

                        await i.editReply({ files: [mensagem], components: [btn] })


                    }

                    if (i.customId === 'volta3') {
                        if (!i.isButton()) return


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

                        Canvas.loadImage(foto).then(async (img) => {
                            chave.context.drawImage(img, 0, 0, 900, 600)
                            chave.context.textAlign = "left"
                            chave.context.font = '37px "aAkhirTahun"'
                            chave.context.fillText(`${user.username.toUpperCase()}`, 270, 210)


                            chave.context.save()
                            await Canvas.loadImage(user.displayAvatarURL({ extension: 'png', size: 1024 })).then(async (interaction) => {
                                chave.context.beginPath()
                                // Calcula as coordenadas e dimensões da imagem e do círculo de recorte deslocados 4 pixels para a esquerda e com tamanho aumentado
                                const centerX = 154 - 4; // Coordenada X do centro do círculo deslocada 4 pixels para a esquerda
                                const centerY = 150 + 2; // Coordenada Y do centro do círculo deslocada 2 pixels para baixo
                                const clipRadius = 115;  // Raio do círculo de recorte (originalmente 115)
                                const imageWidth = clipRadius * 2;
                                const imageHeight = clipRadius * 2;
                                const imageX = centerX - clipRadius;
                                const imageY = centerY - clipRadius;

                                // Desenha o círculo de recorte
                                chave.context.arc(centerX, centerY, clipRadius, 0, Math.PI * 2);
                                chave.context.clip();

                                // Desenha a imagem dentro do círculo de recorte com o tamanho ajustado
                                chave.context.drawImage(interaction, imageX, imageY, imageWidth, imageHeight);

                                // Desenha a borda branca ao redor do círculo de recorte
                                chave.context.lineWidth = 5; // Espessura da linha
                                chave.context.strokeStyle = '101216'; // Cor da borda
                                chave.context.beginPath();
                                chave.context.arc(centerX, centerY, clipRadius, 0, Math.PI * 2);
                                chave.context.stroke();

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

                            chave.context.font = '50px "up"';
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
                            chave.context.fillText(cmdSobre == null ? `${user.username} Não tem o /perfil personalizado \nUse o botom abaixo para personalizado!` : cmdSobre.sobreMim.match(/.{1,45}/g).join("\n"), 450, 395)

                        })

                        let list = []
                        const userData = await fetch(`https://discord-arts.asure.dev/user/${user.id}`)
                        const { data } = await userData.json()
                        const { public_flags_array } = data

                        if (public_flags_array.includes('NITRO')) list.push("NITRO")
                        if (public_flags_array.includes('BOOSTER_1')) list.push("BOOSTER_1")
                        if (public_flags_array.includes('BOOSTER_2')) list.push("BOOSTER_2")
                        if (public_flags_array.includes('BOOSTER_3')) list.push("BOOSTER_3")
                        if (public_flags_array.includes('BOOSTER_6')) list.push("BOOSTER_6")
                        if (public_flags_array.includes('BOOSTER_9')) list.push("BOOSTER_9")
                        if (public_flags_array.includes('BOOSTER_12')) list.push("BOOSTER_12")
                        if (public_flags_array.includes('BOOSTER_15')) list.push("BOOSTER_15")
                        if (public_flags_array.includes('BOOSTER_18')) list.push("BOOSTER_18")
                        if (public_flags_array.includes('BOOSTER_24')) list.push("BOOSTER_24")


                        if (public_flags_array.includes('HOUSE_BALANCE')) list.push("HOUSE_BALANCE")
                        if (public_flags_array.includes('HOUSE_BRAVERY')) list.push("HOUSE_BRAVERY")
                        if (public_flags_array.includes('HOUSE_BRILLIANCE')) list.push("HOUSE_BRILLIANCE")


                        if (!membro.discriminator || membro.discriminator === 0 || membro.tag === `${membro.username}#0`) {

                            list.push("TAG")
                        }

                        if (public_flags_array.includes('ACTIVE_DEVELOPER')) list.push("ACTIVE_DEVELOPER")//desenvolvedor ativo
                        if (public_flags_array.includes('EARLY_SUPPORTER')) list.push("EARLY_SUPPORTER")//apoiador inicial
                        if (public_flags_array.includes('EARLY_VERIFIED_BOT_DEVELOPER')) list.push("EARLY_VERIFIED_BOT_DEVELOPER")//desenvolvedor verificado de bots pioneiro
                        if (public_flags_array.includes('VERIFIED_BOT')) list.push("VERIFIED_BOT")//bot verificado
                        if (public_flags_array.includes('DISCORD_CERTIFIED_MODERATOR')) list.push("DISCORD_CERTIFIED_MODERATOR")//ex moderador do discord


                        list = list
                            .join(",")
                            .replace("BOOSTER_1", "<:image:1061728732903133359>")
                            .replace("BOOSTER_2", "<:image4:1061732682599514313>")
                            .replace("BOOSTER_3", "<:image6:1061732685246107749>")
                            .replace("BOOSTER_6", "<:image7:1061732687255179365>")
                            .replace("BOOSTER_9", "<:image8:1061732688869998612>")
                            .replace("BOOSTER_12", "<:image1:1061732675938955384>")
                            .replace("BOOSTER_15", "<:image2:1061732678522638438>")
                            .replace("BOOSTER_18", "<:image3:1061732680154235000>")
                            .replace("BOOSTER_24", "<:image5:1061732683903938640>")
                            .replace("NITRO", "<:4306subscribernitro:1061715332378673203>")


                            .replace("HOUSE_BALANCE", `<:5242hypesquadbalance:1061274091623034881>`)
                            .replace("HOUSE_BRAVERY", `<:6601hypesquadbravery:1061274089609760908>`)
                            .replace("HOUSE_BRILLIANCE", `<:6936hypesquadbrilliance:1061274087193854042>`)

                            .replace("TAG", `<:username:1161109720870948884>`)
                            .replace("ACTIVE_DEVELOPER", `<:7011activedeveloperbadge:1061277829255413781>`)
                            .replace("EARLY_SUPPORTER", `<:Early_Supporter:1063599098135060590>`)
                            .replace("EARLY_VERIFIED_BOT_DEVELOPER", `<:Early_Verified_Bot_Developer:1063599974098665592>`)
                            .replace("VERIFIED_BOT", `<:verifiedbotbadge:1063600609699311676>`)
                            .replace("DISCORD_CERTIFIED_MODERATOR", `<:9765badgemoderators:1063603971471720458>`)



                        chave.context.textAlign = "right"
                        fundo = -3.4
                        chave.context.strokeStyle = '#0a0a0c'
                        chave.context.fillStyle = '#0a0a0c'
                        chave.context.beginPath()
                        chave.context.roundRect(883, 226, fundo * list.length / 2, 70, [10])
                        chave.context.fill()
                        chave.context.stroke()
                        chave.context.textAlign = "right"
                        chave.context.font = '50px "up"'

                        await Utils.renderEmoji(chave.context, list.split(",").join(" "), 877, 280)

                        const mensagem = new discord.AttachmentBuilder(chave.create.toBuffer(), `${interaction.user.tag}.png`)


                        await i.editReply({ files: [mensagem], components: [btn] })



                    }

                    if (i.customId === 'volta4') {
                        if (!i.isButton()) return


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

                        Canvas.loadImage(foto).then(async (img) => {
                            chave.context.drawImage(img, 0, 0, 900, 600)
                            chave.context.textAlign = "left"
                            chave.context.font = '37px "aAkhirTahun"'
                            chave.context.fillText(`${user.username.toUpperCase()}`, 270, 210)

                            chave.context.save()
                            await Canvas.loadImage(user.displayAvatarURL({ extension: 'png', size: 1024 })).then(async (interaction) => {
                                chave.context.beginPath()
                                // Calcula as coordenadas e dimensões da imagem e do círculo de recorte deslocados 4 pixels para a esquerda e com tamanho aumentado
                                const centerX = 154 - 4; // Coordenada X do centro do círculo deslocada 4 pixels para a esquerda
                                const centerY = 150 + 2; // Coordenada Y do centro do círculo deslocada 2 pixels para baixo
                                const clipRadius = 115;  // Raio do círculo de recorte (originalmente 115)
                                const imageWidth = clipRadius * 2;
                                const imageHeight = clipRadius * 2;
                                const imageX = centerX - clipRadius;
                                const imageY = centerY - clipRadius;

                                // Desenha o círculo de recorte
                                chave.context.arc(centerX, centerY, clipRadius, 0, Math.PI * 2);
                                chave.context.clip();

                                // Desenha a imagem dentro do círculo de recorte com o tamanho ajustado
                                chave.context.drawImage(interaction, imageX, imageY, imageWidth, imageHeight);

                                // Desenha a borda branca ao redor do círculo de recorte
                                chave.context.lineWidth = 5; // Espessura da linha
                                chave.context.strokeStyle = '101216'; // Cor da borda
                                chave.context.beginPath();
                                chave.context.arc(centerX, centerY, clipRadius, 0, Math.PI * 2);
                                chave.context.stroke();

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

                            chave.context.font = '50px "up"';
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
                            chave.context.fillText(cmdSobre == null ? `${user.username} Não tem o /perfil personalizado \nUse o botom abaixo para personalizado!` : cmdSobre.sobreMim.match(/.{1,45}/g).join("\n"), 450, 395)


                        })

                        let list = []
                        const userData = await fetch(`https://discord-arts.asure.dev/user/${user.id}`)
                        const { data } = await userData.json()
                        const { public_flags_array } = data

                        if (public_flags_array.includes('NITRO')) list.push("NITRO")
                        if (public_flags_array.includes('BOOSTER_1')) list.push("BOOSTER_1")
                        if (public_flags_array.includes('BOOSTER_2')) list.push("BOOSTER_2")
                        if (public_flags_array.includes('BOOSTER_3')) list.push("BOOSTER_3")
                        if (public_flags_array.includes('BOOSTER_6')) list.push("BOOSTER_6")
                        if (public_flags_array.includes('BOOSTER_9')) list.push("BOOSTER_9")
                        if (public_flags_array.includes('BOOSTER_12')) list.push("BOOSTER_12")
                        if (public_flags_array.includes('BOOSTER_15')) list.push("BOOSTER_15")
                        if (public_flags_array.includes('BOOSTER_18')) list.push("BOOSTER_18")
                        if (public_flags_array.includes('BOOSTER_24')) list.push("BOOSTER_24")


                        if (public_flags_array.includes('HOUSE_BALANCE')) list.push("HOUSE_BALANCE")
                        if (public_flags_array.includes('HOUSE_BRAVERY')) list.push("HOUSE_BRAVERY")
                        if (public_flags_array.includes('HOUSE_BRILLIANCE')) list.push("HOUSE_BRILLIANCE")


                        if (!membro.discriminator || membro.discriminator === 0 || membro.tag === `${membro.username}#0`) {

                            list.push("TAG")
                        }

                        if (public_flags_array.includes('ACTIVE_DEVELOPER')) list.push("ACTIVE_DEVELOPER")//desenvolvedor ativo
                        if (public_flags_array.includes('EARLY_SUPPORTER')) list.push("EARLY_SUPPORTER")//apoiador inicial
                        if (public_flags_array.includes('EARLY_VERIFIED_BOT_DEVELOPER')) list.push("EARLY_VERIFIED_BOT_DEVELOPER")//desenvolvedor verificado de bots pioneiro
                        if (public_flags_array.includes('VERIFIED_BOT')) list.push("VERIFIED_BOT")//bot verificado
                        if (public_flags_array.includes('DISCORD_CERTIFIED_MODERATOR')) list.push("DISCORD_CERTIFIED_MODERATOR")//ex moderador do discord


                        list = list
                            .join(",")
                            .replace("BOOSTER_1", "<:image:1061728732903133359>")
                            .replace("BOOSTER_2", "<:image4:1061732682599514313>")
                            .replace("BOOSTER_3", "<:image6:1061732685246107749>")
                            .replace("BOOSTER_6", "<:image7:1061732687255179365>")
                            .replace("BOOSTER_9", "<:image8:1061732688869998612>")
                            .replace("BOOSTER_12", "<:image1:1061732675938955384>")
                            .replace("BOOSTER_15", "<:image2:1061732678522638438>")
                            .replace("BOOSTER_18", "<:image3:1061732680154235000>")
                            .replace("BOOSTER_24", "<:image5:1061732683903938640>")
                            .replace("NITRO", "<:4306subscribernitro:1061715332378673203>")


                            .replace("HOUSE_BALANCE", `<:5242hypesquadbalance:1061274091623034881>`)
                            .replace("HOUSE_BRAVERY", `<:6601hypesquadbravery:1061274089609760908>`)
                            .replace("HOUSE_BRILLIANCE", `<:6936hypesquadbrilliance:1061274087193854042>`)

                            .replace("TAG", `<:username:1161109720870948884>`)
                            .replace("ACTIVE_DEVELOPER", `<:7011activedeveloperbadge:1061277829255413781>`)
                            .replace("EARLY_SUPPORTER", `<:Early_Supporter:1063599098135060590>`)
                            .replace("EARLY_VERIFIED_BOT_DEVELOPER", `<:Early_Verified_Bot_Developer:1063599974098665592>`)
                            .replace("VERIFIED_BOT", `<:verifiedbotbadge:1063600609699311676>`)
                            .replace("DISCORD_CERTIFIED_MODERATOR", `<:9765badgemoderators:1063603971471720458>`)




                        chave.context.textAlign = "right"
                        fundo = -3.4
                        chave.context.strokeStyle = '#0a0a0c'
                        chave.context.fillStyle = '#0a0a0c'
                        chave.context.beginPath()
                        chave.context.roundRect(883, 226, fundo * list.length / 2, 70, [10])
                        chave.context.fill()
                        chave.context.stroke()
                        chave.context.textAlign = "right"
                        chave.context.font = '50px "up"'

                        await Utils.renderEmoji(chave.context, list.split(",").join(" "), 877, 280)

                        const mensagem = new discord.AttachmentBuilder(chave.create.toBuffer(), `${interaction.user.tag}.png`)


                        await i.editReply({ files: [mensagem], components: [btn] })

                    }

                    if (i.customId === 'volta5') {
                        if (!i.isButton()) return


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

                        Canvas.loadImage(foto).then(async (img) => {
                            chave.context.drawImage(img, 0, 0, 900, 600)
                            chave.context.textAlign = "left"
                            chave.context.font = '37px "aAkhirTahun"'
                            chave.context.fillText(`${user.username.toUpperCase()}`, 270, 210)


                            chave.context.save()
                            await Canvas.loadImage(user.displayAvatarURL({ extension: 'png', size: 1024 })).then(async (interaction) => {
                                chave.context.beginPath()
                                // Calcula as coordenadas e dimensões da imagem e do círculo de recorte deslocados 4 pixels para a esquerda e com tamanho aumentado
                                const centerX = 154 - 4; // Coordenada X do centro do círculo deslocada 4 pixels para a esquerda
                                const centerY = 150 + 2; // Coordenada Y do centro do círculo deslocada 2 pixels para baixo
                                const clipRadius = 115;  // Raio do círculo de recorte (originalmente 115)
                                const imageWidth = clipRadius * 2;
                                const imageHeight = clipRadius * 2;
                                const imageX = centerX - clipRadius;
                                const imageY = centerY - clipRadius;

                                // Desenha o círculo de recorte
                                chave.context.arc(centerX, centerY, clipRadius, 0, Math.PI * 2);
                                chave.context.clip();

                                // Desenha a imagem dentro do círculo de recorte com o tamanho ajustado
                                chave.context.drawImage(interaction, imageX, imageY, imageWidth, imageHeight);

                                // Desenha a borda branca ao redor do círculo de recorte
                                chave.context.lineWidth = 5; // Espessura da linha
                                chave.context.strokeStyle = '101216'; // Cor da borda
                                chave.context.beginPath();
                                chave.context.arc(centerX, centerY, clipRadius, 0, Math.PI * 2);
                                chave.context.stroke();

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

                            chave.context.font = '50px "up"';
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
                            chave.context.fillText(cmdSobre == null ? `${user.username} Não tem o /perfil personalizado \nUse o botom abaixo para personalizado!` : cmdSobre.sobreMim.match(/.{1,45}/g).join("\n"), 450, 395)

                        })

                        let list = []
                        const userData = await fetch(`https://discord-arts.asure.dev/user/${user.id}`)
                        const { data } = await userData.json()
                        const { public_flags_array } = data

                        if (public_flags_array.includes('NITRO')) list.push("NITRO")
                        if (public_flags_array.includes('BOOSTER_1')) list.push("BOOSTER_1")
                        if (public_flags_array.includes('BOOSTER_2')) list.push("BOOSTER_2")
                        if (public_flags_array.includes('BOOSTER_3')) list.push("BOOSTER_3")
                        if (public_flags_array.includes('BOOSTER_6')) list.push("BOOSTER_6")
                        if (public_flags_array.includes('BOOSTER_9')) list.push("BOOSTER_9")
                        if (public_flags_array.includes('BOOSTER_12')) list.push("BOOSTER_12")
                        if (public_flags_array.includes('BOOSTER_15')) list.push("BOOSTER_15")
                        if (public_flags_array.includes('BOOSTER_18')) list.push("BOOSTER_18")
                        if (public_flags_array.includes('BOOSTER_24')) list.push("BOOSTER_24")


                        if (public_flags_array.includes('HOUSE_BALANCE')) list.push("HOUSE_BALANCE")
                        if (public_flags_array.includes('HOUSE_BRAVERY')) list.push("HOUSE_BRAVERY")
                        if (public_flags_array.includes('HOUSE_BRILLIANCE')) list.push("HOUSE_BRILLIANCE")


                        if (!membro.discriminator || membro.discriminator === 0 || membro.tag === `${membro.username}#0`) {

                            list.push("TAG")
                        }

                        if (public_flags_array.includes('ACTIVE_DEVELOPER')) list.push("ACTIVE_DEVELOPER")//desenvolvedor ativo
                        if (public_flags_array.includes('EARLY_SUPPORTER')) list.push("EARLY_SUPPORTER")//apoiador inicial
                        if (public_flags_array.includes('EARLY_VERIFIED_BOT_DEVELOPER')) list.push("EARLY_VERIFIED_BOT_DEVELOPER")//desenvolvedor verificado de bots pioneiro
                        if (public_flags_array.includes('VERIFIED_BOT')) list.push("VERIFIED_BOT")//bot verificado
                        if (public_flags_array.includes('DISCORD_CERTIFIED_MODERATOR')) list.push("DISCORD_CERTIFIED_MODERATOR")//ex moderador do discord


                        list = list
                            .join(",")
                            .replace("BOOSTER_1", "<:image:1061728732903133359>")
                            .replace("BOOSTER_2", "<:image4:1061732682599514313>")
                            .replace("BOOSTER_3", "<:image6:1061732685246107749>")
                            .replace("BOOSTER_6", "<:image7:1061732687255179365>")
                            .replace("BOOSTER_9", "<:image8:1061732688869998612>")
                            .replace("BOOSTER_12", "<:image1:1061732675938955384>")
                            .replace("BOOSTER_15", "<:image2:1061732678522638438>")
                            .replace("BOOSTER_18", "<:image3:1061732680154235000>")
                            .replace("BOOSTER_24", "<:image5:1061732683903938640>")
                            .replace("NITRO", "<:4306subscribernitro:1061715332378673203>")


                            .replace("HOUSE_BALANCE", `<:5242hypesquadbalance:1061274091623034881>`)
                            .replace("HOUSE_BRAVERY", `<:6601hypesquadbravery:1061274089609760908>`)
                            .replace("HOUSE_BRILLIANCE", `<:6936hypesquadbrilliance:1061274087193854042>`)

                            .replace("TAG", `<:username:1161109720870948884>`)
                            .replace("ACTIVE_DEVELOPER", `<:7011activedeveloperbadge:1061277829255413781>`)
                            .replace("EARLY_SUPPORTER", `<:Early_Supporter:1063599098135060590>`)
                            .replace("EARLY_VERIFIED_BOT_DEVELOPER", `<:Early_Verified_Bot_Developer:1063599974098665592>`)
                            .replace("VERIFIED_BOT", `<:verifiedbotbadge:1063600609699311676>`)
                            .replace("DISCORD_CERTIFIED_MODERATOR", `<:9765badgemoderators:1063603971471720458>`)




                        chave.context.textAlign = "right"
                        fundo = -3.4
                        chave.context.strokeStyle = '#0a0a0c'
                        chave.context.fillStyle = '#0a0a0c'
                        chave.context.beginPath()
                        chave.context.roundRect(883, 226, fundo * list.length / 2, 70, [10])
                        chave.context.fill()
                        chave.context.stroke()
                        chave.context.textAlign = "right"
                        chave.context.font = '50px "up"'

                        await Utils.renderEmoji(chave.context, list.split(",").join(" "), 877, 280)

                        const mensagem = new discord.AttachmentBuilder(chave.create.toBuffer(), `${interaction.user.tag}.png`)


                        await i.editReply({ files: [mensagem], components: [btn] })

                    }

                    if (i.customId === 'volta6') {
                        if (!i.isButton()) return


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

                        Canvas.loadImage(foto).then(async (img) => {
                            chave.context.drawImage(img, 0, 0, 900, 600)
                            chave.context.textAlign = "left"
                            chave.context.font = '37px "aAkhirTahun"'
                            chave.context.fillText(`${user.username.toUpperCase()}`, 270, 210)


                            chave.context.save()
                            await Canvas.loadImage(user.displayAvatarURL({ extension: 'png', size: 1024 })).then(async (interaction) => {
                                chave.context.beginPath()
                                // Calcula as coordenadas e dimensões da imagem e do círculo de recorte deslocados 4 pixels para a esquerda e com tamanho aumentado
                                const centerX = 154 - 4; // Coordenada X do centro do círculo deslocada 4 pixels para a esquerda
                                const centerY = 150 + 2; // Coordenada Y do centro do círculo deslocada 2 pixels para baixo
                                const clipRadius = 115;  // Raio do círculo de recorte (originalmente 115)
                                const imageWidth = clipRadius * 2;
                                const imageHeight = clipRadius * 2;
                                const imageX = centerX - clipRadius;
                                const imageY = centerY - clipRadius;

                                // Desenha o círculo de recorte
                                chave.context.arc(centerX, centerY, clipRadius, 0, Math.PI * 2);
                                chave.context.clip();

                                // Desenha a imagem dentro do círculo de recorte com o tamanho ajustado
                                chave.context.drawImage(interaction, imageX, imageY, imageWidth, imageHeight);

                                // Desenha a borda branca ao redor do círculo de recorte
                                chave.context.lineWidth = 5; // Espessura da linha
                                chave.context.strokeStyle = '101216'; // Cor da borda
                                chave.context.beginPath();
                                chave.context.arc(centerX, centerY, clipRadius, 0, Math.PI * 2);
                                chave.context.stroke();

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

                            chave.context.font = '50px "up"';
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
                            chave.context.fillText(cmdSobre == null ? `${user.username} Não tem o /perfil personalizado \nUse o botom abaixo para personalizado!` : cmdSobre.sobreMim.match(/.{1,45}/g).join("\n"), 450, 395)

                        })

                        let list = []
                        const userData = await fetch(`https://discord-arts.asure.dev/user/${user.id}`)
                        const { data } = await userData.json()
                        const { public_flags_array } = data

                        if (public_flags_array.includes('NITRO')) list.push("NITRO")
                        if (public_flags_array.includes('BOOSTER_1')) list.push("BOOSTER_1")
                        if (public_flags_array.includes('BOOSTER_2')) list.push("BOOSTER_2")
                        if (public_flags_array.includes('BOOSTER_3')) list.push("BOOSTER_3")
                        if (public_flags_array.includes('BOOSTER_6')) list.push("BOOSTER_6")
                        if (public_flags_array.includes('BOOSTER_9')) list.push("BOOSTER_9")
                        if (public_flags_array.includes('BOOSTER_12')) list.push("BOOSTER_12")
                        if (public_flags_array.includes('BOOSTER_15')) list.push("BOOSTER_15")
                        if (public_flags_array.includes('BOOSTER_18')) list.push("BOOSTER_18")
                        if (public_flags_array.includes('BOOSTER_24')) list.push("BOOSTER_24")


                        if (public_flags_array.includes('HOUSE_BALANCE')) list.push("HOUSE_BALANCE")
                        if (public_flags_array.includes('HOUSE_BRAVERY')) list.push("HOUSE_BRAVERY")
                        if (public_flags_array.includes('HOUSE_BRILLIANCE')) list.push("HOUSE_BRILLIANCE")


                        if (!membro.discriminator || membro.discriminator === 0 || membro.tag === `${membro.username}#0`) {

                            list.push("TAG")
                        }

                        if (public_flags_array.includes('ACTIVE_DEVELOPER')) list.push("ACTIVE_DEVELOPER")//desenvolvedor ativo
                        if (public_flags_array.includes('EARLY_SUPPORTER')) list.push("EARLY_SUPPORTER")//apoiador inicial
                        if (public_flags_array.includes('EARLY_VERIFIED_BOT_DEVELOPER')) list.push("EARLY_VERIFIED_BOT_DEVELOPER")//desenvolvedor verificado de bots pioneiro
                        if (public_flags_array.includes('VERIFIED_BOT')) list.push("VERIFIED_BOT")//bot verificado
                        if (public_flags_array.includes('DISCORD_CERTIFIED_MODERATOR')) list.push("DISCORD_CERTIFIED_MODERATOR")//ex moderador do discord


                        list = list
                            .join(",")
                            .replace("BOOSTER_1", "<:image:1061728732903133359>")
                            .replace("BOOSTER_2", "<:image4:1061732682599514313>")
                            .replace("BOOSTER_3", "<:image6:1061732685246107749>")
                            .replace("BOOSTER_6", "<:image7:1061732687255179365>")
                            .replace("BOOSTER_9", "<:image8:1061732688869998612>")
                            .replace("BOOSTER_12", "<:image1:1061732675938955384>")
                            .replace("BOOSTER_15", "<:image2:1061732678522638438>")
                            .replace("BOOSTER_18", "<:image3:1061732680154235000>")
                            .replace("BOOSTER_24", "<:image5:1061732683903938640>")
                            .replace("NITRO", "<:4306subscribernitro:1061715332378673203>")


                            .replace("HOUSE_BALANCE", `<:5242hypesquadbalance:1061274091623034881>`)
                            .replace("HOUSE_BRAVERY", `<:6601hypesquadbravery:1061274089609760908>`)
                            .replace("HOUSE_BRILLIANCE", `<:6936hypesquadbrilliance:1061274087193854042>`)

                            .replace("TAG", `<:username:1161109720870948884>`)
                            .replace("ACTIVE_DEVELOPER", `<:7011activedeveloperbadge:1061277829255413781>`)
                            .replace("EARLY_SUPPORTER", `<:Early_Supporter:1063599098135060590>`)
                            .replace("EARLY_VERIFIED_BOT_DEVELOPER", `<:Early_Verified_Bot_Developer:1063599974098665592>`)
                            .replace("VERIFIED_BOT", `<:verifiedbotbadge:1063600609699311676>`)
                            .replace("DISCORD_CERTIFIED_MODERATOR", `<:9765badgemoderators:1063603971471720458>`)




                        chave.context.textAlign = "right"
                        fundo = -3.4
                        chave.context.strokeStyle = '#0a0a0c'
                        chave.context.fillStyle = '#0a0a0c'
                        chave.context.beginPath()
                        chave.context.roundRect(883, 226, fundo * list.length / 2, 70, [10])
                        chave.context.fill()
                        chave.context.stroke()
                        chave.context.textAlign = "right"
                        chave.context.font = '50px "up"'

                        await Utils.renderEmoji(chave.context, list.split(",").join(" "), 877, 280)

                        const mensagem = new discord.AttachmentBuilder(chave.create.toBuffer(), `${interaction.user.tag}.png`)


                        await i.editReply({ files: [mensagem], components: [btn] })

                    }

                    if (i.customId === 'volta7') {
                        if (!i.isButton()) return


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

                        Canvas.loadImage(foto).then(async (img) => {
                            chave.context.drawImage(img, 0, 0, 900, 600)
                            chave.context.textAlign = "left"
                            chave.context.font = '37px "aAkhirTahun"'
                            chave.context.fillText(`${user.username.toUpperCase()}`, 270, 210)


                            chave.context.save()
                            await Canvas.loadImage(user.displayAvatarURL({ extension: 'png', size: 1024 })).then(async (interaction) => {
                                chave.context.beginPath()
                                // Calcula as coordenadas e dimensões da imagem e do círculo de recorte deslocados 4 pixels para a esquerda e com tamanho aumentado
                                const centerX = 154 - 4; // Coordenada X do centro do círculo deslocada 4 pixels para a esquerda
                                const centerY = 150 + 2; // Coordenada Y do centro do círculo deslocada 2 pixels para baixo
                                const clipRadius = 115;  // Raio do círculo de recorte (originalmente 115)
                                const imageWidth = clipRadius * 2;
                                const imageHeight = clipRadius * 2;
                                const imageX = centerX - clipRadius;
                                const imageY = centerY - clipRadius;

                                // Desenha o círculo de recorte
                                chave.context.arc(centerX, centerY, clipRadius, 0, Math.PI * 2);
                                chave.context.clip();

                                // Desenha a imagem dentro do círculo de recorte com o tamanho ajustado
                                chave.context.drawImage(interaction, imageX, imageY, imageWidth, imageHeight);

                                // Desenha a borda branca ao redor do círculo de recorte
                                chave.context.lineWidth = 5; // Espessura da linha
                                chave.context.strokeStyle = '101216'; // Cor da borda
                                chave.context.beginPath();
                                chave.context.arc(centerX, centerY, clipRadius, 0, Math.PI * 2);
                                chave.context.stroke();

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

                            chave.context.font = '50px "up"';
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
                            chave.context.fillText(cmdSobre == null ? `${user.username} Não tem o /perfil personalizado \nUse o botom abaixo para personalizado!` : cmdSobre.sobreMim.match(/.{1,45}/g).join("\n"), 450, 395)

                        })

                        let list = []
                        const userData = await fetch(`https://discord-arts.asure.dev/user/${user.id}`)
                        const { data } = await userData.json()
                        const { public_flags_array } = data

                        if (public_flags_array.includes('NITRO')) list.push("NITRO")
                        if (public_flags_array.includes('BOOSTER_1')) list.push("BOOSTER_1")
                        if (public_flags_array.includes('BOOSTER_2')) list.push("BOOSTER_2")
                        if (public_flags_array.includes('BOOSTER_3')) list.push("BOOSTER_3")
                        if (public_flags_array.includes('BOOSTER_6')) list.push("BOOSTER_6")
                        if (public_flags_array.includes('BOOSTER_9')) list.push("BOOSTER_9")
                        if (public_flags_array.includes('BOOSTER_12')) list.push("BOOSTER_12")
                        if (public_flags_array.includes('BOOSTER_15')) list.push("BOOSTER_15")
                        if (public_flags_array.includes('BOOSTER_18')) list.push("BOOSTER_18")
                        if (public_flags_array.includes('BOOSTER_24')) list.push("BOOSTER_24")


                        if (public_flags_array.includes('HOUSE_BALANCE')) list.push("HOUSE_BALANCE")
                        if (public_flags_array.includes('HOUSE_BRAVERY')) list.push("HOUSE_BRAVERY")
                        if (public_flags_array.includes('HOUSE_BRILLIANCE')) list.push("HOUSE_BRILLIANCE")


                        if (!membro.discriminator || membro.discriminator === 0 || membro.tag === `${membro.username}#0`) {

                            list.push("TAG")
                        }

                        if (public_flags_array.includes('ACTIVE_DEVELOPER')) list.push("ACTIVE_DEVELOPER")//desenvolvedor ativo
                        if (public_flags_array.includes('EARLY_SUPPORTER')) list.push("EARLY_SUPPORTER")//apoiador inicial
                        if (public_flags_array.includes('EARLY_VERIFIED_BOT_DEVELOPER')) list.push("EARLY_VERIFIED_BOT_DEVELOPER")//desenvolvedor verificado de bots pioneiro
                        if (public_flags_array.includes('VERIFIED_BOT')) list.push("VERIFIED_BOT")//bot verificado
                        if (public_flags_array.includes('DISCORD_CERTIFIED_MODERATOR')) list.push("DISCORD_CERTIFIED_MODERATOR")//ex moderador do discord


                        list = list
                            .join(",")
                            .replace("BOOSTER_1", "<:image:1061728732903133359>")
                            .replace("BOOSTER_2", "<:image4:1061732682599514313>")
                            .replace("BOOSTER_3", "<:image6:1061732685246107749>")
                            .replace("BOOSTER_6", "<:image7:1061732687255179365>")
                            .replace("BOOSTER_9", "<:image8:1061732688869998612>")
                            .replace("BOOSTER_12", "<:image1:1061732675938955384>")
                            .replace("BOOSTER_15", "<:image2:1061732678522638438>")
                            .replace("BOOSTER_18", "<:image3:1061732680154235000>")
                            .replace("BOOSTER_24", "<:image5:1061732683903938640>")
                            .replace("NITRO", "<:4306subscribernitro:1061715332378673203>")


                            .replace("HOUSE_BALANCE", `<:5242hypesquadbalance:1061274091623034881>`)
                            .replace("HOUSE_BRAVERY", `<:6601hypesquadbravery:1061274089609760908>`)
                            .replace("HOUSE_BRILLIANCE", `<:6936hypesquadbrilliance:1061274087193854042>`)

                            .replace("TAG", `<:username:1161109720870948884>`)
                            .replace("ACTIVE_DEVELOPER", `<:7011activedeveloperbadge:1061277829255413781>`)
                            .replace("EARLY_SUPPORTER", `<:Early_Supporter:1063599098135060590>`)
                            .replace("EARLY_VERIFIED_BOT_DEVELOPER", `<:Early_Verified_Bot_Developer:1063599974098665592>`)
                            .replace("VERIFIED_BOT", `<:verifiedbotbadge:1063600609699311676>`)
                            .replace("DISCORD_CERTIFIED_MODERATOR", `<:9765badgemoderators:1063603971471720458>`)




                        chave.context.textAlign = "right"
                        fundo = -3.4
                        chave.context.strokeStyle = '#0a0a0c'
                        chave.context.fillStyle = '#0a0a0c'
                        chave.context.beginPath()
                        chave.context.roundRect(883, 226, fundo * list.length / 2, 70, [10])
                        chave.context.fill()
                        chave.context.stroke()
                        chave.context.textAlign = "right"
                        chave.context.font = '50px "up"'

                        await Utils.renderEmoji(chave.context, list.split(",").join(" "), 877, 280)

                        const mensagem = new discord.AttachmentBuilder(chave.create.toBuffer(), `${interaction.user.tag}.png`)


                        await i.editReply({ files: [mensagem], components: [btn] })

                    }

                    if (i.customId === 'voltaa') {
                        if (!i.isButton()) return


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


                        Canvas.loadImage(foto).then(async (img) => {
                            chave.context.drawImage(img, 0, 0, 900, 600)
                            chave.context.textAlign = "left"
                            chave.context.font = '37px "aAkhirTahun"'
                            chave.context.fillText(`${user.username.toUpperCase()}`, 270, 210)


                            chave.context.save()
                            await Canvas.loadImage(user.displayAvatarURL({ extension: 'png', size: 1024 })).then(async (interaction) => {
                                chave.context.beginPath()
                                // Calcula as coordenadas e dimensões da imagem e do círculo de recorte deslocados 4 pixels para a esquerda e com tamanho aumentado
                                const centerX = 154 - 4; // Coordenada X do centro do círculo deslocada 4 pixels para a esquerda
                                const centerY = 150 + 2; // Coordenada Y do centro do círculo deslocada 2 pixels para baixo
                                const clipRadius = 115;  // Raio do círculo de recorte (originalmente 115)
                                const imageWidth = clipRadius * 2;
                                const imageHeight = clipRadius * 2;
                                const imageX = centerX - clipRadius;
                                const imageY = centerY - clipRadius;

                                // Desenha o círculo de recorte
                                chave.context.arc(centerX, centerY, clipRadius, 0, Math.PI * 2);
                                chave.context.clip();

                                // Desenha a imagem dentro do círculo de recorte com o tamanho ajustado
                                chave.context.drawImage(interaction, imageX, imageY, imageWidth, imageHeight);

                                // Desenha a borda branca ao redor do círculo de recorte
                                chave.context.lineWidth = 5; // Espessura da linha
                                chave.context.strokeStyle = '101216'; // Cor da borda
                                chave.context.beginPath();
                                chave.context.arc(centerX, centerY, clipRadius, 0, Math.PI * 2);
                                chave.context.stroke();

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

                            chave.context.font = '50px "up"';
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
                            chave.context.fillText(cmdSobre == null ? `${user.username} Não tem o /perfil personalizado \nUse o botom abaixo para personalizado!` : cmdSobre.sobreMim.match(/.{1,45}/g).join("\n"), 450, 395)

                        })


                        let list = []
                        const userData = await fetch(`https://discord-arts.asure.dev/user/${user.id}`)
                        const { data } = await userData.json()
                        const { public_flags_array } = data

                        if (public_flags_array.includes('NITRO')) list.push("NITRO")
                        if (public_flags_array.includes('BOOSTER_1')) list.push("BOOSTER_1")
                        if (public_flags_array.includes('BOOSTER_2')) list.push("BOOSTER_2")
                        if (public_flags_array.includes('BOOSTER_3')) list.push("BOOSTER_3")
                        if (public_flags_array.includes('BOOSTER_6')) list.push("BOOSTER_6")
                        if (public_flags_array.includes('BOOSTER_9')) list.push("BOOSTER_9")
                        if (public_flags_array.includes('BOOSTER_12')) list.push("BOOSTER_12")
                        if (public_flags_array.includes('BOOSTER_15')) list.push("BOOSTER_15")
                        if (public_flags_array.includes('BOOSTER_18')) list.push("BOOSTER_18")
                        if (public_flags_array.includes('BOOSTER_24')) list.push("BOOSTER_24")


                        if (public_flags_array.includes('HOUSE_BALANCE')) list.push("HOUSE_BALANCE")
                        if (public_flags_array.includes('HOUSE_BRAVERY')) list.push("HOUSE_BRAVERY")
                        if (public_flags_array.includes('HOUSE_BRILLIANCE')) list.push("HOUSE_BRILLIANCE")


                        if (!membro.discriminator || membro.discriminator === 0 || membro.tag === `${membro.username}#0`) {

                            list.push("TAG")
                        }

                        if (public_flags_array.includes('ACTIVE_DEVELOPER')) list.push("ACTIVE_DEVELOPER")//desenvolvedor ativo
                        if (public_flags_array.includes('EARLY_SUPPORTER')) list.push("EARLY_SUPPORTER")//apoiador inicial
                        if (public_flags_array.includes('EARLY_VERIFIED_BOT_DEVELOPER')) list.push("EARLY_VERIFIED_BOT_DEVELOPER")//desenvolvedor verificado de bots pioneiro
                        if (public_flags_array.includes('VERIFIED_BOT')) list.push("VERIFIED_BOT")//bot verificado
                        if (public_flags_array.includes('DISCORD_CERTIFIED_MODERATOR')) list.push("DISCORD_CERTIFIED_MODERATOR")//ex moderador do discord


                        list = list
                            .join(",")
                            .replace("BOOSTER_1", "<:image:1061728732903133359>")
                            .replace("BOOSTER_2", "<:image4:1061732682599514313>")
                            .replace("BOOSTER_3", "<:image6:1061732685246107749>")
                            .replace("BOOSTER_6", "<:image7:1061732687255179365>")
                            .replace("BOOSTER_9", "<:image8:1061732688869998612>")
                            .replace("BOOSTER_12", "<:image1:1061732675938955384>")
                            .replace("BOOSTER_15", "<:image2:1061732678522638438>")
                            .replace("BOOSTER_18", "<:image3:1061732680154235000>")
                            .replace("BOOSTER_24", "<:image5:1061732683903938640>")
                            .replace("NITRO", "<:4306subscribernitro:1061715332378673203>")


                            .replace("HOUSE_BALANCE", `<:5242hypesquadbalance:1061274091623034881>`)
                            .replace("HOUSE_BRAVERY", `<:6601hypesquadbravery:1061274089609760908>`)
                            .replace("HOUSE_BRILLIANCE", `<:6936hypesquadbrilliance:1061274087193854042>`)

                            .replace("TAG", `<:username:1161109720870948884>`)
                            .replace("ACTIVE_DEVELOPER", `<:7011activedeveloperbadge:1061277829255413781>`)
                            .replace("EARLY_SUPPORTER", `<:Early_Supporter:1063599098135060590>`)
                            .replace("EARLY_VERIFIED_BOT_DEVELOPER", `<:Early_Verified_Bot_Developer:1063599974098665592>`)
                            .replace("VERIFIED_BOT", `<:verifiedbotbadge:1063600609699311676>`)
                            .replace("DISCORD_CERTIFIED_MODERATOR", `<:9765badgemoderators:1063603971471720458>`)




                        chave.context.textAlign = "right"
                        fundo = -3.4
                        chave.context.strokeStyle = '#0a0a0c'
                        chave.context.fillStyle = '#0a0a0c'
                        chave.context.beginPath()
                        chave.context.roundRect(883, 226, fundo * list.length / 2, 70, [10])
                        chave.context.fill()
                        chave.context.stroke()
                        chave.context.textAlign = "right"
                        chave.context.font = '50px "up"'

                        await Utils.renderEmoji(chave.context, list.split(",").join(" "), 877, 280)

                        const mensagem = new discord.AttachmentBuilder(chave.create.toBuffer(), `${interaction.user.tag}.png`)


                        await i.editReply({ files: [mensagem], components: [btn] })

                    }

                    if (i.customId === 'info') {

                        await i.reply({ content: `> \`+\` <:information_2538026:1162569088871174175> Você muda mudar de skin quantas vezes quiser!`, ephemeral: true })

                    }

                    if (i.customId === 'info2') {

                        await i.reply({ content: `> \`+\` <:information_2538026:1162569088871174175> Você muda mudar de skin quantas vezes quiser!`, ephemeral: true })

                    }

                    if (i.customId === 'info3') {

                        await i.reply({ content: `> \`+\` <:information_2538026:1162569088871174175> Você muda mudar de skin quantas vezes quiser!`, ephemeral: true })

                    }

                    if (i.customId === 'info4') {

                        await i.reply({ content: `> \`+\` <:information_2538026:1162569088871174175> Você muda mudar de skin quantas vezes quiser!`, ephemeral: true })

                    }

                    if (i.customId === 'info5') {

                        await i.reply({ content: `> \`+\` <:information_2538026:1162569088871174175> Você muda mudar de skin quantas vezes quiser!`, ephemeral: true })

                    }

                    if (i.customId === 'info6') {

                        await i.reply({ content: `> \`+\` <:information_2538026:1162569088871174175> Você muda mudar de skin quantas vezes quiser!`, ephemeral: true })

                    }

                    if (i.customId === 'info7') {

                        await i.reply({ content: `> \`+\` <:information_2538026:1162569088871174175> Você muda mudar de skin quantas vezes quiser!`, ephemeral: true })

                    }

                })

            }
        }
        else

            if (interaction.channel.id !== cmd1) { interaction.reply({ content: `> \`-\` <a:alerta:1163274838111162499> Você estar tentando usar um comando no canal de texto errado, tente utiliza-lo no canal de <#${cmd1}>.`, ephemeral: true }) }

    }
}