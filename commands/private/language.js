const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
const idioma = require("../../database/models/language")

module.exports = {
    name: "linguagem",
    description: "Defina o idioma do bot",

    run: async (client, interaction) => {

        let lang = await idioma.findOne({ guildId: interaction.guild.id });
        if (!lang || !lang.language) {
            lang = { language: client.language };
        }
        lang = require(`../../languages/${lang.language}.js`);


        //Verificação para somente quem tiver permição usar o comando
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels))
            return interaction.reply({
                content: `${lang.alertNaoTemPermissão}`,
                ephemeral: true
            })



        let buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel("English")
                .setCustomId('en')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('🇬🇧'),
            new ButtonBuilder()
                .setLabel("Français")
                .setCustomId('fr')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('🇫🇷'),
        )

        let buttons2 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel("Português")
                .setCustomId('pt')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('🇧🇷'),
            new ButtonBuilder()
                .setLabel("Español")
                .setCustomId('es')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('🇪🇸'),
        )


        let buttonsDesabi = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel("English")
                .setCustomId('en')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('🇬🇧')
                .setDisabled(true),
            new ButtonBuilder()
                .setLabel("Français")
                .setCustomId('fr')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('🇫🇷')
                .setDisabled(true),
        )
        let buttons2Desabi = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel("Português")
                .setCustomId('pt')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('🇧🇷')
                .setDisabled(true),
            new ButtonBuilder()
                .setLabel("Español")
                .setCustomId('es')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('🇪🇸')
                .setDisabled(true),
        )


        let embed = new EmbedBuilder()
            .setTitle("Selecione um idioma")
            .setColor("#6dfef2")
            .setDescription("Escolha o idioma desejado para a comunicação.")
            .setTimestamp()
            .setFooter({ text: `Grove` })


        interaction.reply({ embeds: [embed], components: [buttons, buttons2] }).then(async Message => {

            const filter = i => i.user.id === interaction.user.id
            let col = await Message.createMessageComponentCollector({ filter, time: 30000 });

            col.on('collect', async (button) => {
                if (button.user.id !== interaction.user.id) return
                switch (button.customId) {


                    case 'pt':
                        await idioma.findOneAndUpdate(
                            { guildId: interaction.guild.id },
                            { $set: { language: 'pt' } },
                            { upsert: true }
                        ).catch(e => { });

                        await interaction.editReply({
                            embeds: [embed],
                            components: [buttonsDesabi, buttons2Desabi],
                        }).catch(e => { })

                        interaction.followUp({
                            content: `Língua do bot definida para Português - Brasil com sucesso. :flag_br:`,
                            ephemeral: true
                        })

                        await button.deferUpdate().catch(e => { });
                        await col.stop();
                        break;

                    case 'en':
                        await idioma.findOneAndUpdate(
                            { guildId: interaction.guild.id },
                            { $set: { language: 'en' } },
                            { upsert: true }
                        ).catch(e => { })

                        await interaction.editReply({
                            embeds: [embed],
                            components: [buttonsDesabi, buttons2Desabi],
                        }).catch(e => { })

                        interaction.followUp({
                            content: `Bot language successfully changed to English. :flag_gb:`,
                            ephemeral: true
                        })

                        await button.deferUpdate().catch(e => { });
                        await col.stop();
                        break;

                    case 'fr':
                        await idioma.findOneAndUpdate(
                            { guildId: interaction.guild.id },
                            { $set: { language: 'fr' } },
                            { upsert: true }
                        ).catch(e => { })

                        await interaction.editReply({
                            embeds: [embed],
                            components: [buttonsDesabi, buttons2Desabi],
                        }).catch(e => { })

                        interaction.followUp({
                            content: `La langue du bot a été modifiée avec succès en français. :flag_fr:`,
                            ephemeral: true
                        })
                        await button.deferUpdate().catch(e => { })
                        await col.stop()
                        break

                    case 'es':
                        await idioma.findOneAndUpdate(
                            { guildId: interaction.guild.id },
                            { $set: { language: 'es' } },
                            { upsert: true }
                        ).catch(e => { })

                        await interaction.editReply({
                            embeds: [embed],
                            components: [buttonsDesabi, buttons2Desabi]
                        }).catch(e => { })

                        interaction.followUp({
                            content: `El idioma del bot se cambió con éxito al español. :flag_es:`,
                            ephemeral: true
                        })


                        await button.deferUpdate().catch(e => { })
                        await col.stop()
                        break

                }
            })

            col.on('end', async (button, reason) => {
                if (reason === 'time') {
                    buttons = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Secondary)
                            .setLabel(lang.msg45)
                            .setCustomId("timeend")
                            .setDisabled(true))

                    embed = new EmbedBuilder()

                        .setTitle("O tempo terminou. Tente novamente")
                        .setTimestamp()
                        .setFooter({ text: `Grove` })

                    await interaction.editReply({ embeds: [embed], components: [buttons] }).catch(e => { })
                }
            })
        }).catch(e => { })

    }
}