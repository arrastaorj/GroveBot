//By Slimpany
const discord = require('discord.js');
const Canvas = require('canvas');
const { resolve } = require('path')
const comandos = require("../../database/models/comandos")
const idioma = require("../../database/models/language")
const { createCanvas, loadImage, registerFont } = require('canvas')
registerFont("././fonts/aAkhirTahun.ttf", { family: "aAkhirTahun" })
const canvas = require("canvas")

module.exports = {
    name: 'ship',
    description: 'Calcula a porcentagem de compatibilidade de dois usuários',
    type: discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "usuários-1",
            type: discord.ApplicationCommandOptionType.User,
            description: "Mencione o usuário 1.",
            required: true

        },
        {
            name: "usuários-2",
            type: discord.ApplicationCommandOptionType.User,
            description: "Mencione o usuário 2.",
            required: true

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

        if (!cmd)
            return interaction.reply({
                content: `${lang.alertCommandos}`,
                ephemeral: true
            })

        let cmd1 = cmd.canal1

        if (cmd1 === null || cmd1 === false || !client.channels.cache.get(cmd1) || cmd1 === interaction.channel.id) {



            const { options, guild, member } = interaction

            //Canvas 
            Canvas.registerFont(resolve("./fonts/Pelita.otf"), { family: "Pelita" });
            const canvas = Canvas.createCanvas(500, 195);
            const ctx = canvas.getContext('2d');

            const user1 = interaction.options.getUser('usuários-1');
            const user2 = interaction.options.getUser('usuários-2');





            //Imagem De Fundo
            let ImageLoad = 'https://raw.githubusercontent.com/arrastaorj/flags/main/shipalt.png'

            const user1Avatar = user1.displayAvatarURL({ extension: 'png', size: 128 });
            const user2Avatar = user2.displayAvatarURL({ extension: 'png', size: 128 });

            //Função da geração do número aleatório 0 a 105%
            const shipPercentage = percentage();

            //Manipular Imagem
            const backgroundImage = await Canvas.loadImage(ImageLoad);
            ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

            //Faixa do Meio
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            // const faixa = await Canvas.loadImage('https://raw.githubusercontent.com/arrastaorj/flags/main/fundoslc.png');

            // const faixaWidth = canvas.width - 48;
            // const faixaHeight = 106;
            // const faixaX = centerX - faixaWidth / 2;
            // const faixaY = centerY - faixaHeight / 2.1;
            // ctx.drawImage(faixa, faixaX, faixaY, faixaWidth, faixaHeight);

            //Avatar dos Usuários Mencionados Centralizados
            const user1Image = await Canvas.loadImage(user1Avatar);
            const user2Image = await Canvas.loadImage(user2Avatar);
            //Função dos Usuários 
            function drawRoundedImage(ctx, image, x, y, size) {
                const radius = size / 2;
                const borderWidth = 1; // Largura da borda

                // Salve o estado atual do contexto
                ctx.save();

                // Crie um caminho circular para a moldura branca
                ctx.beginPath();
                ctx.arc(x + radius, y + radius, radius + borderWidth, 0, Math.PI * 2);
                ctx.closePath();

                // Defina a cor da borda para branco
                ctx.strokeStyle = "white";
                ctx.lineWidth = borderWidth;

                // Desenhe a borda
                ctx.stroke();

                // Crie um novo caminho circular para a imagem
                ctx.beginPath();
                ctx.arc(x + radius, y + radius, radius, 0, Math.PI * 2);
                ctx.closePath();

                // Recorte a imagem para que ela se ajuste ao círculo
                ctx.clip();

                // Desenhe a imagem dentro do círculo
                ctx.drawImage(image, x, y, size, size);

                // Restaure o estado anterior do contexto
                ctx.restore();
            }

            // Suponha que você tenha um contexto (ctx), duas imagens (user1Image e user2Image) e coordenadas (x, y) para cada imagem.
            drawRoundedImage(ctx, user1Image, 50, 40, 100);
            drawRoundedImage(ctx, user2Image, 330, 40, 100);




            let bar_width = 400;
            ctx.lineJoin = "round";
            ctx.lineWidth = 25;

            let whiteStrokeWidth = 1;
            let yOffset = 10;

            ctx.strokeStyle = "#12111f";
            ctx.lineWidth = 25 + whiteStrokeWidth;
            ctx.strokeRect(30 - whiteStrokeWidth / 2, 181 - whiteStrokeWidth / 2 - yOffset, bar_width + whiteStrokeWidth, 0);

            let gradient = ctx.createLinearGradient(30, 0, 30 + bar_width, 0);
            gradient.addColorStop(0, "#ff0080");
            gradient.addColorStop(1, "#ff4500");

            ctx.strokeStyle = gradient;

            // Ajuste a escala da porcentagem para a largura total da barra
            let scaledPercentage = (shipPercentage / 100) * bar_width;

            ctx.lineWidth = 25;
            ctx.strokeRect(30, 180 - yOffset, scaledPercentage, 0);


            ctx.font = `20px aAkhirTahun`;
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.fillText(`${shipPercentage}%`, 250, 178, 60, 30);



            const attachment = new discord.AttachmentBuilder(canvas.toBuffer(), { name: 'ship.png' });

            //Função para combinar os nomes
            const combinedUsername = combineUsernames(user1, user2);

            //Mensagem aleatória dependendo do resultado do ship
            let message = '';
            if (shipPercentage >= 40 && shipPercentage <= 45) {
                message = `${lang.msg209}`;
            } else if (shipPercentage > 45 && shipPercentage <= 50) {
                message = `${lang.msg210}`;
            } else if (shipPercentage >= 1 && shipPercentage <= 5) {
                message = `${lang.msg211}`;
            } else if (shipPercentage > 5 && shipPercentage <= 10) {
                message = `${lang.msg212}`;
            } else if (shipPercentage >= 11 && shipPercentage <= 15) {
                message = `${lang.msg213}`;
            } else if (shipPercentage > 15 && shipPercentage <= 20) {
                message = `${lang.msg214}`;
            } else if (shipPercentage >= 21 && shipPercentage <= 30) {
                message = `${lang.msg215}`;
            } else if (shipPercentage > 30 && shipPercentage <= 39) {
                message = `${lang.msg216}`;
            } else if (shipPercentage >= 51 && shipPercentage <= 55) {
                message = `${lang.msg217} ${user2}, ${lang.msg2177}`;
            } else if (shipPercentage > 55 && shipPercentage <= 60) {
                message = `${lang.msg218}`;
            } else if (shipPercentage >= 61 && shipPercentage <= 70) {
                message = `${lang.msg219}`;
            } else if (shipPercentage > 70 && shipPercentage <= 80) {
                message = `${lang.msg220}`;
            } else if (shipPercentage >= 81 && shipPercentage <= 85) {
                message = `${lang.msg221} ${user1} & ${user2}, ${lang.msg222}`;
            } else if (shipPercentage > 85 && shipPercentage <= 90) {
                message = `${lang.msg223}`;
            } else if (shipPercentage >= 91 && shipPercentage <= 95) {
                message = `${lang.msg224} ${user1} & ${user2}, ${lang.msg225}`;
            } else if (shipPercentage > 95 && shipPercentage <= 100) {
                message = `${lang.msg226} ${user1} & ${user2} ${lang.msg227}`;
            }

            await interaction.reply({
                files: [attachment],
                content: `${lang.msg228} ${user1} & ${user2}\n${lang.msg229} **${combinedUsername}**\n\n**${message}**`
            })
        }
        else if (interaction.channel.id !== cmd1) {
            interaction.reply({
                content: `${lang.alertCanalErrado} <#${cmd1}>.`,
                ephemeral: true
            })
        }
    }
}

//Funções Abaixo

function percentage() {
    const hearts = Math.floor(Math.random() * 105) + 0;
    return hearts
};

function combineUsernames(user1, user2) {
    const user1Name = user1.displayName;
    const user2Name = user2.displayName;

    const combinedName = `${user1Name.slice(0, Math.floor(user1Name.length / 2))}${user2Name.slice(Math.floor(user2Name.length / 2))}`;

    return combinedName
};

function drawRoundedImage(ctx, image, x, y, size) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(image, x, y, size, size);
    ctx.restore();
}