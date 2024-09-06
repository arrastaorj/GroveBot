
const client = require('../../index')
const GuildConfig = require('../../database/models/auditlogs');
const { EmbedBuilder } = require('discord.js');


client.on('messageDelete', async (message) => {

    const guildConfig = await GuildConfig.findOne({
        guildId: message.guild.id
    })

    if (!guildConfig) return

    if (guildConfig.auditlogs) {
        const logChannel = client.channels.cache.get(guildConfig.canal);

        if (logChannel) {

            if (message.author == null || message.content == null) return;

            const embed = new EmbedBuilder()
                .setTitle(`Mensagem Deletada`)
                .setColor("#d12e2e")
                .setTimestamp()
                .setThumbnail(message.guild.iconURL({ extension: 'png' }))
                .addFields(
                    {
                        name: `👤 Usuário`,
                        value: `${message.author}`,
                        inline: true,
                    },
                    {
                        name: `📝 Canal`,
                        value: `${message.channel}`,
                        inline: true,
                    },
                    {
                        name: `💬 Mensagem`,
                        value: `${message.content || `Mensagem contém uma imagem ou é tem mais de 15 dias.`}`,
                    },
                    {
                        name: `📅 Data/Hora`,
                        value: `<t:${~~Math.ceil(message.createdTimestamp / 1000)}> (<t:${~~(message.createdTimestamp / 1000)}:R>)`,
                    },
                )


            if (message.attachments.size > 0 && !message.content) {
                embed.setImage(message.attachments.first().url);
            }

            await logChannel.send({ embeds: [embed] })

        } else {
            return
        }
    }

})

client.on('messageUpdate', async (oldMessage, newMessage) => {

    try {


        const guildConfig = await GuildConfig.findOne({
            guildId: oldMessage.guild.id
        })

        if (!guildConfig) return

        if (guildConfig.auditlogs) {

            const logChannel = client.channels.cache.get(guildConfig.canal);

            if (logChannel) {

                const embed = new EmbedBuilder()
                    .setTitle('Menssagem Editada')
                    .setColor("#03f7ff")
                    .setTimestamp()
                    .setThumbnail(oldMessage.guild.iconURL({ extension: 'png' }))
                    .addFields(
                        {
                            name: `👤 Usuário`,
                            value: `${newMessage.author}`,
                            inline: true,
                        },
                        {
                            name: `📝 Canal`,
                            value: `${newMessage.channel}`,
                            inline: true,
                        },
                        {
                            name: `🗯️ Mensagem Antiga`,
                            value: `${oldMessage.content}`,
                        },
                        {
                            name: `💭 Mensagem Nova`,
                            value: `${newMessage.content}`,
                        },
                        {
                            name: `📅 Data/Hora`,
                            value: `<t:${~~Math.ceil(oldMessage.createdTimestamp / 1000)}> (<t:${~~(oldMessage.createdTimestamp / 1000)}:R>)`,
                        },
                    )

                if (oldMessage.attachments.size > 0 && !oldMessage.content) {
                    embed.setImage(oldMessage.attachments.first().url);
                }
                await logChannel.send({ embeds: [embed] })
            }
        }
    } catch {
        return
    }
})

client.on("channelCreate", async (channel) => {

    const guildConfig = await GuildConfig.findOne({
        guildId: channel.guild.id
    })

    if (!guildConfig) return

    if (guildConfig.auditlogs) {

        const logChannel = client.channels.cache.get(guildConfig.canal);

        if (logChannel) {

            let type = { 2: "Canal de Voz", 0: "Canal de Texto", 5: "Canal de Anúncio", 4: "Categoria", 13: "Palco", 15: "Fórum" }

            const embed = new EmbedBuilder()
                .setTitle('Canal Criado')
                .setColor("#5dff05")
                .setThumbnail(channel.guild.iconURL({ extension: 'png' }))
                .setTimestamp()
                .addFields(
                    {
                        name: `🔍 Tipo de Canal`,
                        value: `${type[channel.type]}`,
                        inline: true,
                    },
                    {
                        name: `📝 Nome do Canal`,
                        value: `${channel.name}`,
                        inline: true,
                    },
                    {
                        name: `📅 Data/Hora`,
                        value: `<t:${~~Math.ceil(channel.createdTimestamp / 1000)}> (<t:${~~(channel.createdTimestamp / 1000)}:R>)`,
                    },
                )

            await logChannel.send({ embeds: [embed] })
        }
    }
})

