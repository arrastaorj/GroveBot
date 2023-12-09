const discord = require("discord.js");
const { images } = require("../../plugins/images.json")
const meme = require("../../database/models/meme")

const idioma = require("../../database/models/language")

module.exports = {
    name: "meme",
    description: "Exibe memes aleatórios.",
    type: discord.ApplicationCommandType.ChatInput,

    async run(client, interaction, args) {

        let lang = await idioma.findOne({
            guildId: interaction.guild.id
        })

        if (!lang || !lang.language) {
            lang = { language: client.language };
        }
        lang = require(`../../languages/${lang.language}.js`)


        const cmd = await meme.findOne({
            guildId: interaction.guild.id
        })

        if (!cmd) return interaction.reply({ content: `${lang.alertMemes}`, ephemeral: true })

        let cmd1 = cmd.canal1

        if (cmd1 === null || cmd1 === false || !client.channels.cache.get(cmd1) || cmd1 === interaction.channel.id) {

            logCommand(interaction);

            const random = Math.floor(Math.random() * images.length)
            const randomMeme = images[random];
            const embed = new discord.EmbedBuilder()
                .setColor("#41b2b0")
                .setTimestamp(new Date)
                .setFooter({ text: `${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true, format: "png" }) })
                .setImage(randomMeme);
            interaction.reply({ embeds: [embed] });
        }
        else

            if (interaction.channel.id !== cmd1) { interaction.reply({ content: `${lang.alertMemes2} <#${cmd1}>.`, ephemeral: true }) }

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