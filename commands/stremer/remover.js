const {
    ApplicationCommandType,
    EmbedBuilder,
    PermissionFlagsBits,
    ApplicationCommandOptionType,
} = require('discord.js');
const Stremer = require('../../database/models/stremer'); // Importando o modelo do MongoDB
const idioma = require("../../database/models/language");

module.exports = {
    name: "remover",
    description: "Excluir a configuração de notificação de um streamer.",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'stremer',
            description: 'Excluir a configuração de notificação de um streamer.',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'usuario',
                    description: 'Informe o nome do streamer na Twitch para excluir a configuração.',
                    type: ApplicationCommandOptionType.String,
                    required: true
                },
            ],
        },
    ],


    async run(client, interaction) {
        let lang = await idioma.findOne({
            guildId: interaction.guild.id,
        });
        lang = lang ? require(`../../languages/${lang.language}.js`) : require('../../languages/pt.js');

        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return interaction.reply({
                content: lang.alertNaoTemPermissão,
                ephemeral: true
            });
        }

        const usuario = interaction.options.getString('usuario').toLowerCase(); // Normaliza para minúsculas

        try {
            // Verifica se o streamer está cadastrado no servidor
            let stremerConfig = await Stremer.findOne({ guildId: interaction.guild.id, stremer: usuario });

            if (!stremerConfig) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('#FF0000')
                            .setTitle('Erro')
                            .setDescription(`Não há configuração cadastrada para o streamer **${usuario}**.`)
                    ],
                    ephemeral: true
                });
            }

            // Remove a configuração do banco de dados
            await Stremer.deleteOne({ guildId: interaction.guild.id, stremer: usuario });

            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#00FF00')
                        .setTitle('Configuração Excluída')
                        .setDescription(`A configuração para o streamer **${usuario}** foi excluída com sucesso.`)
                        .addFields(
                            { name: 'Streamer na Twitch', value: `**${usuario}**`, inline: true }
                        )
                ],
                ephemeral: true
            });
        } catch (error) {
            console.error('Erro ao excluir a configuração do streamer:', error);
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#FF0000')
                        .setTitle('Erro')
                        .setDescription(`Ocorreu um erro ao tentar excluir o streamer **${usuario}**.`)
                ],
                ephemeral: true
            });
        }
    }
};