client.on("channelDelete", async (channel) => {


    const guildConfig = await GuildConfig.findOne({
        guildId: channel.guild.id
    })

    if (!guildConfig) return

    if (guildConfig.auditlogs) {

        const logChannel = client.channels.cache.get(guildConfig.canal);

        if (logChannel) {

            let type = { 2: "Canal de Voz", 0: "Canal de Texto", 5: "Canal de Anúncio", 4: "Categoria", 13: "Palco", 15: "Fórum" }

            const embed = new EmbedBuilder()
                .setTitle(`Canal Deletado`)
                .setColor("#d12e2e")
                .setThumbnail(channel.guild.iconURL({ extension: 'png' }))
                .setTimestamp()
                .addFields(
                    {
                        name: `🔍 Tipo de Canal`,
                        value: `${type[channel.type]}`,
                        inline: true,
                    },
                    {
                        name: `📝 Nome do Canal`,
                        value: `${channel.name}`,
                        inline: true,
                    },
                    {
                        name: `📅 Data/Hora`,
                        value: `<t:${~~Math.ceil(channel.createdTimestamp / 1000)}> (<t:${~~(channel.createdTimestamp / 1000)}:R>)`,
                    },
                )


            await logChannel.send({ embeds: [embed] })

        }
    }

})

client.on("channelUpdate", async (oldChannel, newChannel) => {

    if (oldChannel.name !== newChannel.name) {

        const guildConfig = await GuildConfig.findOne({
            guildId: oldChannel.guild.id
        })

        if (!guildConfig) return

        if (guildConfig.auditlogs) {

            const logChannel = client.channels.cache.get(guildConfig.canal);

            if (logChannel) {

                let type = { 2: "Canal de Voz", 0: "Canal de Texto", 5: "Canal de Anúncio", 4: "Categoria", 13: "Palco", 15: "Fórum" }

                const embed = new EmbedBuilder()
                    .setTitle(`Canal Editado`)
                    .setColor("#03f7ff")
                    .setThumbnail(oldChannel.guild.iconURL({ extension: 'png' }))
                    .setTimestamp()
                    .setDescription(`Nome do canal ${oldChannel} atualizado.`)
                    .addFields(
                        {
                            name: `🔍 Tipo de Canal`,
                            value: `${type[oldChannel.type]}`,
                            inline: false,
                        },
                        {
                            name: `📝 Nome Antigo`,
                            value: `${oldChannel.name}`,
                            inline: true,

                        },
                        {
                            name: `📝 Novo Nome`,
                            value: `${newChannel.name}`,
                            inline: true,

                        },
                        {
                            name: `📅 Data/Hora`,
                            value: `<t:${~~Math.ceil(oldChannel.createdTimestamp / 1000)}> (<t:${~~(oldChannel.createdTimestamp / 1000)}:R>)`,
                        },
                    )
                await logChannel.send({ embeds: [embed] })
            }
        }

    } else if (oldChannel.type !== newChannel.type) {

        const guildConfig = await GuildConfig.findOne({
            guildId: oldChannel.guild.id
        })

        if (!guildConfig) return

        if (guildConfig.auditlogs) {

            const logChannel = client.channels.cache.get(guildConfig.canal);

            if (logChannel) {

                let type = { 2: "Canal de Voz", 0: "Canal de Texto", 5: "Canal de Anúncio", 4: "Categoria", 13: "Palco", 15: "Fórum" }

                const embed = new EmbedBuilder()
                    .setTitle(`Canal Editado`)
                    .setColor("#03f7ff")
                    .setThumbnail(oldChannel.guild.iconURL({ extension: 'png' }))
                    .setTimestamp()
                    .setDescription(`Tipo do canal ${oldChannel} alterado.`)
                    .addFields(
                        {
                            name: `🔍 Tipo antigo`,
                            value: `${type[oldChannel.type]}`,
                            inline: true,
                        },
                        {
                            name: `✨ Novo Tipo`,
                            value: `${type[newChannel.type]}`,
                            inline: true,
                        },

                        {
                            name: `📅 Data/Hora`,
                            value: `<t:${~~Math.ceil(oldChannel.createdTimestamp / 1000)}> (<t:${~~(oldChannel.createdTimestamp / 1000)}:R>)`,
                        },
                    )
                await logChannel.send({ embeds: [embed] })
            }
        }

    } else {

        const guildConfig = await GuildConfig.findOne({
            guildId: oldChannel.guild.id
        })

        if (!guildConfig) return

        if (guildConfig.auditlogs) {

            const logChannel = client.channels.cache.get(guildConfig.canal);

            if (logChannel) {

                const embed = new EmbedBuilder()
                    .setTitle(`Canal Editado`)
                    .setColor("#03f7ff")
                    .setThumbnail(oldChannel.guild.iconURL({ extension: 'png' }))
                    .setTimestamp()
                    .setDescription(`Atualização realizada no canal ${oldChannel}, mas não foi possível detectar a alteração específica.`)

                await logChannel.send({ embeds: [embed] })
            }
        }
    }

})

