//By Slimpany
const discord = require('discord.js');
const Canvas = require('canvas');
const { resolve } = require('path')
const comandos = require("../../database/models/comandos")

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

        const cmd = await comandos.findOne({
            guildId: interaction.guild.id
        })

        if (!cmd) return interaction.reply({ content: `> \`+\` Um Adminitrador ainda não configurou o canal para uso de comandos!`, ephemeral: true })

        let cmd1 = cmd.canal1

        if (cmd1 === null || cmd1 === false || !client.channels.cache.get(cmd1) || cmd1 === interaction.channel.id) {



            const { options, guild, member } = interaction

            //Canvas 
            Canvas.registerFont(resolve("./fonts/Pelita.otf"), { family: "Pelita" });
            const canvas = Canvas.createCanvas(480, 195);
            const ctx = canvas.getContext('2d');

            const user1 = interaction.options.getUser('usuários-1');
            const user2 = interaction.options.getUser('usuários-2');

            //Imagem De Fundo
            let ImageLoad = 'https://raw.githubusercontent.com/arrastaorj/flags/main/fundoship.jpg'

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

            const faixa = await Canvas.loadImage('https://raw.githubusercontent.com/arrastaorj/flags/main/fundoslc.png');

            const faixaWidth = canvas.width - 48;
            const faixaHeight = 106;
            const faixaX = centerX - faixaWidth / 2;
            const faixaY = centerY - faixaHeight / 2.1;
            ctx.drawImage(faixa, faixaX, faixaY, faixaWidth, faixaHeight);

            //Avatar dos Usuários Mencionados Centralizados
            const user1Image = await Canvas.loadImage(user1Avatar);
            const user2Image = await Canvas.loadImage(user2Avatar);
            //Função dos Usuários 
            drawRoundedImage(ctx, user1Image, 50, 50, 100);
            drawRoundedImage(ctx, user2Image, 330, 50, 100);

            //Configuração da Fonte
            ctx.font = `50px Pelita`;
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.fillText(`${shipPercentage}%`, canvas.width / 2, canvas.height / 1.6);

            const attachment = new discord.AttachmentBuilder(canvas.toBuffer(), { name: 'ship.png' });

            //Função para combinar os nomes
            const combinedUsername = combineUsernames(user1, user2);

            //Mensagem aleatória dependendo do resultado do ship
            let message = '';
            if (shipPercentage >= 40 && shipPercentage <= 50) {
                message = 'Eles parecem ter uma boa conexão!';
            } else if (shipPercentage >= 1 && shipPercentage <= 10) {
                message = 'Hmmm, talvez seja impossível os dois virar um casal, mas não desista!';
            } else if (shipPercentage >= 11 && shipPercentage <= 20) {
                message = 'Hmmm, talvez ainda haja uma chance muito pequena!';
            } else if (shipPercentage >= 21 && shipPercentage <= 39) {
                message = 'Estou começando a acreditar que os dois possam ser um belo casal!';
            } else if (shipPercentage >= 51 && shipPercentage <= 69) {
                message = `Vai depender de ${user2}, por mim eu aprovo o casal!`;
            } else if (shipPercentage >= 70 && shipPercentage <= 89) {
                message = 'AWNNN QUE CASAL FOFO!, me convidem para o casamento...';
            } else if (shipPercentage >= 90 && shipPercentage <= 105) {
                message = `O amor transcendeu todos os limites!, ${user1} & ${user2}, o casamento dos dois está marcado para hoje!`
            };

            const embed = new discord.EmbedBuilder()
                .setDescription(`${message}`)
                .setColor('df6ccf')
                .setImage(`attachment://ship.png`);


            await interaction.reply({ embeds: [embed], files: [attachment], content: `🔥 | Casal: ${user1} & ${user2}\n🎆 | Nome do Ship: **${combinedUsername}**\n💝 | Compatibilidade: **${shipPercentage}%**` });
        }
        else

            if (interaction.channel.id !== cmd1) { interaction.reply({ content: `Você estar tentando usar um comando no canal de texto errado, tente utiliza-lo no canal de <#${cmd1}>.`, ephemeral: true }) }

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
};