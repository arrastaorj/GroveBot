const {
    ActionRowBuilder,
    ButtonStyle,
    ButtonBuilder,
    PermissionFlagsBits,
    ApplicationCommandType,
    EmbedBuilder,
    ApplicationCommandOptionType,
    ChannelType,
} = require('discord.js');

const idioma = require("../../database/models/language");

const menssagemID = [];

module.exports = {
    name: 'slowmode',
    description: 'Painel para gerenciar o SlowMode do chat.',
    type: ApplicationCommandType.ChatInput,
    menssagemID,

    async run(client, interaction, args) {
        let lang = await idioma.findOne({
            guildId: interaction.guild.id,
        });

        lang = lang ? require(`../../languages/${lang.language}.js`) : require('../../languages/pt.js');

        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
            return interaction.reply({
                content: `${lang.alertNaoTemPermissao}`,
                ephemeral: true,
            });
        }

        const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('ativar')
                    .setLabel(`Ativar`)
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('desativar')
                    .setLabel(`Desativar`)
                    .setStyle(ButtonStyle.Danger)
                    .setDisabled(true)
            );

        const buttons2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('ativar')
                    .setLabel(`Ativar`)
                    .setStyle(ButtonStyle.Success)
                    .setDisabled(true),
                new ButtonBuilder()
                    .setCustomId('desativar')
                    .setLabel(`Desativar`)
                    .setStyle(ButtonStyle.Danger)
            )

        const corDaMensagem = '#00ff00'

        const embed = new EmbedBuilder()
            .setTitle(`Painel de Configuração de SlowMode`)
            .setFields([
                {
                    name: `Configurações Disponíveis`,
                    value: `> Personalize o modo lento do chat ajustando o tempo de espera entre mensagens para controlar a velocidade da conversa.`,
                },
            ])
            .setFooter({
                iconURL: interaction.user.displayAvatarURL({ extension: 'png' }),
                text: `Solicitado por ${interaction.user.username}`,
            })
            .setThumbnail(interaction.guild.iconURL({ extension: 'png' }))
            .setTimestamp()
            .setColor('#41b2b0');

        menssagemID.pop();

        const channel = interaction.channel;

        const messageContent = `> \`+\` Acabei de enviar o painel em ${channel}`

        const components = channel.rateLimitPerUser === 0 ? [buttons] : [buttons2]

        await channel.send({
            embeds: [embed],
            components: components,
        }).then(async (sentMessage) => {
            menssagemID.push(sentMessage.id)
        })

        return await interaction.reply({
            content: messageContent,
            ephemeral: true,
        })
    },
}