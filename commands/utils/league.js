const discord = require("discord.js")
const comandos = require("../../database/models/comandos")
const axios = require('axios')
const fetch = require('node-fetch');
const Canvas = require('canvas')
const { registerFont } = require("canvas");
registerFont("./fonts/Evogria.otf", { family: "Evogria" })
registerFont("./fonts/the.otf", { family: "the" })
registerFont("./fonts/beaufortforlo.otf", { family: "beaufortforlo" })
const translate = require("@iamtraction/google-translate");
const { ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js");
const idioma = require("../../database/models/language")

module.exports = {
    name: "league",
    description: "Configura a DJ Lexa.",
    type: discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "profile",
            type: discord.ApplicationCommandOptionType.Subcommand,
            description: "Exibe o perfil de um jogador em League of Legends.",
            options: [
                {
                    name: 'nick',
                    description: 'Escreva o nome do invocador.',
                    type: discord.ApplicationCommandOptionType.String,
                    required: true
                },
            ],
        },
        {
            name: "viewer",
            type: discord.ApplicationCommandOptionType.Subcommand,
            description: "Veja informações da partida atual de um jogador em League of Legends.",
            options: [
                {
                    name: 'nick',
                    description: 'Escreva o nome do invocador.',
                    type: discord.ApplicationCommandOptionType.String,
                    required: true
                },
            ],
        },
        {
            name: "random",
            type: discord.ApplicationCommandOptionType.Subcommand,
            description: "Campeãoes e Build aleátorios",

        },

    ],


    run: async (client, interaction, args) => {

        let lang = await idioma.findOne({
            guildId: interaction.guild.id
        })
        lang = lang ? require(`../../languages/${lang.language}.js`) : require('../../languages/pt.js')


        let subcommands = interaction.options.getSubcommand()

        const cmd = await comandos.findOne({
            guildId: interaction.guild.id
        })

        if (!cmd) return interaction.reply({
            content: `${lang.alertCommandos}`,
            ephemeral: true
        })

        let cmd1 = cmd.canal1

        if (cmd1 === null || cmd1 === false || !client.channels.cache.get(cmd1) || cmd1 === interaction.channel.id) {


            switch (subcommands) {

                case "random": {

                    let response = await fetch('http://ddragon.leagueoflegends.com/cdn/13.18.1/data/en_US/champion.json');
                    let data = await response.json();
                    let champions = Object.values(data.data);


                    let randomIndex = Math.floor(Math.random() * champions.length);
                    let champion = champions[randomIndex];



                    response = require("../../plugins/items.json")

                    let canvasWidth = 64;
                    let canvasHeight = 64;

                    let canvas = Canvas.createCanvas(canvasWidth * 3, canvasHeight * 2);
                    let ctx = canvas.getContext('2d');

                    let data2 = await response;
                    let items = Object.values(data2.data);

                    let randomItems = [];
                    let selectedItems = [];

                    for (let i = 0; i < 6; i++) {
                        let item;
                        do {
                            let randomIndex = Math.floor(Math.random() * items.length);
                            item = items[randomIndex];
                        } while (selectedItems.includes(item));

                        randomItems.push(item);
                        selectedItems.push(item);

                        let image = await Canvas.loadImage(`http://ddragon.leagueoflegends.com/cdn/13.18.1/img/item/${item.image.full}`);
                        let x = i % 3;
                        let y = Math.floor(i / 3);
                        ctx.drawImage(image, x * canvasWidth, y * canvasHeight, canvasWidth, canvasHeight);
                    }



                    const buffer = canvas.toBuffer();


                    let embed = new discord.EmbedBuilder()
                        .setTitle(`${lang.msg181}`)
                        .setDescription(`${lang.msg182}`)
                        .setImage(`http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.id}_0.jpg`)
                        .setFooter({ text: `${lang.msg183}` })


                    let embed2 = new discord.EmbedBuilder()
                        .setImage('attachment://imagem.png');


                    interaction.reply({ embeds: [embed, embed2], files: [{ attachment: buffer, name: 'imagem.png' }] });
                    break
                }

                case "profile": {

                    await interaction.deferReply();


                    let nick = interaction.options.getString('nick')



                    let apikey = 'RGAPI-08959737-0b6a-43a1-bf43-d1732e687cb9'

                    let urlID = `https://br1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURIComponent(nick)}?api_key=${apikey}`



                    try {

                        let { data } = await axios.get(urlID)


                        sumid = data.id




                        let urlrank = `https://br1.api.riotgames.com/lol/league/v4/entries/by-summoner/${sumid}?api_key=${apikey}`
                        let urlmastery = `https://br1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${sumid}?api_key=${apikey}`





                        let data1 = await axios.get(urlrank).then(r => r.data)
                        let data2 = await axios.get(urlmastery).then(r => r.data)

                        let soloduo = data1.find(fila => fila.queueType === "RANKED_SOLO_5x5")
                        let flex = data1.find(fila => fila.queueType === "RANKED_FLEX_SR")

                        let elosolo = soloduo?.tier
                        let elosolo1 = soloduo?.rank

                        let eloflex = flex?.tier
                        let eloflex1 = flex?.rank

                        let psolov = soloduo?.wins
                        let psolod = soloduo?.losses

                        let pflexv = flex?.wins
                        let pflexd = flex?.losses



                        let spdl = soloduo?.leaguePoints
                        let fpdl = flex?.leaguePoints

                        if (spdl === undefined) spdl = '0'
                        if (fpdl === undefined) fpdl = '0'


                        if (psolov === undefined) psolov = '0'
                        if (psolod === undefined) psolod = '0'

                        if (pflexv === undefined) pflexv = '0'
                        if (pflexd === undefined) pflexd = '0'


                        if (elosolo === undefined) elosolo = 'Unranked'
                        if (elosolo1 === undefined) elosolo1 = ''

                        if (eloflex === undefined) eloflex = 'Unranked'
                        if (eloflex1 === undefined) eloflex1 = ''











                        if (elosolo == 'Unranked') {
                            flag = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/regalia/bannerskins/default.png'
                        } else flag = `https://raw.githubusercontent.com/arrastaorj/flags/main/${elosolo.toLowerCase()}.png`



                        md5s = `${soloduo?.miniSeries?.progress}`
                        md5s = `${soloduo?.miniSeries?.progress}`
                        md5s = `${soloduo?.miniSeries?.progress}`
                        if (md5s === "undefined") md5s = "Não"

                        md5f = `${flex?.miniSeries?.progress}`
                        md5f = `${flex?.miniSeries?.progress}`
                        md5f = `${flex?.miniSeries?.progress}`
                        if (md5f === "undefined") md5f = "Não"


                        json_data_raw = require("../../plugins/champions.json")

                        output = "";
                        for ($i = 0; $i < 161; $i++) {
                            if (json_data_raw[$i]['key'] == data2[0]['championId']) {
                                output = json_data_raw[$i]['name'];
                            }
                        }

                        output1 = "";
                        for ($i = 0; $i < 161; $i++) {
                            if (json_data_raw[$i]['key'] == data2[1]['championId']) {
                                output1 = json_data_raw[$i]['name'];
                            }
                        }

                        output2 = "";
                        for ($i = 0; $i < 161; $i++) {
                            if (json_data_raw[$i]['key'] == data2[2]['championId']) {
                                output2 = json_data_raw[$i]['name'];
                            }
                        }



                        let ferro = "././img/elos/iron.png"
                        let bronze = "././img/elos/bronze.png"
                        let prata = "././img/elos/silver.png"
                        let gold = "././img/elos/gold.png"
                        let plat = "././img/elos/platinum.png"
                        let esme = "././img/elos/emerald.png"
                        let diamante = "././img/elos/diamond.png"
                        let mestre = "././img/elos/master.png"
                        let gmestre = "././img/elos/grandmaster.png"
                        let challenger = "././img/elos/challenger.png"

                        let unranked = "././img/elos/unranked.png"
                        let unranked2 = "././img/elos/unranked.png"

                        let rank1 = ''
                        let rank2 = ''


                        if (soloduo?.tier.includes('IRON')) rank1 = ferro
                        if (soloduo?.tier.includes('BRONZE')) rank1 = bronze
                        if (soloduo?.tier.includes('SILVER')) rank1 = prata
                        if (soloduo?.tier.includes('GOLD')) rank1 = gold
                        if (soloduo?.tier.includes('PLATINUM')) rank1 = plat
                        if (soloduo?.tier.includes('EMERALD')) rank1 = esme
                        if (soloduo?.tier.includes('DIAMOND')) rank1 = diamante
                        if (soloduo?.tier.includes('MASTER')) rank1 = mestre
                        if (soloduo?.tier.includes('GRANDMASTER')) rank1 = gmestre
                        if (soloduo?.tier.includes('CHALLENGER')) rank1 = challenger




                        if (soloduo?.tier == undefined) rank1 = unranked




                        if (flex?.tier.includes('IRON')) rank2 = ferro
                        if (flex?.tier.includes('BRONZE')) rank2 = bronze
                        if (flex?.tier.includes('SILVER')) rank2 = prata
                        if (flex?.tier.startsWith('GOLD')) rank2 = gold
                        if (flex?.tier.startsWith('PLATINUM')) rank2 = plat
                        if (flex?.tier.startsWith('EMERALD')) rank2 = esme
                        if (flex?.tier.includes('DIAMOND')) rank2 = diamante
                        if (flex?.tier.includes('MASTER')) rank2 = mestre
                        if (flex?.tier.includes('GRANDMASTER')) rank2 = gmestre
                        if (flex?.tier?.includes('CHALLENGER')) rank2 = challenger

                        if (flex?.tier == undefined) rank2 = unranked2


                        let m2 = `././img/maestria/mastery-2.png`
                        let m3 = `././img/maestria/mastery-3.png`
                        let m4 = `././img/maestria/mastery-4.png`
                        let m5 = `././img/maestria/mastery-5.png`
                        let m6 = `././img/maestria/mastery-6.png`
                        let m7 = `././img/maestria/mastery-7.png`


                        let maestria = ''
                        let maestria2 = ''
                        let maestria3 = ''

                        if (data2[0].championLevel == "2") maestria = m2
                        if (data2[0].championLevel == "3") maestria = m3
                        if (data2[0].championLevel == "4") maestria = m4
                        if (data2[0].championLevel == "5") maestria = m5
                        if (data2[0].championLevel == "6") maestria = m6
                        if (data2[0].championLevel == "7") maestria = m7

                        if (data2[1].championLevel == "2") maestria2 = m2
                        if (data2[1].championLevel == "3") maestria2 = m3
                        if (data2[1].championLevel == "4") maestria2 = m4
                        if (data2[1].championLevel == "5") maestria2 = m5
                        if (data2[1].championLevel == "6") maestria2 = m6
                        if (data2[1].championLevel == "7") maestria2 = m7

                        if (data2[2].championLevel == "2") maestria3 = m2
                        if (data2[2].championLevel == "3") maestria3 = m3
                        if (data2[2].championLevel == "4") maestria3 = m4
                        if (data2[2].championLevel == "5") maestria3 = m5
                        if (data2[2].championLevel == "6") maestria3 = m6
                        if (data2[2].championLevel == "7") maestria3 = m7


                        let foto = `././img/fundo/fundo.png`

                        let icon = `http://ddragon.leagueoflegends.com/cdn/13.18.1/img/profileicon/${data.profileIconId}.png`

                        // let borda = `https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/ranked-emblem/wings/wings_${elosolo.toLowerCase()}.png`

                        let um = `http://ddragon.leagueoflegends.com/cdn/13.18.1/img/champion/${output}.png`
                        let dois = `http://ddragon.leagueoflegends.com/cdn/13.18.1/img/champion/${output1}.png`
                        let tres = `http://ddragon.leagueoflegends.com/cdn/13.18.1/img/champion/${output2}.png`



                        let chave = {};
                        chave.create = Canvas.createCanvas(1024, 440);
                        chave.context = chave.create.getContext('2d');
                        // chave.context.font = '68px tagihan';
                        chave.context.fillStyle = '#F8F8FF';

                        Canvas.loadImage(foto).then(async (img) => {

                            chave.context.drawImage(img, 0, 0, 1024, 500)



                            await Canvas.loadImage(flag).then(async (i) => {
                                chave.context.drawImage(i, 4, 0, 300, 450);
                            })


                            chave.context.textAlign = "center";
                            chave.context.font = '18px "the"'
                            chave.context.fillText(`${data.name}`, 155, 275) // x lado, quanto maior mais pra direita - y altura, quanto menos mais pra cima

                            chave.context.textAlign = "left";


                            chave.context.font = '30px "Evogria"'




                            const translated = await translate(`${elosolo}`, { from: "en", to: "pt" })
                            chave.context.font = '15px "the"'
                            chave.context.textAlign = "center"
                            chave.context.fillStyle = "#7a786f"
                            chave.context.fillText(`Solo/Duo`, 370, 350)
                            chave.context.fillStyle = "#fffafa"
                            chave.context.fillText(`${translated.text} ${elosolo1}`, 370, 375)
                            chave.context.fillStyle = "#7a786f"
                            chave.context.fillText(`${psolov} Vitórias |  ${spdl} Pdl`, 370, 400)




                            const translated2 = await translate(`${eloflex}`, { from: "en", to: "pt" })
                            chave.context.font = '15px "the"'
                            chave.context.textAlign = "center"
                            chave.context.fillStyle = "#7a786f"
                            chave.context.fillText(`Flex 5V5`, 550, 350)
                            chave.context.fillStyle = "#fffafa"
                            chave.context.fillText(`${translated2.text} ${eloflex1}`, 550, 375)
                            chave.context.fillStyle = "#7a786f"
                            chave.context.fillText(`${pflexv} Vitórias |  ${fpdl} Pdl`, 550, 400)

                            chave.context.fillStyle = "#fffafa"




                            await Canvas.loadImage(rank1).then(async (i) => {
                                chave.context.drawImage(i, 300, 205, 138, 138);
                            })

                            await Canvas.loadImage(rank2).then(async (i) => {
                                chave.context.drawImage(i, 480, 205, 138, 138);
                            })




                            chave.context.font = '30px "the"'

                            chave.context.lineWidth = 3


                            let master2 = `././img/maestria/mastery_level${data2[1].championLevel}banner.png`
                            let master = `././img/maestria/mastery_level${data2[0].championLevel}banner.png`
                            let master3 = `././img/maestria/mastery_level${data2[2].championLevel}banner.png`




                            chave.context.font = '15px "the"'
                            chave.context.textAlign = "center"
                            chave.context.fillText(`${output1}`, 710, 380)

                            chave.context.fillStyle = "#7a786f"
                            chave.context.fillText(`${data2[1].championPoints.toLocaleString()} pts`, 710, 400)
                            chave.context.fillStyle = "#fffafa"

                            await Canvas.loadImage(master2).then(async (i) => {
                                chave.context.drawImage(i, 680, 300, 60, 60);
                            })

                            chave.context.beginPath()
                            chave.context.arc(710, 275, 38, 0, Math.PI * 2, true);
                            chave.context.strokeStyle = "#dfa849"
                            chave.context.stroke()




                            chave.context.save()
                            await Canvas.loadImage(dois).then(async (i) => {

                                chave.context.beginPath()
                                chave.context.arc(710, 275, 35, 0, Math.PI * 2);
                                chave.context.clip()
                                chave.context.drawImage(i, 670, 235, 78, 78);
                            })
                            chave.context.restore()

                            await Canvas.loadImage(maestria2).then(async (i) => {
                                chave.context.drawImage(i, 675, 302, 70, 60);
                            })


                            chave.context.fillText(`${output}`, 810, 360)

                            chave.context.fillStyle = "#7a786f"
                            chave.context.fillText(`${data2[0].championPoints.toLocaleString()} pts`, 810, 380)
                            chave.context.fillStyle = "#fffafa"

                            await Canvas.loadImage(master).then(async (i) => {
                                chave.context.drawImage(i, 780, 280, 60, 60);
                            })

                            chave.context.beginPath()
                            chave.context.arc(810, 255, 38, 0, Math.PI * 2, true);
                            chave.context.strokeStyle = "#dfa849"
                            chave.context.stroke()




                            chave.context.save()
                            await Canvas.loadImage(um).then(async (i) => {
                                chave.context.beginPath()
                                chave.context.arc(810, 255, 35, 0, Math.PI * 2);
                                chave.context.clip()
                                chave.context.drawImage(i, 770, 215, 78, 78);
                            })
                            chave.context.restore()

                            await Canvas.loadImage(maestria).then(async (i) => {
                                chave.context.drawImage(i, 775, 282, 70, 60);
                            })





                            chave.context.fillText(`${output2}`, 910, 380)
                            chave.context.fillStyle = "#7a786f"
                            chave.context.fillText(`${data2[2].championPoints.toLocaleString()} pts`, 910, 400)
                            chave.context.fillStyle = "#fffafa"

                            await Canvas.loadImage(master3).then(async (i) => {
                                chave.context.drawImage(i, 880, 300, 60, 60);
                            })
                            chave.context.beginPath()
                            chave.context.arc(910, 275, 38, 0, Math.PI * 2, true);
                            chave.context.strokeStyle = "#dfa849"
                            chave.context.stroke()
                            chave.context.save()

                            await Canvas.loadImage(tres).then(async (i) => {
                                chave.context.beginPath()
                                chave.context.arc(910, 275, 35, 0, Math.PI * 2);
                                chave.context.clip()
                                chave.context.drawImage(i, 870, 235, 78, 78);
                            })
                            chave.context.restore()

                            await Canvas.loadImage(maestria3).then(async (i) => {
                                chave.context.drawImage(i, 875, 302, 70, 60);
                            })



                            chave.context.save()
                            await Canvas.loadImage(icon).then(async (i) => {
                                chave.context.beginPath()
                                chave.context.arc(155, 145, 68, 0, Math.PI * 2);
                                chave.context.clip()
                                chave.context.drawImage(i, 85, 70, 143, 143); // x lado, quanto maior mais pra direita - y altura, quanto menos mais pra cima
                            })
                            chave.context.restore()

                            // await Canvas.loadImage(borda).then(async (i) => {
                            //     chave.context.drawImage(i, 53, 45, 205, 205); // x lado, quanto maior mais pra direita - y altura, quanto menos mais pra cima
                            // })



                            des = data.puuid

                            let desafio = `https://br1.api.riotgames.com/lol/challenges/v1/player-data/${des}?api_key=RGAPI-08959737-0b6a-43a1-bf43-d1732e687cb9`

                            let data3 = await axios.get(desafio).then(r => r.data)

                            des = data3.preferences

                            desafioraw = data3.challenges
                            titleraw = require("../../plugins/titles.json")


                            titulo1 = "";
                            for ($i = 0; $i < 118; $i++) {
                                if (titleraw.titles[$i]['itemId'] == des.title) {
                                    titulo1 = titleraw.titles[$i]['name'];
                                }
                            }



                            const filter = desafioraw.length


                            desafioo = "";
                            for ($i = 0; $i < filter; $i++) {
                                if (desafioraw[$i]['challengeId'] == des.challengeIds[0]) {
                                    desafioo = desafioraw[$i].level;
                                }
                            }


                            desafioo1 = "";
                            for ($i = 0; $i < filter; $i++) {
                                if (desafioraw[$i]['challengeId'] == des.challengeIds[1]) {
                                    desafioo1 = desafioraw[$i].level;
                                }
                            }


                            desafioo2 = "";
                            for ($i = 0; $i < filter; $i++) {
                                if (desafioraw[$i]['challengeId'] == des.challengeIds[2]) {
                                    desafioo2 = desafioraw[$i].level;
                                }
                            }


                            if (des.challengeIds == "") {
                                desafio1 = 'https://lolstatic-a.akamaihd.net/frontpage/apps/prod/rg-xr-duo-reveal/en_US/8d5e6e779309988804ba564ea5742649b83dc66b/assets/img/portrait-frame.png'

                            } else if (des.challengeIds[0] == -1) {
                                desafio1 = 'https://lolstatic-a.akamaihd.net/frontpage/apps/prod/rg-xr-duo-reveal/en_US/8d5e6e779309988804ba564ea5742649b83dc66b/assets/img/portrait-frame.png'
                            } else {
                                desafio1 = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/challenges/config/${des.challengeIds[0]}/tokens/${desafioo.toLowerCase()}.png`
                            }


                            if (des.challengeIds == "") {
                                desafio2 = 'https://lolstatic-a.akamaihd.net/frontpage/apps/prod/rg-xr-duo-reveal/en_US/8d5e6e779309988804ba564ea5742649b83dc66b/assets/img/portrait-frame.png'

                            } else if (des.challengeIds[1] == -1) {
                                desafio2 = 'https://lolstatic-a.akamaihd.net/frontpage/apps/prod/rg-xr-duo-reveal/en_US/8d5e6e779309988804ba564ea5742649b83dc66b/assets/img/portrait-frame.png'
                            } else {
                                desafio2 = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/challenges/config/${des.challengeIds[1]}/tokens/${desafioo1.toLowerCase()}.png`
                            }


                            if (des.challengeIds == "") {
                                desafio3 = 'https://lolstatic-a.akamaihd.net/frontpage/apps/prod/rg-xr-duo-reveal/en_US/8d5e6e779309988804ba564ea5742649b83dc66b/assets/img/portrait-frame.png'

                            } else if (des.challengeIds[2] == -1) {
                                desafio3 = 'https://lolstatic-a.akamaihd.net/frontpage/apps/prod/rg-xr-duo-reveal/en_US/8d5e6e779309988804ba564ea5742649b83dc66b/assets/img/portrait-frame.png'
                            } else {
                                desafio3 = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/challenges/config/${des.challengeIds[2]}/tokens/${desafioo2.toLowerCase()}.png`
                            }


                            await Canvas.loadImage(desafio1).then(async (i) => {
                                chave.context.drawImage(i, 80, 310, 50, 50)
                            })
                            await Canvas.loadImage(desafio2).then(async (i) => {
                                chave.context.drawImage(i, 130, 310, 50, 50)
                            })
                            await Canvas.loadImage(desafio3).then(async (i) => {
                                chave.context.drawImage(i, 180, 310, 50, 50)
                            })

                            chave.context.textAlign = "center"
                            chave.context.font = '14px "Evogria"'
                            chave.context.fillText(`${data.summonerLevel}`, 156, 216)


                            chave.context.font = '12px "the"'
                            chave.context.fillStyle = "#7a786f"
                            chave.context.fillText(`${titulo1}`, 155, 295)


                            let mensagem = new discord.AttachmentBuilder(chave.create.toBuffer(), `${interaction.user.tag}.png`)

                            //   console.log(data)

                            interaction.editReply({ files: [mensagem] })

                        })

                    } catch (err) {
                        return interaction.editReply({
                            content: `> \`-\` <a:alerta:1163274838111162499> ${lang.msg184} ${interaction.user}, ${lang.msg185} \`${nick}\` ${lang.msg186}`,
                            err,
                            ephemeral: true
                        })
                    }

                    break
                }


            }

        }

        else if (interaction.channel.id !== cmd1) {
            interaction.reply({
                content: `${lang.alertCanalErrado} <#${cmd1}>.`,
                ephemeral: true
            })
        }
    }
}