client.on("guildChannelPermissionsUpdate", async (channel, oldPermissions, newPermissions) => {
    const guildConfig = await GuildConfig.findOne({
        guildId: channel.guild.id
    });

    if (!guildConfig || !guildConfig.auditlogs) return;

    const logChannel = client.channels.cache.get(guildConfig.canal);
    if (!logChannel) return;

    const embed = new EmbedBuilder()
        .setTitle('🔒 **Permissões Atualizadas no Canal**')
        .setDescription(`> As permissões do canal ${channel} (\`${channel.id}\`) foram atualizadas.`)
        .setColor("#ff0000")
        .setTimestamp()
        .setThumbnail(channel.guild.iconURL({ extension: 'png' }));

    logChannel.send({ embeds: [embed] });
});

client.on("guildChannelTopicUpdate", async (channel, oldTopic, newTopic) => {
    const guildConfig = await GuildConfig.findOne({
        guildId: channel.guild.id
    });

    if (!guildConfig || !guildConfig.auditlogs) return;

    const logChannel = client.channels.cache.get(guildConfig.canal);
    if (!logChannel) return;

    const embed = new EmbedBuilder()
        .setTitle('📝 **Tópico do Canal Atualizado**')
        .setDescription(`> O tópico do canal ${channel} (\`${channel.id}\`) foi atualizado.`)
        .setColor("#ff0000")
        .setTimestamp()
        .setThumbnail(channel.guild.iconURL({ extension: 'png' }))
        .addFields(
            { name: '📖 **Tópico Antigo**', value: oldTopic || 'Nenhum', inline: true },
            { name: '📘 **Novo Tópico**', value: newTopic || 'Nenhum', inline: true }
        );

    logChannel.send({ embeds: [embed] });
});

client.on("emojiCreate", async (emoji) => {
    const guildConfig = await GuildConfig.findOne({
        guildId: emoji.guild.id
    });

    if (!guildConfig || !guildConfig.auditlogs) return;

    const logChannel = client.channels.cache.get(guildConfig.canal);
    if (!logChannel) return;

    const embed = new EmbedBuilder()
        .setTitle('😀 **Emoji Criado**')
        .setDescription(`> **Emoji:** ${emoji}\n> **ID:** ${emoji.id}\n> **URL:** [Clique aqui](${emoji.url})`)
        .setColor("#5dff05")
        .setThumbnail(emoji.url)
        .setTimestamp();

    logChannel.send({ embeds: [embed] });
});

client.on("emojiDelete", async (emoji) => {
    const guildConfig = await GuildConfig.findOne({
        guildId: emoji.guild.id
    });

    if (!guildConfig || !guildConfig.auditlogs) return;

    const logChannel = client.channels.cache.get(guildConfig.canal);
    if (!logChannel) return;

    const embed = new EmbedBuilder()
        .setTitle('😢 **Emoji Deletado**')
        .setDescription(`> **Nome:** ${emoji.name}\n> **ID:** ${emoji.id}\n> **URL:** [Clique aqui](${emoji.url})`)
        .setColor("#ff0000")
        .setThumbnail(emoji.url)
        .setTimestamp();

    logChannel.send({ embeds: [embed] });
});

client.on("guildMemberRoleAdd", async (member, role) => {
    const guildConfig = await GuildConfig.findOne({
        guildId: member.guild.id
    });

    if (!guildConfig || !guildConfig.auditlogs) return;

    const logChannel = client.channels.cache.get(guildConfig.canal);
    if (!logChannel) return;

    const embed = new EmbedBuilder()
        .setTitle('🎖️ **Função Adicionada**')
        .setDescription(`> **Usuário:** ${member} (\`${member.id}\`)\n> **Função Recebida:** ${role} (\`${role.id}\`)`)
        .setColor("#37393f")
        .setTimestamp();

    logChannel.send({ embeds: [embed] });
});








