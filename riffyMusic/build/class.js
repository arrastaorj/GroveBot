const Canvas = require('canvas')
const path = require('path');
const fontPath = path.resolve(__dirname, '../../fonts/ResistSansDisplay-Bold.ttf');
const { colorFetch } = require("./colorFetch");
Canvas.registerFont(fontPath, { family: "ResistSansDisplay-Bold" }) 

class musicCard {
    constructor(options = {}) {
        this.nameCard = options.name || "Nome da Música";
        this.authorCard = options.author || "Nome do Artista/Gravadora";
        this.color = options.color || "#ff0000";
        this.thumbnailCard = options.thumbnail || "";
        this.progressPercentage = options.progress || 0;
        this.startTime = options.startTime || "00:00";
        this.endTime = options.endTime || "00:00";
    }

    setName(name) {
        this.nameCard = name;
        return this;
    }

    setAuthor(author) {
        this.authorCard = author;
        return this;
    }

    setColor(color) {
        this.color = color;
        return this;
    }

    setThumbnail(thumbnail) {
        this.thumbnailCard = thumbnail;
        return this;
    }

    setProgress(progress) {
        this.progressPercentage = progress;
        return this;
    }

    setStartTime(starttime) {
        this.startTime = starttime;
        return this;
    }

    setEndTime(endtime) {
        this.endTime = endtime;
        return this;
    }


