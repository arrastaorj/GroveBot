const {
    ApplicationCommandType,
    EmbedBuilder,
    PermissionFlagsBits,
    ApplicationCommandOptionType,
    ChannelType,
} = require('discord.js');
const mongoose = require('mongoose');
const Stremer = require('../../database/models/stremer'); // Importando o modelo do MongoDB
const idioma = require("../../database/models/language");

module.exports = {
    name: "stremer",
    description: "Configure a notificação de lives de um streamer.",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'config',
            description: 'Configure o canal de notificação e o nome do streamer.',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "canal",
                    type: ApplicationCommandOptionType.Channel,
                    channelTypes: [ChannelType.GuildText],
                    description: "Selecione o canal onde será enviada a notificação das lives.",
                    required: true
                },
                {
                    name: "usuario",
                    type: ApplicationCommandOptionType.String,
                    description: "Informe o nome do streamer na Twitch.",
                    required: true
                },
            ],
        },
    ],

    async run(client, interaction, args) {
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

        const botMember = interaction.guild.members.cache.get(client.user.id);
        if (!botMember.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return interaction.reply({
                content: lang.alertPermissãoBot,
                ephemeral: true
            });
        }

        const canal = interaction.options.getChannel('canal');
        const usuario = interaction.options.getString('usuario');

        try {
            // Verifica se já existe um cadastro para esse streamer no servidor
            let stremerConfig = await Stremer.findOne({ guildId: interaction.guild.id, stremer: usuario });

            if (stremerConfig) {
                // Atualiza a configuração existente
                stremerConfig.canal1 = canal.id;
                await stremerConfig.save();
                return interaction.reply({ content: `Configuração atualizada para o streamer **${usuario}**.`, ephemeral: true });
            } else {
                // Cria uma nova configuração
                stremerConfig = new Stremer({
                    guildId: interaction.guild.id,
                    stremer: usuario,
                    canal1: canal.id,
                });
                await stremerConfig.save();
                return interaction.reply({ content: `Streamer **${usuario}** cadastrado com sucesso!`, ephemeral: true });
            }
        } catch (error) {
            console.error('Erro ao salvar a configuração do streamer:', error);
            return interaction.reply({ content: `Ocorreu um erro ao tentar cadastrar o streamer **${usuario}**.`, ephemeral: true });
        }
    }
};
