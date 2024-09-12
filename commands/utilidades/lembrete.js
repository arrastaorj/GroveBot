const discord = require("discord.js");
const comandos = require("../../database/models/comandos.js")
const idioma = require("../../database/models/language.js")

module.exports = {
    name: "lembrete",
    description: "Define um lembrete para o futuro.",
    type: discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "mensagem",
            type: discord.ApplicationCommandOptionType.String,
            description: "Mensagem do lembrete.",
            required: true
        },
        {
            name: "tempo",
            type: discord.ApplicationCommandOptionType.Integer,
            description: "Tempo em minutos.",
            required: true
        },
    ],

    run: async (client, interaction) => {
        // Carregar o idioma do servidor
        let lang = await idioma.findOne({
            guildId: interaction.guild.id
        });
        lang = lang ? require(`../../languages/${lang.language}.js`) : require('../../languages/pt.js');

        const cmd = await comandos.findOne({
            guildId: interaction.guild.id
        });

        let cmd1 = cmd.canal1;

        // Verificar o canal correto
        if (cmd1 === null || cmd1 === false || !client.channels.cache.get(cmd1) || cmd1 === interaction.channel.id) {

            const mensagem = interaction.options.getString('mensagem');
            const tempo = interaction.options.getInteger('tempo');


            // Verificação se o tempo é um número válido
            if (isNaN(tempo) || tempo <= 0) {
                return interaction.reply({
                    content: 'O tempo inserido é inválido. Por favor, insira um número positivo válido para os minutos.',
                    ephemeral: true
                });
            }

            // Embed de confirmação do lembrete
            const confirmEmbed = new discord.EmbedBuilder()
                .setColor('#ba68c8') // Verde
                .setTitle('Lembrete Definido!')
                .setDescription(`⏳ Irei lembrar você em **${tempo} minutos**.`)
                .addFields(
                    { name: '📝 Mensagem', value: mensagem },
                    { name: '⌚ Tempo', value: `${tempo} minutos` },
                    { name: '👤 Usuário', value: `${interaction.user}` },
                )
                .setFooter({ text: '🔔 Você será notificado em breve!' })
                .setTimestamp();

            // Envia o embed de confirmação ao usuário
            await interaction.reply({
                embeds: [confirmEmbed],
                ephemeral: true
            });

            // Configurar o lembrete
            setTimeout(() => {
                // Embed do lembrete no DM
                const lembreteEmbed = new discord.EmbedBuilder()
                    .setColor('#ba68c8') // Laranja
                    .setTitle('Seu Lembrete!')
                    .setDescription(`🔔 **${mensagem}**`)
                    .addFields(
                        { name: '⌛ Tempo Passado', value: `${tempo} minutos` },
                        { name: '📅 Lembrete Definido', value: `<t:${Math.floor(Date.now() / 1000)}:R>` } // Formatação de tempo relativa
                    )
                    .setFooter({ text: '⏰ Lembre-se de completar sua tarefa!' })
                    .setTimestamp();

                // Enviar o lembrete via DM
                interaction.user.send({ embeds: [lembreteEmbed] }).catch(err => {
                    console.log("Erro ao enviar DM:", err);
                });
            }, tempo * 60000); // Converter minutos para milissegundos

        } else if (interaction.channel.id !== cmd1) {
            interaction.reply({
                content: `${lang.alertCanalErrado} <#${cmd1}>.`,
                ephemeral: true
            });
        }
    }
};
