const discord = require("discord.js");
const idioma = require("../../database/models/language");
const GuildConfigLogs = require('../../database/models/auditlogs'); // Importação correta do modelo de logs

module.exports = {
    name: "automod",
    description: "Configurar sistema automod",
    type: discord.ApplicationCommandType.ChatInput,
    options: [],

    run: async (client, interaction, args) => {
        let lang = await idioma.findOne({
            guildId: interaction.guild.id
        });
        lang = lang ? require(`../../languages/${lang.language}.js`) : require('../../languages/pt.js');

        const { guild } = interaction;

        // Verificação de permissões
        if (!interaction.member.permissions.has(discord.PermissionsBitField.Flags.Administrator)) {
            return await interaction.reply({
                content: `${lang.alertNaoTemPermissão}`,
                ephemeral: true
            });
        }

        const botMember = interaction.guild.members.cache.get(client.user.id);
        if (!botMember.permissions.has(discord.PermissionFlagsBits.ManageMessages)) {
            return interaction.reply({ content: lang.alertPermissãoBot, ephemeral: true });
        }

        // Verificar se o canal de logs está configurado
        const guildConfigLogs = await GuildConfigLogs.findOne({
            guildId: interaction.guild.id
        });

        let logChannelLogs;
        if (!guildConfigLogs || !guildConfigLogs.canal) {
            return interaction.followUp({
                content: "> \`-\` <a:alerta:1163274838111162499> O canal de logs não foi configurado neste servidor. Nenhum log foi gerado. Você pode usar **/audit logs** para configurar um novo canal de logs.",
                ephemeral: true
            });
        } else {
            logChannelLogs = client.channels.cache.get(guildConfigLogs.canal);
            if (!logChannelLogs) {
                return interaction.followUp({
                    content: "> \`-\` <a:alerta:1163274838111162499> O canal de logs configurado foi removido ou está inacessível. Nenhum log foi gerado. Use **/audit logs** para configurar um novo canal de logs.",
                    ephemeral: true
                });
            }
        }

        // Função para recriar o menu após cada seleção
        const createMenu = () => {
            const menu = new discord.StringSelectMenuBuilder()
                .setCustomId('automod-select')
                .setPlaceholder('Selecione uma opção de AutoMod')
                .addOptions([
                    {
                        label: 'Bloquear Ofensivas',
                        description: 'Bloqueie palavrões e calúnias',
                        value: 'ofensivas',
                    },
                    {
                        label: 'Bloquear Spam de Mensagens',
                        description: 'Bloqueie spam',
                        value: 'spam-mensagens',
                    },
                    {
                        label: 'Limite de Menções',
                        description: 'Defina limite de menções para bloquear mensagens',
                        value: 'menção-spam',
                    },
                    {
                        label: 'Bloquear Palavra-Chave',
                        description: 'Bloqueie uma palavra específica',
                        value: 'palavra-chave',
                    },
                ]);
            return new discord.ActionRowBuilder().addComponents(menu);
        };

        // Função para enviar o menu e permitir novas seleções
        const sendMenu = async (content) => {
            await interaction.editReply({
                content: content || 'Selecione o tipo de AutoMod que deseja configurar:',
                components: [createMenu()],
                ephemeral: true
            });
        };

        // Enviar o menu interativo inicialmente
        await interaction.reply({
            content: 'Selecione o tipo de AutoMod que deseja configurar:',
            components: [createMenu()],
            ephemeral: true
        });

        // Captura de resposta do menu suspenso
        const filter = i => i.customId === 'automod-select' && i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async i => {
            const selectedOption = i.values[0];

            switch (selectedOption) {
                case 'ofensivas':
                    await i.update({ content: `${lang.msg59}`, components: [] });

                    await guild.autoModerationRules.create({
                        name: `${lang.msg60}`,
                        creatorId: client.user.id,
                        enabled: true,
                        eventType: 1,
                        triggerType: 4,
                        triggerMetadata: { presets: [1, 2, 3] },
                        actions: [
                            {
                                type: 1,
                                metadata: {
                                    channel: interaction.channel,
                                    durationSeconds: 10,
                                    customMessage: `${lang.msg61}`
                                }
                            }
                        ]
                    }).catch(async err => {
                        return await i.followUp({ content: `${lang.msg62}`, ephemeral: true });
                    });

                    const embedOfensivas = new discord.EmbedBuilder()
                        .setColor("#ff0000")
                        .setTitle("📑 AutoMod Ativado: Ofensivas")
                        .setDescription(`${lang.msg60}`)
                        .addFields({ name: "Administrador", value: interaction.user.tag })
                        .setTimestamp();

                    logChannelLogs.send({ embeds: [embedOfensivas] });

                    // Recriar o menu após a configuração ser aplicada
                    sendMenu('Selecione outra opção de AutoMod que deseja configurar:');
                    break;

                case 'palavra-chave':
                    // Modal para capturar a palavra-chave
                    const palavraModal = new discord.ModalBuilder()
                        .setCustomId('palavra-chave-modal')
                        .setTitle('Bloquear Palavra-Chave')
                        .addComponents(
                            new discord.ActionRowBuilder().addComponents(
                                new discord.TextInputBuilder()
                                    .setCustomId('palavra-chave-input')
                                    .setLabel('Digite a palavra que deseja bloquear:')
                                    .setStyle(discord.TextInputStyle.Short)
                                    .setRequired(true)
                            )
                        );

                    await i.showModal(palavraModal);
                    break;

                case 'spam-mensagens':
                    await i.update({ content: `${lang.msg59}`, components: [] });

                    await guild.autoModerationRules.create({
                        name: `${lang.msg69}`,
                        creatorId: client.user.id,
                        enabled: true,
                        eventType: 1,
                        triggerType: 3,
                        triggerMetadata: {},
                        actions: [
                            {
                                type: 1,
                                metadata: {
                                    channel: interaction.channel,
                                    durationSeconds: 10,
                                    customMessage: `${lang.msg61}`
                                }
                            }
                        ]
                    }).catch(async err => {
                        return await i.followUp({ content: `${lang.msg62}`, ephemeral: true });
                    });

                    const embedSpamMensagens = new discord.EmbedBuilder()
                        .setColor("#ff0000")
                        .setTitle("📑 AutoMod Ativado: Spam de Mensagens")
                        .setDescription(`${lang.msg69}`)
                        .addFields({ name: "Administrador", value: interaction.user.tag })
                        .setTimestamp();

                    logChannelLogs.send({ embeds: [embedSpamMensagens] });

                    // Recriar o menu após a configuração ser aplicada
                    sendMenu('Selecione outra opção de AutoMod que deseja configurar:');
                    break;

                case 'menção-spam':
                    // Modal para capturar o limite de menções
                    const mencaoModal = new discord.ModalBuilder()
                        .setCustomId('mencao-spam-modal')
                        .setTitle('Definir Limite de Menções')
                        .addComponents(
                            new discord.ActionRowBuilder().addComponents(
                                new discord.TextInputBuilder()
                                    .setCustomId('mencao-spam-input')
                                    .setLabel('Digite o limite de menções permitidas:')
                                    .setStyle(discord.TextInputStyle.Short)
                                    .setRequired(true)
                            )
                        );

                    await i.showModal(mencaoModal);
                    break;

                default:
                    await i.update({ content: 'Opção inválida.', components: [] });
            }
        });

        // Modal submit handler
        client.on('interactionCreate', async interaction => {
            if (interaction.isModalSubmit()) {
                if (interaction.customId === 'palavra-chave-modal') {

                    try {
                        const palavra = interaction.fields.getTextInputValue('palavra-chave-input');
                        await guild.autoModerationRules.create({
                            name: `${lang.msg66} ${palavra} ${lang.msg67}`,
                            creatorId: client.user.id,
                            enabled: true,
                            eventType: 1,
                            triggerType: 1,
                            triggerMetadata: { keywordFilter: [palavra] },
                            actions: [
                                {
                                    type: 1,
                                    metadata: {
                                        channel: interaction.channel,
                                        durationSeconds: 10,
                                        customMessage: `${lang.msg61}`
                                    }
                                }
                            ]
                        })


                        const embedPalavraChave = new discord.EmbedBuilder()
                            .setColor("#ff0000")
                            .setTitle("📑 AutoMod Ativado: Palavra-Chave")
                            .setDescription(`Palavra bloqueada: ${palavra}`)
                            .addFields({ name: "Administrador", value: interaction.user.tag })
                            .setTimestamp();

                        logChannelLogs.send({ embeds: [embedPalavraChave] });
                        await interaction.reply({ content: 'Palavra bloqueada com sucesso!', ephemeral: true });

                    } catch (error) {

                        return await interaction.reply({ content: `${lang.msg62}`, ephemeral: true });
                    }

                }

                if (interaction.customId === 'mencao-spam-modal') {

                    try {
                        const limiteMencoes = interaction.fields.getTextInputValue('mencao-spam-input');

                        await guild.autoModerationRules.create({
                            name: `${lang.msg65} ${limiteMencoes} ${lang.msg67}`,
                            creatorId: client.user.id,
                            enabled: true,
                            eventType: 1,
                            triggerType: 5,
                            triggerMetadata: { mentionTotalLimit: parseInt(limiteMencoes) },
                            actions: [
                                {
                                    type: 1,
                                    metadata: {
                                        channel: interaction.channel,
                                        durationSeconds: 10,
                                        customMessage: `${lang.msg61}`
                                    }
                                }
                            ]
                        })


                        const embedMencaoSpam = new discord.EmbedBuilder()
                            .setColor("#ff0000")
                            .setTitle("📑 AutoMod Ativado: Limite de Menções")
                            .setDescription(`Limite: ${limiteMencoes} menções`)
                            .addFields({ name: "Administrador", value: interaction.user.tag })
                            .setTimestamp();

                        logChannelLogs.send({ embeds: [embedMencaoSpam] });
                        await interaction.reply({ content: 'Limite de menções configurado com sucesso!', ephemeral: true });
                    } catch (error) {

                        return await interaction.reply({ content: `${lang.msg62}`, ephemeral: true });
                    }

                }

            }
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                interaction.followUp({
                    content: 'Você não fez nenhuma seleção a tempo.',
                    ephemeral: true
                });
            }
        });
    }
};
