const Canvas = require('canvas')
const { colorFetch } = require("./colorFetch");
Canvas.registerFont("././fonts/ResistSansDisplay-Bold.ttf", { family: "ResistSansDisplay-Bold" })
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
        const buffer = await this.draw();
        return buffer;
    }

    async draw() {



        let chave = {};
        chave.create = Canvas.createCanvas(720, 268);
        chave.context = chave.create.getContext('2d');

        await Canvas.loadImage(this.thumbnailCard).then(async (img) => {
            chave.context.globalAlpha = 0.3; // Define a transparência global para 30%
            chave.context.drawImage(img, -280, 0, 1280, 500);
            chave.context.globalAlpha = 1.0; // Restaura a transparência global para o valor original
        });


        const validatedColor = await colorFetch(
            this.color || 'ff0000',
            parseInt(this.brightness) || 0,
            this.thumbnailCard
        )



        // Recorte arredondado
        const x = 40;
        const y = 35;
        const width = 200;
        const height = 200;
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
            chave.context.drawImage(i, -100, 0, 520, 268);
        });

        chave.context.restore();



        if (this.nameCard.length > 15) this.nameCard = `${this.nameCard.slice(0, 27)}...`;
        if (this.authorCard.length > 15) this.authorCard = `${this.authorCard.slice(0, 27)}...`;

        chave.context.fillStyle = "#ffffff";
        chave.context.font = '30px "ResistSansDisplay-Bold"';
        chave.context.textAlign = "left";
        chave.context.fillText(this.nameCard, 260, 100);
        chave.context.font = '20px "ResistSansDisplay-Bold"';
        chave.context.fillText(this.authorCard, 260, 130);



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
        chave.context.font = '20px "ResistSansDisplay-Bold"'
        chave.context.fillText(this.startTime, 260, 235)
        chave.context.fillText(this.endTime, 615, 235)


        const buffer = chave.create.toBuffer('image/png');
        return buffer;
    }
}

module.exports = musicCard;