client.on("guildMemberNicknameUpdate", async (member, oldNickname, newNickname) => {
    const guildConfig = await GuildConfig.findOne({
        guildId: member.guild.id
    });

    if (!guildConfig || !guildConfig.auditlogs) return;

    const logChannel = client.channels.cache.get(guildConfig.canal);
    if (!logChannel) return;

    let embed = new EmbedBuilder()
        .setDescription(`> O nome de **${member.user.tag}** foi atualizado!\n> **Nome Antigo: \`${oldNickname ?? member.user.username}\`**\n> **Novo Nome: \`${newNickname ?? member.user.username}\`**`)
        .setColor("#37393f")
        .setThumbnail(member.user.avatarURL({ dynamic: true }));
    logChannel.send({ embeds: [embed] });
});

client.on("guildBoostLevelUp", async (guild, oldLevel, newLevel) => {
    const guildConfig = await GuildConfig.findOne({
        guildId: guild.id
    });

    if (!guildConfig || !guildConfig.auditlogs) return;

    const logChannel = client.channels.cache.get(guildConfig.canal);
    if (!logChannel) return;

    let embed = new EmbedBuilder()
        .setDescription(`> **O nível de reforço do servidor subiu para ${newLevel}!**`)
        .setColor("#00ff00");
    logChannel.send({ embeds: [embed] });
});

client.on("guildBoostLevelDown", async (guild, oldLevel, newLevel) => {
    const guildConfig = await GuildConfig.findOne({
        guildId: guild.id
    });

    if (!guildConfig || !guildConfig.auditlogs) return;

    const logChannel = client.channels.cache.get(guildConfig.canal);
    if (!logChannel) return;

    let embed = new EmbedBuilder()
        .setDescription(`> **O nível de reforço do servidor desceu para ${newLevel}!**`)
        .setColor("#ff0000");
    logChannel.send({ embeds: [embed] });
});

client.on("guildAfkChannelAdd", async (guild, afkChannel) => {
    const guildConfig = await GuildConfig.findOne({
        guildId: guild.id
    });

    if (!guildConfig || !guildConfig.auditlogs) return;

    const logChannel = client.channels.cache.get(guildConfig.canal);
    if (!logChannel) return;

    let embed = new EmbedBuilder()
        .setDescription(`> **Um canal AFK foi adicionado ao servidor!**\n\n> **Canal: ${afkChannel}**`)
        .setColor("#37393f")
        .setThumbnail(`${guild.iconURL({ dynamic: true })}`);
    logChannel.send({ embeds: [embed] });
});

client.on("guildVanityURLAdd", async (guild, vanityURL) => {
    const guildConfig = await GuildConfig.findOne({
        guildId: guild.id
    });

    if (!guildConfig || !guildConfig.auditlogs) return;

    const logChannel = client.channels.cache.get(guildConfig.canal);
    if (!logChannel) return;

    let embed = new EmbedBuilder()
        .setDescription(`> **Um URL personalizado foi adquirido para o servidor!**\n\n> **URL: ${vanityURL}**`)
        .setColor("#00ff00")
        .setThumbnail(`${guild.iconURL({ dynamic: true })}`);
    logChannel.send({ embeds: [embed] });
});

client.on("guildVanityURLRemove", async (guild, vanityURL) => {
    const guildConfig = await GuildConfig.findOne({
        guildId: guild.id
    });

    if (!guildConfig || !guildConfig.auditlogs) return;

    const logChannel = client.channels.cache.get(guildConfig.canal);
    if (!logChannel) return;

    let embed = new EmbedBuilder()
        .setDescription(`> **O URL personalizado do servidor foi removido!**\n\n> **URL: ${vanityURL}**`)
        .setColor("#ff0000")
        .setThumbnail(`${guild.iconURL({ dynamic: true })}`);
    logChannel.send({ embeds: [embed] });
});

client.on("guildVanityURLUpdate", async (guild, oldVanityURL, newVanityURL) => {
    const guildConfig = await GuildConfig.findOne({
        guildId: guild.id
    });

    if (!guildConfig || !guildConfig.auditlogs) return;

    const logChannel = client.channels.cache.get(guildConfig.canal);
    if (!logChannel) return;

    let embed = new EmbedBuilder()
        .setDescription(`> **O URL personalizado do servidor foi alterado!**\n\n> **URL antigo: ${oldVanityURL}**\n> **Novo URL: ${newVanityURL}**`)
        .setColor("#ff0000")
        .setThumbnail(`${guild.iconURL({ dynamic: true })}`);
    logChannel.send({ embeds: [embed] });
});

