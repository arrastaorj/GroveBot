const discord = require("discord.js");
const canvafy = require("canvafy");
const idioma = require("../../database/models/language")
const comandos = require("../../database/models/comandos")

module.exports = {
    name: "tweet",
    description: "Gera uma imagem de estilo tweet com o comentário do usuário.",
    type: discord.ApplicationCommandType.ChatInput,
    options: [

        {
            name: "comentário",
            type: discord.ApplicationCommandOptionType.String,
            description: "O comentário para o tweet.",
            required: true
        },
        {
            name: "usuário",
            type: discord.ApplicationCommandOptionType.User,
            description: "O usuário para exibir o tweet.",
            required: false
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



            // Obtendo o usuário mencionado ou o próprio autor
            const user = interaction.options.getUser("usuário") || interaction.user;

            // Comentário fornecido pelo usuário
            const comment = interaction.options.getString("comentário");

            // URL do avatar do usuário
            const avatarURL = user.displayAvatarURL({ format: 'png', size: 1024 });

            // Criando a imagem de estilo Tweet usando Canvafy
            const tweetCard = await new canvafy.Tweet()
                .setTheme("dim")  // Tema escuro
                .setUser({ displayName: user.username, username: user.username })
                .setVerified(true)  // Definindo o usuário como verificado
                .setComment(comment)  // Comentário personalizado do usuário
                .setAvatar(avatarURL)  // Avatar do usuário
                .build();

            // Convertendo a imagem em um attachment para enviar no Discord
            const attachment = new discord.AttachmentBuilder(tweetCard, { name: "tweet.png" });

            // Respondendo a interação com a imagem gerada
            await interaction.reply({ files: [attachment] });

        }
        else if (interaction.channel.id !== cmd1) {
            interaction.reply({
                content: `${lang.alertCanalErrado} <#${cmd1}>.`,
                ephemeral: true
            })
        }


    }
};
