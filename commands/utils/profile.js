const discord = require("discord.js")
const { profileImage } = require("discord-arts");
const { AttachmentBuilder } = require("discord.js")
const comandos = require("../../database/models/comandos")

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


        const cmd = await comandos.findOne({
            guildId: interaction.guild.id
        })

        if (!cmd) return interaction.reply({ content: `> \`-\` <a:alerta:1163274838111162499> Um Adminitrador ainda não configurou o canal para uso de comandos!`, ephemeral: true })

        let cmd1 = cmd.canal1

        if (cmd1 === null || cmd1 === false || !client.channels.cache.get(cmd1) || cmd1 === interaction.channel.id) {
            await interaction.deferReply()


            logCommand(interaction);


            const userId = interaction.options.getUser("user").id || interaction.user
            const bufferImg = await profileImage(userId)
            const imgAttachment = new AttachmentBuilder(bufferImg, { name: "profile.png" });

            interaction.editReply({ files: [imgAttachment] })
        }
        else

            if (interaction.channel.id !== cmd1) { interaction.reply({ content: `> \`-\` <a:alerta:1163274838111162499> Você estar tentando usar um comando no canal de texto errado, tente utiliza-lo no canal de <#${cmd1}>.`, ephemeral: true }) }
    }
}

function logCommand(interaction) {
    const guildId = interaction.guild.name;
    const channelId = '1182895176004423730'; // Substitua pelo ID do canal de logs desejado
    const commandName = interaction.commandName;
    const executor = interaction.member.user.tag;
    const argsUsed = interaction.options.data.map(option => `${option.name}: ${option.value}`).join(', ');

    const channel = interaction.guild.channels.cache.get(channelId);

    if (channel) {
        const logEmbed = new discord.EmbedBuilder()
            .setTitle('Imput Logs')
            .setColor("#6dfef2")
            .addFields(
                {
                    name: "Comando",
                    value: `┕ \`${commandName}\``,
                    inline: false,
                },
                {
                    name: "Executor",
                    value: `┕ \`${executor}\``,
                    inline: false,
                },
                {
                    name: "Servidor",
                    value: `┕ \`${guildId}\``,
                    inline: false,
                },
                {
                    name: "Argumentos",
                    value: `┕ \`${argsUsed}\``,
                    inline: false,
                },
            )
            .setTimestamp()

        channel.send({ embeds: [logEmbed] });
    }
}