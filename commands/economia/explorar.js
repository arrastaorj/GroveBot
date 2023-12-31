const discord = require("discord.js")

const {
    ApplicationCommandType,
    ButtonStyle,
    ActionRowBuilder,
    ButtonBuilder,
    AttachmentBuilder


} = require("discord.js")


const ms = require("../../plugins/parseMs")
const { createCanvas, loadImage, registerFont } = require('canvas')
const banco = require("../../database/models/banco")
const Explorar = require('../../database/models/explorar')
const comandos = require("../../database/models/comandos")

const idioma = require("../../database/models/language")

module.exports = {
    name: "explorar",
    description: "Participe de explorações para ganhar tesouros",
    type: ApplicationCommandType.ChatInput,

    run: async (client, interaction, args) => {

        let lang = await idioma.findOne({
            guildId: interaction.guild.id
        })
        lang = lang ? require(`../../languages/${lang.language}.js`) : require('../../languages/pt.js')


        await interaction.deferReply({ fetchReply: true })

        const amount = Math.floor(800)
        const amount2 = Math.floor(1000 + 4000)

        let btn1 = new ActionRowBuilder().addComponents([
            new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setLabel(`${lang.msg24}`)
                .setEmoji("<:explorador:1061082035176865853>")
                .setCustomId("ex"),
            new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setLabel(`${lang.msg25}`)
                .setEmoji("<:lander:1061082037890596884>")
                .setCustomId("exc")

        ])

        const canvas = createCanvas(900, 532),
            ctx = canvas.getContext('2d'),
            bg = await loadImage("https://raw.githubusercontent.com/arrastaorj/flags/main/explorar.png")
        ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);


        const at = new AttachmentBuilder(canvas.toBuffer(), "explorar.png")

        const query2 = {
            guildId: interaction.guild.id,
            userId: interaction.user.id,
        }

        let user2 = await banco.findOne(query2)




        const Verifc = await Explorar.findOne({
            guildId: interaction.guild.id,
            userId: interaction.user.id,
        })

        if (Verifc) {

            let timeout = 480000

            if (timeout - (Date.now() - Verifc.lastDaily) > 0) {

                const timeLeft = ms(timeout - (Date.now() - Verifc.lastDaily))

                let btn2 = new discord.ActionRowBuilder().addComponents([
                    new discord.ButtonBuilder()
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(true)
                        .setLabel(`${lang.msg26} ${timeLeft.minutes} ${lang.msg27} ${timeLeft.seconds}s`)
                        .setEmoji("<:relogio:1061082925975736380>")
                        .setCustomId("ex"),

                ])

                return interaction.editReply({ files: [at], components: [btn2] })

            } else {

                const timeout2 = 1800000;
                if (timeout2 - (Date.now() - Verifc.lastDaily2) > 0) {

                    const timeLeft = ms(timeout2 - (Date.now() - Verifc.lastDaily2))

                    let btn3 = new discord.ActionRowBuilder().addComponents([
                        new discord.ButtonBuilder()
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(true)
                            .setLabel(`${lang.msg26} ${timeLeft.minutes} ${lang.msg27} ${timeLeft.seconds}s`)
                            .setEmoji("<:relogio:1061082925975736380>")
                            .setCustomId("ex"),

                    ])

                    return interaction.editReply({ files: [at], components: [btn3] })
                }
            }

        }



        const m = await interaction.editReply({ files: [at], components: [btn1] })

        const collector = m.createMessageComponentCollector({ time: 10 * 9000000 });

        collector.on('collect', async (i) => {

            if (i.user.id != interaction.user.id) return i.reply({ content: `${lang.msg28} (\`${interaction.user.tag}\`) ${msg29}`, ephemeral: true })


            switch (i.customId) {

                case `ex`:

                    i.reply({ content: `${lang.msg30} **${amount.toLocaleString()} ${lang.msg31}`, ephemeral: true })

                    let btn3 = new discord.ActionRowBuilder().addComponents([
                        new discord.ButtonBuilder()
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(true)
                            .setLabel(`${lang.msg32}`)
                            .setEmoji("<:relogio:1061082925975736380>")
                            .setCustomId("ex"),

                    ]);

                    let btn5 = new discord.ActionRowBuilder().addComponents([
                        new discord.ButtonBuilder()
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(true)
                            .setLabel(`${lang.msg33}`)
                            .setEmoji("<:relogio:1061082925975736380>")
                            .setCustomId("exxxx"),

                    ]);

                    m.edit({ components: [btn3], fetchReply: true })
                    setTimeout(() => { m.edit({ components: [btn5] }) }, 480000)


                    let Verifc2 = await Explorar.findOne({
                        guildId: interaction.guild.id,
                        userId: interaction.user.id,
                    })

                    if (!Verifc2) {
                        // Se Verifc não existir, crie um novo objeto com lastDaily2 definido.
                        Verifc2 = new Explorar({
                            guildId: interaction.guild.id,
                            userId: interaction.user.id,
                            lastDaily: new Date(),
                        });
                    } else {
                        // Se Verifc existe, apenas atualize a propriedade lastDaily2.
                        Verifc2.lastDaily = new Date();
                    }

                    await Verifc2.save();

                    user2.saldo += amount * 1
                    await user2.save()
                    break;


                case `exc`:

                    i.reply({ content: `${lang.msg34} **${amount2.toLocaleString()} ${lang.msg35}`, ephemeral: true })

                    let btn4 = new discord.ActionRowBuilder().addComponents([
                        new discord.ButtonBuilder()
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(true)
                            .setLabel(`${lang.msg36}`)
                            .setCustomId("ex"),

                    ]);

                    let btn6 = new discord.ActionRowBuilder().addComponents([
                        new discord.ButtonBuilder()
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(true)
                            .setLabel(`${lang.msg37}`)
                            .setCustomId("exxxx"),

                    ]);
                    m.edit({ components: [btn4], fetchReply: true })
                    setTimeout(() => { m.edit({ components: [btn6] }) }, 1800000)

                    let Verifc = await Explorar.findOne({
                        guildId: interaction.guild.id,
                        userId: interaction.user.id,
                    })

                    if (!Verifc) {

                        Verifc = new Explorar({
                            guildId: interaction.guild.id,
                            userId: interaction.user.id,
                            lastDaily2: new Date(),
                        });
                    } else {

                        Verifc.lastDaily2 = new Date();
                    }

                    await Verifc.save();

                    user2.saldo += amount2 * 1
                    await user2.save()

                    break;
                case `fechar`:

            }
        })

    }
}