const discord = require('discord.js');
const idioma = require("../../database/models/language");
const comandos = require("../../database/models/comandos")

module.exports = {
    name: 'beijar',
    description: 'Dê um beijo em um usuário.',
    type: discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "usuário",
            type: discord.ApplicationCommandOptionType.User,
            description: "O usuário que deseja beijar.",
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

            // Lista de URLs de GIFs de beijar
            const gifs = [
                "https://media.tenor.com/images/26aaa1494b424854824019523c7ba631/tenor.gif",
                "https://media.tenor.com/images/822b11c4ab7843229fdd4abf5ccadf61/tenor.gif",
                "https://media.tenor.com/images/c9fba5642c0d4984d8c44c8cc62826cd/tenor.gif",
                "https://media.tenor.com/images/eb3989651a6759d6edc78346f2b6ba9e/tenor.gif",
                "https://media.tenor.com/images/bd3bb6290ccf67c8051448a3bd0a48fa/tenor.gif",
                "https://media.tenor.com/images/4b75a7e318cb515156bb7bfe5b3bbe6f/tenor.gif",
                "https://media.tenor.com/images/a8b062e0adb61aaa771c1f4a964b5341/tenor.gif",
                "https://media.tenor.com/images/c7ad95d639a588ebd276139bf5ff976c/tenor.gif",
                "https://media.tenor.com/images/d0365e64d1d2872ff4efa1c03c110afb/tenor.gif",
                "https://media.tenor.com/images/0aebff1c6c4b37e0ad90d78e40aab34a/tenor.gif",
                "https://media.tenor.com/images/48963a8342fecf77d8eabfd2ab2e75c1/tenor.gif",
                "https://media.tenor.com/images/9d04996fc79a9a3e1c21c08d8cc8c88b/tenor.gif",
                "https://media.tenor.com/images/9f621e46e1babde8d2e74886e7ff795a/tenor.gif",
                "https://media.tenor.com/images/8370b0a9663706b83fbf182d8b6d44f1/tenor.gif",
                "https://media.tenor.com/images/705fabdf073777fd907c028c8a1b83e4/tenor.gif"
            ];

            // Selecionar um GIF aleatório
            const randomGif = gifs[Math.floor(Math.random() * gifs.length)];

            // Criar a embed com o GIF
            const embed = new discord.EmbedBuilder()
                .setColor("#FF69B4")
                .setDescription(`${interaction.user} deu um beijo em ${user}!`)
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