    async build() {

        if (!this.nameCard) throw new Error('Missing name parameter');
        if (!this.authorCard) throw new Error('Missing author parameter');
        if (!this.color) this.setColor('ff0000');
        if (!this.thumbnailCard) this.setThumbnail('https://s6.imgcdn.dev/Opo4a.jpg');
        if (!this.progressPercentage) this.setProgress(0);
        if (!this.startTime) this.setStartTime('0:00');
        if (!this.endTime) this.setEndTime('0:00');


        let validatedProgress = parseFloat(this.progressPercentage);
        if (Number.isNaN(validatedProgress) || validatedProgress < 0 || validatedProgress > 100) throw new Error('Parâmetro de progresso inválido, deve estar entre 0 e 100');


        if (validatedProgress < 2) validatedProgress = 2;
        if (validatedProgress > 99) validatedProgress = 99;

        const validatedStartTime = this.startTime || '0:00';
        const validatedEndTime = this.endTime || '0:00';


        const validatedColor = await colorFetch(
            this.color || 'ff0000',
            parseInt(this.brightness) || 0,
            this.thumbnailCard
        )


        let chave = {};
        chave.create = Canvas.createCanvas(720, 268);
        chave.context = chave.create.getContext('2d');



        await Canvas.loadImage("https://raw.githubusercontent.com/arrastaorj/flags/main/cardclass2.png").then(async (img) => {
            chave.context.drawImage(img, 245, 20, 433, 228);
            await Canvas.loadImage(this.thumbnailCard).then(async (img) => {

                // Criar um caminho de recorte para um canto arredondado
                const radius = 15;

                chave.context.save();
                chave.context.beginPath();
                chave.context.moveTo(247, 23 + radius); // Mover para o canto superior esquerdo
                chave.context.arcTo(247, 23, 247 + radius, 23, radius); // Arco superior esquerdo
                chave.context.arcTo(247 + 430, 23, 247 + 430, 23 + radius, radius); // Arco superior direito
                chave.context.arcTo(247 + 430, 23 + 225, 247 + 430 - radius, 23 + 225, radius); // Arco inferior direito
                chave.context.arcTo(247, 23 + 225, 247, 23 + 225 - radius, radius); // Arco inferior esquerdo
                chave.context.closePath();

                // Clip para o caminho de recorte
                chave.context.clip();


                chave.context.globalAlpha = 0.1; // Define a transparência global para 30%
                chave.context.drawImage(img, 247, 23, 430, 225)
                chave.context.globalAlpha = 1.0; // Restaura a transparência global para o valor original
            });
            chave.context.restore();
        });






        // Recorte arredondado
        const x = 20;
        const y = 25;
        const width = 220; //largura
        const height = 220; // altura
        const radius = 20;

        chave.context.save();
        chave.context.beginPath();
        chave.context.moveTo(x + radius, y);
        chave.context.arcTo(x + width, y, x + width, y + height, radius);
        chave.context.arcTo(x + width, y + height, x, y + height, radius);
        chave.context.arcTo(x, y + height, x, y, radius);
        chave.context.arcTo(x, y, x + width, y, radius);
        chave.context.closePath();
        chave.context.clip();

        await Canvas.loadImage(this.thumbnailCard).then(async (i) => {
            chave.context.drawImage(i, -125, 0, 520, 268)
        });
        chave.context.restore();



        if (this.nameCard.length > 15) this.nameCard = `${this.nameCard.slice(0, 14)}...`;
        if (this.authorCard.length > 15) this.authorCard = `${this.authorCard.slice(0, 25)}...`;

        chave.context.fillStyle = `#${validatedColor}`;
        chave.context.font = '45px "ResistSansDisplay-Bold"';
        chave.context.textAlign = "left";
        chave.context.fillText(this.nameCard, 260, 80);
        chave.context.font = '25px "ResistSansDisplay-Bold"';
        chave.context.fillStyle = "#ababab";
        chave.context.fillText(this.authorCard, 260, 115);



        const progressWidth = 400;  // Largura da barra de progresso
        const progressHeight = 20;  // Altura da barra de progresso
        const progressX = 260;      // Coordenada X da barra de progresso
        const progressY = 190;      // Coordenada Y da barra de progresso
        // const progressPercentage = 50;  // Porcentagem de progresso (ajustar conforme necessário)
        const borderRadius = 5;  // Raio das bordas arredondadas

        const ballRadius = 15;  // Raio da bola


        // Adicionar cor de fundo para barra não preenchida
        const backgroundColor = "#ababab";  // Cor de fundo da barra não preenchida
        chave.context.fillStyle = backgroundColor;



        // Desenhar a barra com bordas arredondadas (não preenchida)
        chave.context.beginPath();
        chave.context.moveTo(progressX + borderRadius, progressY);
        chave.context.arcTo(progressX + progressWidth, progressY, progressX + progressWidth, progressY + progressHeight, borderRadius);
        chave.context.arcTo(progressX + progressWidth, progressY + progressHeight, progressX, progressY + progressHeight, borderRadius);
        chave.context.arcTo(progressX, progressY + progressHeight, progressX, progressY, borderRadius);
        chave.context.arcTo(progressX, progressY, progressX + progressWidth, progressY, borderRadius);
        chave.context.closePath();
        chave.context.fill();

        const progressFillWidth = (progressWidth * this.progressPercentage) / 100;

        // Desenhar a barra de progresso preenchida com bordas arredondadas
        chave.context.beginPath();
        chave.context.moveTo(progressX + borderRadius, progressY);
        chave.context.arcTo(progressX + progressFillWidth, progressY, progressX + progressFillWidth, progressY + progressHeight, borderRadius);
        chave.context.arcTo(progressX + progressFillWidth, progressY + progressHeight, progressX, progressY + progressHeight, borderRadius);
        chave.context.arcTo(progressX, progressY + progressHeight, progressX, progressY, borderRadius);
        chave.context.arcTo(progressX, progressY, progressX + progressFillWidth, progressY, borderRadius);
        chave.context.closePath();
        chave.context.fillStyle = `#${validatedColor}`;  // Cor da barra de progresso preenchida
        chave.context.fill();

        // Calcular as coordenadas da bola na ponta da barra preenchida
        const ballX = progressX + 10 + progressFillWidth - ballRadius;
        const ballY = progressY + progressHeight / 2;

        // Desenhar a bola
        chave.context.beginPath();
        chave.context.arc(ballX, ballY, ballRadius, 0, 2 * Math.PI);
        chave.context.fillStyle = `#${validatedColor}`;  // Cor da bola
        chave.context.fill();


        chave.context.fillStyle = "#ffffff"
        chave.context.font = '17px "ResistSansDisplay-Bold"'
        chave.context.fillText(validatedStartTime, 260, 233)
        chave.context.fillText(validatedEndTime, 620, 233)


        return chave.create.toBuffer('image/png');



    }
}


module.exports = musicCard;