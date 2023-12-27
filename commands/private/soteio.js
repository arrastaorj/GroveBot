const {
    ApplicationCommandOptionType,
    ChannelType,
    ComponentType,
    EmbedBuilder,
    ButtonBuilder,
    AttachmentBuilder,
    ButtonStyle,
    ActionRowBuilder,
    PermissionFlagsBits,
    roleMention,
    ApplicationCommandType,
} = require(`discord.js`)

const idioma = require("../../database/models/language")

let storage = new Map()
module.exports = {
    name: 'sorteio',
    description: 'Inicia um sorteio.',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: 'iniciar',
            description: 'Inicia um sorteio.',
            options: [
                {
                    type: ApplicationCommandOptionType.User,
                    name: 'usuário',
                    description: 'Quem estar patrocinandor',
                    required: true
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: 'premiação',
                    description: "Premiação do sorteio",
                    required: true
                },
                {
                    type: ApplicationCommandOptionType.Integer,
                    name: 'ganhadores',
                    description: 'Quantidade de ganhadores',
                    required: true
                },
                {
                    type: ApplicationCommandOptionType.Integer,
                    name: 'duração',
                    min_value: 1,
                    max_value: 1440,
                    description: 'Duração do sorteio em minutos',
                    required: true
                },
                {
                    type: ApplicationCommandOptionType.Channel,
                    channelTypes: [ChannelType.GuildText],
                    name: 'canal',
                    description: 'Canal a ser enviado',
                    required: false
                },
                {
                    type: ApplicationCommandOptionType.Role,
                    name: 'cargo',
                    description: 'Cargo a ser mencionado',
                    required: false
                },
                {
                    type: ApplicationCommandOptionType.Role,
                    name: 'exclusivo',
                    description: 'Cargo requerido para participar do sorteio',
                    required: false
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: 'tópico',
                    description: 'Iniciar um tópico no sorteio',
                    choices: [
                        {
                            name: "sim",
                            value: "true"
                        },
                    ],
                    required: false
                }
            ],
        },
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: 'finalizar',
            description: 'Finaliza um sorteio.',
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: 'premiação',
                    description: 'Premiação do sorteio',
                    required: true,
                    autocomplete: true
                }
            ],
        }
    ],

    async autocomplete(interaction) {

        const focusedOption = interaction.options.getFocused();

        let choices = [];

        for (const user of storage.keys()) { choices.push(user) }
        const filtered = choices.filter((choice) => choice.startsWith(focusedOption));

        await interaction.respond(filtered.map((choice) => ({ name: choice, value: choice })),);
    },


    run: async (client, interaction) => {

        const subCommand = interaction.options.getSubcommand();


        let lang = await idioma.findOne({
            guildId: interaction.guild.id
        })
        lang = lang ? require(`../../languages/${lang.language}.js`) : require('../../languages/pt.js')


        switch (subCommand) {
            case 'iniciar': {


                if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels))
                    return interaction.reply({
                        content: `${lang.alertNaoTemPermissão}`,
                        ephemeral: true
                    })



                const member = interaction.member
                const user = interaction.options.getUser(`usuário`);
                const award = interaction.options.getString(`premiação`);
                const winners = interaction.options.getInteger(`ganhadores`);
                const time = interaction.options.getInteger(`duração`);
                const channel = interaction.options.getChannel(`canal`) ?? interaction.channel;
                const role = interaction.options.getRole(`cargo`);
                const topic = interaction.options.getString(`tópico`) ?? false;
                const exclusive = interaction.options.getRole(`exclusivo`);

                if (storage.has(award)) {
                    return await interaction.reply({ content: `Já existe um sorteio com o nome \`${award}\` em andamento.`, ephemeral: true })
                }


                storage.set(award, { participants: [], startTime: Date.now(), channelId: [], messageId: [] });


                const giveaway = storage.get(award);
                const timeMillis = time * 60000;
                const timer = Math.round((timeMillis + giveaway.startTime) / 1000);
                let message;



                const embedGiveaway = new EmbedBuilder()
                    .setTitle(`${award}`)
                    .setColor('#41b2b0')
                    .setTimestamp()
                    .addFields(
                        { name: `Patrocinado por`, value: `${user}` },
                        { name: `Duração`, value: `<t:${timer}:R>`, inline: true },
                        { name: `Realizado por`, value: `${member}`, inline: true },
                        { name: `Ganhadores`, value: `${String(winners)} Sorteado` })
                    .setThumbnail(interaction.guild.iconURL({ extension: 'png' }))
                    .setFooter({
                        iconURL: interaction.user.displayAvatarURL({ extension: 'png' }),
                        text: `Solicitado por ${interaction.user.displayName}`,
                    })


                const buttonGiveaway = (giveaway, participants) => {
                    return new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setCustomId(`GIVEAWAY_ENTER_${giveaway}`)
                            .setLabel(`Participar (${participants.length})`)
                            .setEmoji("🎉")
                            .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder()
                            .setCustomId(`GIVEAWAY_VIEW_PARTICIPANTS`)
                            .setLabel(`Participantes`)
                            .setEmoji("📃")
                            .setStyle(ButtonStyle.Secondary))
                }


                try {
                    if (exclusive) {
                        message = await channel.send({ content: roleMention(exclusive.id), embeds: [embedGiveaway], components: [buttonGiveaway(award, giveaway.participants)], fetchReply: true })
                    } else if (role) {
                        message = await channel.send({ content: roleMention(role.id), embeds: [embedGiveaway], components: [buttonGiveaway(award, giveaway.participants)], fetchReply: true })
                    } else {
                        message = await channel.send({ embeds: [embedGiveaway], components: [buttonGiveaway(award, giveaway.participants)], fetchReply: true })
                    }
                    if (topic) {
                        message.startThread({ name: `Sorteio ${award}`, })
                    }
                    giveaway.channelId.push(message.channelId);
                    giveaway.messageId.push(message.id);


                    await interaction.reply({ content: `Sorteio \`${award}\` iniciado no canal ${channel}.`, ephemeral: true })
                } catch (e) {
                    storage.delete(award);
                    return await interaction.reply({ content: 'Ocorreu um erro ao enviar o sorteio', ephemeral: true });
                }

                const options = { time: timeMillis, componentType: ComponentType.Button };
                const collector = message.createMessageComponentCollector(options);

                collector.on('collect', async (i) => {
                    switch (i.customId) {
                        case `GIVEAWAY_ENTER_${award}`: {
                            if (exclusive && !i.member.roles.cache.has(exclusive.id)) {
                                return await i.reply({ content: `Vocë precisa ter o cargo ${roleMention(exclusive.id)} para participar deste sorteio.`, ephemeral: true });
                            }
                            if (giveaway.participants.includes(i.member.id)) {
                                giveaway.participants.forEach((p, index) => { if (p === i.member.id) { giveaway.participants.splice(index, 1) } });
                                await i.update({ components: [buttonGiveaway(award, giveaway.participants)] });
                                return await i.followUp({ content: 'Você não está mais participando do sorteio.', ephemeral: true });
                            } else {
                                giveaway.participants.push(i.member.id);
                                await i.update({ components: [buttonGiveaway(award, giveaway.participants)] });
                                return await i.followUp({ content: 'Você agora está participando do sorteio.', ephemeral: true });
                            }
                        }
                        case 'GIVEAWAY_VIEW_PARTICIPANTS': {
                            let list = [];

                            giveaway.participants.map(p => {
                                const member = i.guild.members.cache.get(p);
                                if (member) list.push(member.user.tag);
                            })

                            const format = list.length === 0 ? 'Sem participantes.' : list.join(', ');
                            return i.reply({ content: 'Participantes do sorteio', ephemeral: true, files: [new AttachmentBuilder(Buffer.from(format, 'ascii'), { name: `participantes.txt` })] });
                        }
                    }
                })


                collector.on('end', async (i, reason) => {
                    if (reason === 'time') {
                        if (winners > giveaway.participants.length) {

                            const embed = EmbedBuilder.from(message.embeds[0]);
                            embed.spliceFields(1, 1, { name: 'Duração', value: `Finalizado <t:${timer}:R>` });
                            embed.spliceFields(3, 1, { name: 'Vencedor(es)', value: `Participantes insuficientes` });

                            storage.delete(award);
                            await message.edit({ embeds: [embed], components: [] }).catch(() => false);
                        } else {
                            const getWinners = () => {
                                return giveaway.participants.sort(() => 0.5 - Math.random()).slice(0, winners)
                                    .map((w => interaction.guild.members.cache.get(w).toString()));
                            }
                            const list = getWinners().join(', ');

                            const embed = EmbedBuilder.from(message.embeds[0]);
                            embed.spliceFields(1, 1, { name: 'Duração', value: `Finalizado <t:${timer}:R>` });
                            embed.spliceFields(3, 1, { name: 'Vencedor(es)', value: `${list}` });

                            storage.delete(award);
                            await message.edit({ embeds: [embed], components: [] }).catch(() => false);
                            await channel.send(`> \`+\` Parabéns 🎉 **${list}**, Você e ganhador do sorteio`);
                        }
                    } else if (reason === 'messageDelete') {
                        storage.delete(award);
                    }
                })
                break;
            }


            case 'finalizar': {
                try {

                    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels))
                        return interaction.reply({
                            content: `${lang.alertNaoTemPermissão}`,
                            ephemeral: true
                        })


                    const award = interaction.options.getString(`premiação`);

                    if (!storage.has(award)) {

                        return await interaction.reply({ content: `Não existe um sorteio com o nome \`${award}\` em andamento.`, ephemeral: true })

                    }

                    const giveaway = storage.get(award)


                    await interaction.guild.channels.fetch(giveaway.channelId[0]).then(async (channel) => await channel.messages.fetch(giveaway.messageId[0]).then((m) => m.delete()).catch(() => false)).catch(() => false)
                    return await interaction.reply({ content: `Sorteio \`${award}\` finalizado.`, ephemeral: true })

                } catch {
                    return
                }
            }
        }
    }
}