client.on("guildFeaturesUpdate", async (oldGuild, newGuild) => {
    const guildConfig = await GuildConfig.findOne({
        guildId: newGuild.id
    });

    if (!guildConfig || !guildConfig.auditlogs) return;

    const logChannel = client.channels.cache.get(guildConfig.canal);
    if (!logChannel) return;

    let embed = new EmbedBuilder()
        .setDescription(`> **Foram feitas atualizações no servidor!**\n\n> **Configurações antigas: ${oldGuild.features.join(", ")}**\n> **Novas configurações: ${newGuild.features.join(", ")}**`)
        .setColor("#ff0000")
        .setThumbnail(`${newGuild.iconURL({ dynamic: true })}`);
    logChannel.send({ embeds: [embed] });
});

client.on("guildOwnerUpdate", async (oldGuild, newGuild) => {
    const guildConfig = await GuildConfig.findOne({
        guildId: newGuild.id
    });

    if (!guildConfig || !guildConfig.auditlogs) return;

    const logChannel = client.channels.cache.get(guildConfig.canal);
    if (!logChannel) return;

    let embed = new EmbedBuilder()
        .setDescription(`> **A propriedade do servidor foi transferida!**\n\n> **Antigo proprietário: ${oldGuild.owner}**\n> **Novo proprietário: ${newGuild.owner}**`)
        .setColor("#ff0000")
        .setThumbnail(`${newGuild.iconURL({ dynamic: true })}`);
    logChannel.send({ embeds: [embed] });
});

client.on("guildPartnerAdd", async (guild) => {
    const guildConfig = await GuildConfig.findOne({
        guildId: guild.id
    });

    if (!guildConfig || !guildConfig.auditlogs) return;

    const logChannel = client.channels.cache.get(guildConfig.canal);
    if (!logChannel) return;

    let embed = new EmbedBuilder()
        .setDescription(`> **O servidor tornou-se um parceiro do Discord!**`)
        .setColor("#00ff00");
    logChannel.send({ embeds: [embed] });
});

client.on("guildPartnerRemove", async (guild) => {
    const guildConfig = await GuildConfig.findOne({
        guildId: guild.id
    });

    if (!guildConfig || !guildConfig.auditlogs) return;

    const logChannel = client.channels.cache.get(guildConfig.canal);
    if (!logChannel) return;

    let embed = new EmbedBuilder()
        .setDescription(`> **A parceria do servidor com o Discord foi encerrada!**`)
        .setColor("#ff0000");
    logChannel.send({ embeds: [embed] });
});

client.on("guildVerificationAdd", async (guild) => {
    const guildConfig = await GuildConfig.findOne({
        guildId: guild.id
    });

    if (!guildConfig || !guildConfig.auditlogs) return;

    const logChannel = client.channels.cache.get(guildConfig.canal);
    if (!logChannel) return;

    let embed = new EmbedBuilder()
        .setDescription(`> **O servidor foi verificado!**`)
        .setColor("#00ff00");
    logChannel.send({ embeds: [embed] });
});

client.on("guildVerificationRemove", async (guild) => {
    const guildConfig = await GuildConfig.findOne({
        guildId: guild.id
    });

    if (!guildConfig || !guildConfig.auditlogs) return;

    const logChannel = client.channels.cache.get(guildConfig.canal);
    if (!logChannel) return;

    let embed = new EmbedBuilder()
        .setDescription(`> **O servidor já não está verificado!**`)
        .setColor("#ff0000");
    logChannel.send({ embeds: [embed] });
});

client.on("unhandledGuildUpdate", async (oldGuild, newGuild) => {
    const guildConfig = await GuildConfig.findOne({
        guildId: newGuild.id
    });

    if (!guildConfig || !guildConfig.auditlogs) return;

    const logChannel = client.channels.cache.get(guildConfig.canal);
    if (!logChannel) return;

    let embed = new EmbedBuilder()
        .setDescription(`> **Foram feitas atualizações no servidor, mas a ação específica não pôde ser detectada!**`)
        .setColor("#ff0000")
        .setThumbnail(`${newGuild.iconURL({ dynamic: true })}`);
    logChannel.send({ embeds: [embed] });
});

