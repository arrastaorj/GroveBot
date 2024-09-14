const {
    ApplicationCommandType,
    PermissionFlagsBits,
    ApplicationCommandOptionType,
    EmbedBuilder
} = require('discord.js');

const GuildConfigLogs = require('../../database/models/auditlogs'); // Importação correta do modelo de logs
const GuildConfig = require('../../database/models/antilink.js');
const idioma = require("../../database/models/language");

module.exports = {
    name: 'antilink',
    description: 'Ajuste as configurações do Antilink para maior eficácia em seu servidor.',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'status',
            description: 'Ativar ou desativar o Antilink em seu servidor.',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'action',
                    description: 'Ativar ou desativar o Antilink.',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    choices: [
                        {
                            name: 'Ativar',
                            value: 'ativar',
                        },
                        {
                            name: 'Desativar',
                            value: 'desativar',
                        },
                    ],
                },
            ],
        },
        {
            name: 'addrole',
            description: 'Adicionar um cargo que pode enviar links.',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'role',
                    description: 'O cargo a ser adicionado.',
                    type: ApplicationCommandOptionType.Role,
                    required: true,
                },
            ],
        },
        {
            name: 'remrole',
            description: 'Remover um cargo com permissão para enviar links.',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'role',
                    description: 'O cargo a ser removido.',
                    type: ApplicationCommandOptionType.Role,
                    required: true,
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

        const guildId = interaction.guild.id;

        let guildConfig = await GuildConfig.findOne({
            guildId,
        });

        if (!guildConfig) {
            guildConfig = await GuildConfig.create({
                guildId,
            });
        }

        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'status') {
            const action = interaction.options.getString('action')

            if (action === 'ativar') {
                if (guildConfig.antilinkEnabled) {
                    await interaction.reply({
                        content: `${lang.AlertaATLAtivo}`,
                        ephemeral: true
                    });
                } else {
                    guildConfig.antilinkEnabled = true;
                    await guildConfig.save();
                    await interaction.reply({
                        content: `${lang.msg420}`,
                        ephemeral: true
                    });


                    // Busca a configuração do servidor para o canal de logs
                    const guildConfigLogs = await GuildConfigLogs.findOne({
                        guildId: interaction.guild.id
                    });

                    if (!guildConfigLogs || !guildConfigLogs.canal) {
                        // Caso não haja configuração, informa o moderador
                        return interaction.followUp({
                            content: "> \`-\` <a:alerta:1163274838111162499> O canal de logs não foi configurado neste servidor. Nenhum log foi gerado. Você pode usar **/audit logs** para configurar um novo canal de logs.",
                            ephemeral: true
                        });
                    }

                    // Verifica se o canal ainda existe no cache
                    const logChannelLogs = client.channels.cache.get(guildConfigLogs.canal);

                    if (!logChannelLogs) {
                        // Caso o canal tenha sido apagado, avisa o moderador
                        return interaction.followUp({
                            content: "> \`-\` <a:alerta:1163274838111162499> O canal de logs configurado foi removido ou está inacessível. Nenhum log foi gerado. Use **/audit logs** para configurar um novo canal de logs.",
                            ephemeral: true
                        });
                    }

                    if (logChannelLogs) {
                        const embed = new EmbedBuilder()
                            .setTitle("🔧 Antilink Ativiado")
                            .setColor("#00ff00")
                            .addFields(
                                { name: "Servidor", value: interaction.guild.name },
                                { name: "Moderador", value: interaction.user.tag },
                                { name: "Ação", value: "Sistema Antilink foi ativado nesse servidor" }
                            )
                            .setTimestamp();

                        logChannelLogs.send({ embeds: [embed] });
                    }
                }
            } else if (action === 'desativar') {
                if (!guildConfig.antilinkEnabled) {
                    await interaction.reply({
                        content: `${lang.AlertaATLDesativado}`,
                        ephemeral: true
                    });
                } else {
                    guildConfig.antilinkEnabled = false;
                    await guildConfig.save();

                    if (!guildConfig.antilinkEnabled) {
                        await GuildConfig.findOneAndDelete({
                            guildId,
                        });
                    }

                    await interaction.reply({
                        content: `${lang.msg421}`,
                        ephemeral: true
                    });


                    // Busca a configuração do servidor para o canal de logs
                    const guildConfigLogs = await GuildConfigLogs.findOne({
                        guildId: interaction.guild.id
                    });

                    if (!guildConfigLogs || !guildConfigLogs.canal) {
                        // Caso não haja configuração, informa o moderador
                        return interaction.followUp({
                            content: "> \`-\` <a:alerta:1163274838111162499> O canal de logs não foi configurado neste servidor. Nenhum log foi gerado. Você pode usar **/audit logs** para configurar um novo canal de logs.",
                            ephemeral: true
                        });
                    }

                    // Verifica se o canal ainda existe no cache
                    const logChannelLogs = client.channels.cache.get(guildConfigLogs.canal);

                    if (!logChannelLogs) {
                        // Caso o canal tenha sido apagado, avisa o moderador
                        return interaction.followUp({
                            content: "> \`-\` <a:alerta:1163274838111162499> O canal de logs configurado foi removido ou está inacessível. Nenhum log foi gerado. Use **/audit logs** para configurar um novo canal de logs.",
                            ephemeral: true
                        });
                    }



                    if (logChannelLogs) {
                        const embed = new EmbedBuilder()
                            .setTitle("🔧 Antilink Desativado")
                            .setColor("#ff0000")
                            .addFields(
                                { name: "Servidor", value: interaction.guild.name },
                                { name: "Moderador", value: interaction.user.tag },
                                { name: "Ação", value: "Sistema Antilink foi desativado nesse servidor" }
                            )
                            .setTimestamp();

                        logChannelLogs.send({ embeds: [embed] });
                    }
                }
            }
        } else if (subcommand === 'addrole') {
            const role = interaction.options.getRole('role');
            const roleId = role.id;

            if (!guildConfig.allowedRoles.includes(roleId)) {
                guildConfig.allowedRoles.push(roleId);
                await guildConfig.save();

                await interaction.reply({
                    content: `${lang.msg422} ${role.name} ${lang.msg423}`,
                    ephemeral: true
                });


                // Busca a configuração do servidor para o canal de logs
                const guildConfigLogs = await GuildConfigLogs.findOne({
                    guildId: interaction.guild.id
                });

                if (!guildConfigLogs || !guildConfigLogs.canal) {
                    // Caso não haja configuração, informa o moderador
                    return interaction.followUp({
                        content: "> \`-\` <a:alerta:1163274838111162499> O canal de logs não foi configurado neste servidor. Nenhum log foi gerado. Você pode usar **/audit logs** para configurar um novo canal de logs.",
                        ephemeral: true
                    });
                }

                // Verifica se o canal ainda existe no cache
                const logChannelLogs = client.channels.cache.get(guildConfigLogs.canal);

                if (!logChannelLogs) {
                    // Caso o canal tenha sido apagado, avisa o moderador
                    return interaction.followUp({
                        content: "> \`-\` <a:alerta:1163274838111162499> O canal de logs configurado foi removido ou está inacessível. Nenhum log foi gerado. Use **/audit logs** para configurar um novo canal de logs.",
                        ephemeral: true
                    });
                }

                if (logChannelLogs) {
                    const embed = new EmbedBuilder()
                        .setTitle("🔧 Cargo Adicionado")
                        .setColor("#00ff00")
                        .addFields(
                            { name: "Servidor", value: interaction.guild.name },
                            { name: "Moderador", value: interaction.user.tag },
                            { name: "Cargo", value: role.name },
                            { name: "Ação", value: "Cargo adicionado para enviar links" }
                        )
                        .setTimestamp();

                    logChannelLogs.send({ embeds: [embed] });
                }
            } else {
                await interaction.reply({
                    content: `${lang.AlertCargoIncludio} ${role.name} ${lang.AlertCargoIncludio2}`,
                    ephemeral: true
                });
            }
        } else if (subcommand === 'remrole') {
            const role = interaction.options.getRole('role');
            const roleId = role.id;
            const roleIndex = guildConfig.allowedRoles.indexOf(roleId);

            if (roleIndex !== -1) {
                guildConfig.allowedRoles.splice(roleIndex, 1);
                await guildConfig.save();

                await interaction.reply({
                    content: `${lang.msg422} ${role.name} ${lang.msg424}`,
                    ephemeral: true
                });

                // Busca a configuração do servidor para o canal de logs
                const guildConfigLogs = await GuildConfigLogs.findOne({
                    guildId: interaction.guild.id
                });

                if (!guildConfigLogs || !guildConfigLogs.canal) {
                    // Caso não haja configuração, informa o moderador
                    return interaction.followUp({
                        content: "> \`-\` <a:alerta:1163274838111162499> O canal de logs não foi configurado neste servidor. Nenhum log foi gerado. Você pode usar **/audit logs** para configurar um novo canal de logs.",
                        ephemeral: true
                    });
                }

                // Verifica se o canal ainda existe no cache
                const logChannelLogs = client.channels.cache.get(guildConfigLogs.canal);

                if (!logChannelLogs) {
                    // Caso o canal tenha sido apagado, avisa o moderador
                    return interaction.followUp({
                        content: "> \`-\` <a:alerta:1163274838111162499> O canal de logs configurado foi removido ou está inacessível. Nenhum log foi gerado. Use **/audit logs** para configurar um novo canal de logs.",
                        ephemeral: true
                    });
                }

                if (logChannelLogs) {
                    const embed = new EmbedBuilder()
                        .setTitle("🔧 Cargo Removido")
                        .setColor("#ff0000")
                        .addFields(
                            { name: "Servidor", value: interaction.guild.name },
                            { name: "Moderador", value: interaction.user.tag },
                            { name: "Cargo", value: role.name },
                            { name: "Ação", value: "Cargo removido da lista de permissões de envio de links" }
                        )
                        .setTimestamp();

                    logChannelLogs.send({ embeds: [embed] });
                }
            } else {
                await interaction.reply({
                    content: `${lang.AlertCargoNPermitido} ${role.name} ${lang.AlertCargoNPermitido2}`,
                    ephemeral: true
                });
            }
        }
    }
};
