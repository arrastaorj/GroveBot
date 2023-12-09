const discord = require("discord.js")
const { profileImage } = require("discord-arts");
const { AttachmentBuilder } = require("discord.js")
const comandos = require("../../database/models/comandos")
const idioma = require("../../database/models/language")


module.exports = {
    name: 'profile',
    description: 'Crie uma arte de um usuários no servidor.',
    type: discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'user',
            type: discord.ApplicationCommandOptionType.User,
            description: 'Marque o usuário ou mande o ID.',
            required: true
        },
    ],

    run: async (client, interaction, args) => {


        let lang = await idioma.findOne({
            guildId: interaction.guild.id
        })

        if (!lang || !lang.language) {
            lang = { language: client.language };
        }
        lang = require(`../../languages/${lang.language}.js`)



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
            await interaction.deferReply()





            const userId = interaction.options.getUser("user").id || interaction.user
            const bufferImg = await profileImage(userId)
            const imgAttachment = new AttachmentBuilder(bufferImg, { name: "profile.png" });

            interaction.editReply({ files: [imgAttachment] })
        }
        else if (interaction.channel.id !== cmd1) {
            interaction.reply({
                content: `${lang.alertCanalErrado} <#${cmd1}>.`,
                ephemeral: true
            })
        }
    }
}