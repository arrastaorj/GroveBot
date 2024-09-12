const discord = require('discord.js');
const idioma = require("../../database/models/language");
const comandos = require("../../database/models/comandos")

module.exports = {
    name: 'abraçar',
    description: 'Dê um abraço em um usuário.',
    type: discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "usuário",
            type: discord.ApplicationCommandOptionType.User,
            description: "O usuário que deseja abraçar.",
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

            // Lista de URLs de GIFs de abraçar
            const gifs = [
                'https://i.imgur.com/4oLIrwj.gif',
                'https://i.imgur.com/UMm95sV.gif',
                'https://i.imgur.com/wOmoeF8.gif',
                'https://i.imgur.com/r9aU2xv.gif',
                'https://i.imgur.com/nrdYNtL.gif',
                'https://i.imgur.com/BPLqSJC.gif',
                'https://i.imgur.com/ntqYLGl.gif',
                'https://i.imgur.com/v47M1S4.gif',
                'https://i.imgur.com/82xVqUg.gif',
                'https://i.imgur.com/6qYOUQF.gif',
                "https://media.tenor.com/images/6083ba11631dd577bcc271268d010832/tenor.gif",
                "https://media.tenor.com/images/ca682cecd6bff521e400f984502f370c/tenor.gif",
                "https://media.tenor.com/images/b5bc982d3a21d3bf765e6f69db5af360/tenor.gif",
                "https://media.tenor.com/images/6b371d1268accf30a8afe15d63f977e0/tenor.gif",
                "https://media.tenor.com/images/0fa04c9469321f126bc252c9bc7b96d0/tenor.gif",
                "https://media.tenor.com/images/9374f817614b1e13c78c46102c2d3d00/tenor.gif"
            ];

            // Selecionar um GIF aleatório
            const randomGif = gifs[Math.floor(Math.random() * gifs.length)];

            // Criar a embed com o GIF
            const embed = new discord.EmbedBuilder()
                .setColor("#FFC0CB")
                .setDescription(`${interaction.user} deu um abraço em ${user}!`)
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
