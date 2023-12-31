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

const banco = require("../../database/models/banco")
const canalComandos = require("../../database/models/comandos")
const idioma = require("../../database/models/language")

module.exports = {
    name: "tranferir",
    description: "Faça uma tranferencia para um membro do servidor.",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "pix",
            type: ApplicationCommandOptionType.String,
            description: "Insira a chave PIX de destino.",
            required: true
        },
        {
            name: "valor",
            type: ApplicationCommandOptionType.Integer,
            description: "Qual o valor?",
            required: true
        },
    ],

    run: async (client, interaction, args) => {


        let lang = await idioma.findOne({
            guildId: interaction.guild.id
        })
        lang = lang ? require(`../../languages/${lang.language}.js`) : require('../../languages/pt.js')


        const canalID = await canalComandos.findOne({
            guildId: interaction.guild.id
        })
        if (!canalID) return interaction.reply({
            content: `${lang.alertCommandos}`,
            ephemeral: true
        })

        let canalPermitido = canalID.canal1
        if (interaction.channel.id !== canalPermitido) {
            return interaction.reply({
                content: `${lang.alertCanalErrado} <#${canalPermitido}>.`,
                ephemeral: true
            })
        }

        
        const chavePix = interaction.options.getString("pix")
        const valor = interaction.options.getInteger("valor")


        const member = await banco.findOne({
            guildId: interaction.guild.id,
            userId: interaction.user.id
        })


        const isValidInteger = /^\d+$/.test(valor);
        if (!isValidInteger || parseInt(valor) <= 0) {
            return interaction.reply({
                content: "Você deve fornecer um valor numérico sem **símbolos** ou **caracteres** especial para realizar o pagamento!",
                ephemeral: true
            });
        }

        if (!member || member.saldo < valor) {
            return interaction.reply({
                content: `> \`-\` Você não tem <:dollar_9729309:1178199735799119892> **${valor.toLocaleString()} GroveCoins** suficiente para realizar o pagamento!`,
                ephemeral: false,
            })
        }

        if (valor < 1 || isNaN(valor) || valor <= 0) {
            return interaction.reply({
                content: "Você tem que colocar um valor numérico maior que **0** para realizar o depósito!",
                ephemeral: true
            });
        }

        const userToPay = await banco.findOne({
            guildId: interaction.guild.id,
            pix: chavePix,
        })

        if (!userToPay) {
            return interaction.reply({
                content: `O usuário que você está tentando pagar não está registrado.`,
                ephemeral: true
            })
        }

        await banco.findOneAndUpdate({
            guildId: interaction.guild.id,
            pix: chavePix,
        },
            {
                $inc: { saldo: parseInt(valor) }
            })

        await banco.findOneAndUpdate({
            guildId: interaction.guild.id,
            userId: interaction.user.id
        },
            {
                $inc: { saldo: -parseInt(valor) }
            })


        await interaction.deferReply({ fetchReply: true })

        const canvas = createCanvas(720, 150),
            ctx = canvas.getContext('2d'),
            bg = await loadImage("https://raw.githubusercontent.com/arrastaorj/flags/main/transCard2.png")
        ctx.drawImage(bg, 0, 0, canvas.width, canvas.height)


        async function drawRoundedImageWithBorder(ctx, imageUrl, x, y, width, height, radius, borderWidth, borderColor) {
            const image = await loadImage(imageUrl);
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.arcTo(x + width, y, x + width, y + height, radius);
            ctx.arcTo(x + width, y + height, x, y + height, radius);
            ctx.arcTo(x, y + height, x, y, radius);
            ctx.arcTo(x, y, x + width, y, radius);
            ctx.closePath();
            ctx.clip();


            ctx.drawImage(image, x, y, width, height);


            ctx.lineWidth = borderWidth;
            ctx.strokeStyle = borderColor;
            ctx.stroke();

            ctx.restore();
        }

        await drawRoundedImageWithBorder(ctx, interaction.user.displayAvatarURL({ extension: 'png', dynamic: false }), 26, 17, 121, 115, 20, 5, 'red');


        async function drawRoundedImageWithBorder(ctx, imageUrl, x, y, width, height, radius, borderWidth, borderColor) {
            const image = await loadImage(imageUrl);
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.arcTo(x + width, y, x + width, y + height, radius);
            ctx.arcTo(x + width, y + height, x, y + height, radius);
            ctx.arcTo(x, y + height, x, y, radius);
            ctx.arcTo(x, y, x + width, y, radius);
            ctx.closePath();
            ctx.clip();


            ctx.drawImage(image, x, y, width, height);

            ctx.lineWidth = borderWidth;
            ctx.strokeStyle = borderColor;
            ctx.stroke();

            ctx.restore();
        }



        const userIdReceived = userToPay.userId;
        const userReceived = await interaction.client.users.fetch(userIdReceived);

        await drawRoundedImageWithBorder(ctx, userReceived.displayAvatarURL({ extension: 'png', dynamic: false }), 571, 17, 121, 115, 20, 5, '#00ffa8');

        ctx.fillStyle = "white"
        ctx.font = "bold 16px Sans"
        ctx.fillText(`Você realizou uma transferência de ${valor.toLocaleString()}\nGroveCoins para ${userReceived.displayName}`, 173, 92)

        const transCard = new AttachmentBuilder(canvas.toBuffer(), "transCard.png")

        return await interaction.editReply({
            content: `**Notificação:**`,
            files: [transCard]
        })

    }
}