client.on("messagePinned", async (message) => {
    const guildConfig = await GuildConfig.findOne({
        guildId: message.guild.id
    });

    if (!guildConfig || !guildConfig.auditlogs) return;

    const logChannel = client.channels.cache.get(guildConfig.canal);
    if (!logChannel) return;

    let embed = new EmbedBuilder()
        .setDescription(`> **Uma nova mensagem foi fixada!**\n\n> **Autor da mensagem: ${message.author}**\n> **Conteúdo da mensagem: ${message.content}**\n> **URL da mensagem: [Clique aqui](${message.url})**`)
        .setColor("#37393f")
        .setThumbnail(`${message.member.user.avatarURL({ dynamic: true })}`);
    logChannel.send({ embeds: [embed] });
});

client.on("rolePermissionsUpdate", async (role, oldPermissions, newPermissions) => {
    const guildConfig = await GuildConfig.findOne({
        guildId: role.guild.id
    });

    if (!guildConfig || !guildConfig.auditlogs) return;

    const logChannel = client.channels.cache.get(guildConfig.canal);
    if (!logChannel) return;

    let embed = new EmbedBuilder()
        .setDescription(`> **${role} - (\`${role.id}\`) As permissões da função foram atualizadas!**`)
        .setColor("#ff0000");
    logChannel.send({ embeds: [embed] });
});

client.on("roleUpdate", async (oldRole, newRole) => {
    const guildConfig = await GuildConfig.findOne({
        guildId: newRole.guild.id
    });

    if (!guildConfig || !guildConfig.auditlogs) return;

    const logChannel = client.channels.cache.get(guildConfig.canal);
    if (!logChannel) return;

    if (oldRole.name !== newRole.name) {
        let embed = new EmbedBuilder()
            .setDescription(`> **O nome da função ${oldRole} foi atualizado!**\n\n> **Nome antigo: ${oldRole.name}**\n> **Novo nome: ${newRole.name}**`)
            .setColor("#ff0000");
        logChannel.send({ embeds: [embed] });
    } else if (oldRole.position !== newRole.position) {
        let embed = new EmbedBuilder()
            .setDescription(`> **A posição da função ${oldRole} foi atualizada!**\n\n> **Posição antiga: ${oldRole.position}**\n> **Nova posição: ${newRole.position}**`)
            .setColor("#ff0000");
        logChannel.send({ embeds: [embed] });
    } else if (oldRole.hexColor !== newRole.hexColor) {
        let embed = new EmbedBuilder()
            .setDescription(`> **A cor da função ${oldRole} foi atualizada!**\n\n> **Cor antiga: ${oldRole.hexColor}**\n> **Nova cor: ${newRole.hexColor}**`)
            .setColor("#ff0000");
        logChannel.send({ embeds: [embed] });
    } else if (oldRole.icon !== newRole.icon) {
        let embed = new EmbedBuilder()
            .setDescription(`> **O ícone da função ${oldRole} foi atualizado!**\n\n> **Ícone antigo: [Clique aqui!](${oldRole.iconURL})**\n> **Novo ícone: [Clique aqui!](${newRole.iconURL})**`)
            .setColor("#ff0000");
        logChannel.send({ embeds: [embed] });
    } else {
        let embed = new EmbedBuilder()
            .setDescription(`> **Foram feitas alterações na função ${oldRole}, mas a natureza das alterações não pôde ser detectada!**`)
            .setColor("#ff0000");
        logChannel.send({ embeds: [embed] });
    }
});

client.on("roleCreate", async (role) => {
    const guildConfig = await GuildConfig.findOne({
        guildId: role.guild.id
    });

    if (!guildConfig || !guildConfig.auditlogs) return;

    const logChannel = client.channels.cache.get(guildConfig.canal);
    if (!logChannel) return;

    let embed = new EmbedBuilder()
        .setDescription(`> **Uma nova função foi criada!**\n\n> **Função: ${role}**\n> **ID da função: ${role.id}**`)
        .setColor("#ff0000");
    logChannel.send({ embeds: [embed] });
});

client.on("roleDelete", async (role) => {
    const guildConfig = await GuildConfig.findOne({
        guildId: role.guild.id
    });

    if (!guildConfig || !guildConfig.auditlogs) return;

    const logChannel = client.channels.cache.get(guildConfig.canal);
    if (!logChannel) return;

    let embed = new EmbedBuilder()
        .setDescription(`> **Uma função foi excluída!**\n\n> **Função: ${role.name}**\n> **ID da função: ${role.id}**\n> **Cor da função: ${role.color}**`)
        .setColor("#ff0000");
    logChannel.send({ embeds: [embed] });
});
