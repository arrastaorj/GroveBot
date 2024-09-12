const discord = require('discord.js');
const idioma = require("../../database/models/language.js");
const comandos = require("../../database/models/comandos.js")

module.exports = {
    name: 'lamber',
    description: 'Lamba um usuário.',
    type: discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "usuário",
            type: discord.ApplicationCommandOptionType.User,
            description: "O usuário que deseja lamber.",
            required: true
        },
    ],

    run: async (client, interaction) => {
        let lang = await idioma.findOne({
            guildId: interaction.guild.id
        });
        lang = lang ? require(`../../languages/${lang.language}.js`) : require('../../languages/pt.js');


        const cmd = await comandos.findOne({
            guildId: interaction.guild.id
        })

        if (!cmd) return interaction.reply({
            content: `${lang.alertCommandos}`,
            ephemeral: true
        })


        let cmd1 = cmd.canal1

        if (cmd1 === null || cmd1 === true || !client.channels.cache.get(cmd1) || cmd1 === interaction.channel.id) {


            const user = interaction.options.getUser('usuário');

            // Lista de URLs de GIFs de lamber
            const gifs = [
                'https://media4.giphy.com/media/hIXy8waKP9HMc/giphy.gif?cid=790b761123d1a780ed183bc093eb35272664b8dd1f330ccf&rid=giphy.gif&ct=g',
                'https://media3.giphy.com/media/6BQfJFtXsGqjK/giphy.gif?cid=790b7611f1ac56b88a4d545a3a07d35a830dbd5254c6c366&rid=giphy.gif&ct=g',
                'https://media3.giphy.com/media/UhSNkDdbsXzlm/giphy.gif?cid=790b76118f84457ec0a5405967569867b61dc65bbcb66aac&rid=giphy.gif&ct=g',
                'https://media4.giphy.com/media/YqQt3rkzFXbREtTURJ/giphy.gif?cid=790b761156005b851480694127cf9426a900e9003df74a0c&rid=giphy.gif&ct=g',
                'https://media4.giphy.com/media/l0Iy0QdzD3AA6bgIg/giphy.gif?cid=790b7611f12956be2364b7669ae346e493bac4e834044b24&rid=giphy.gif&ct=g',
                'https://i.imgur.com/7uL0nIE.gif',
                'https://i.imgur.com/SbzoXmp.gif',
                'https://i.imgur.com/H5DZMRQ.gif',
                'https://i.imgur.com/a7kNUdj.gif',
                'https://i.imgur.com/bM6WrY9.gif',
                'https://i.imgur.com/uQHqmnK.gif',
                'https://i.imgur.com/1VEOgcw.gif',
                'https://i.imgur.com/499fO9f.gif',
                'https://i.imgur.com/3jRPs1q.gif',
                'https://i.imgur.com/acFB1IG.gif',
                'https://i.imgur.com/6jZlrvs.gif',
                'https://i.imgur.com/GkqD9Vt.gif'
            ];

            // Selecionar um GIF aleatório
            const randomGif = gifs[Math.floor(Math.random() * gifs.length)];

            // Criar a embed com o GIF
            const embed = new discord.EmbedBuilder()
                .setColor("#ba68c8")
                .setDescription(`${interaction.user} lambeu ${user}!`)
                .setImage(randomGif);

            // Enviar a embed como resposta
            await interaction.reply({ embeds: [embed] });

        }
        else if (interaction.channel.id !== cmd1) {
            interaction.reply({
                content: `${lang.alertCanalErrado} <#${cmd1}>.`,
                ephemeral: true
            })
        }
    }
};
