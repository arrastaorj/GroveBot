const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
const idioma = require("../../database/models/language")

module.exports = {
    name: "linguagem",
    description: "Defina o idioma do bot",

    run: async (client, interaction) => {

        let lang = await idioma.findOne({
            guildId: interaction.guild.id
        })
        lang = lang ? require(`../../languages/${lang.language}.js`) : require('../../languages/pt.js')


        //Verificação para somente quem tiver permição usar o comando
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels))
            return interaction.reply({
                content: `${lang.alertNaoTemPermissão}`,
                ephemeral: true
            })



        const buttons = new ActionRowBuilder().addComponents(
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

        const buttons2 = new ActionRowBuilder().addComponents(
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


        const buttonsDesabi = new ActionRowBuilder().addComponents(
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
        const buttons2Desabi = new ActionRowBuilder().addComponents(
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


        const embed = new EmbedBuilder()
            .setTitle("Selecione um idioma")
            .setColor("#ba68c8")
            .setDescription("Escolha o idioma desejado para a comunicação.")
            .setTimestamp()
            .setFooter({ text: `Grove` })


        interaction.reply({ embeds: [embed], components: [buttons, buttons2] }).then(async Message => {

            const filter = i => i.user.id === interaction.user.id
            let col = await Message.createMessageComponentCollector({ filter, time: 30000 });

            col.on('collect', async (button) => {
                if (button.user.id !== interaction.user.id) return;

                const { guild } = interaction;
                const { customId } = button;
                let language, successMessage;

                switch (customId) {
                    case 'pt':
                        language = 'pt';
                        successMessage = `Língua do bot definida para Português - Brasil com sucesso. :flag_br:`;
                        break;
                    case 'en':
                        language = 'en';
                        successMessage = `Bot language successfully changed to English. :flag_gb:`;
                        break;
                    case 'fr':
                        language = 'fr';
                        successMessage = `La langue du bot a été modifiée avec succès en français. :flag_fr:`;
                        break;
                    case 'es':
                        language = 'es';
                        successMessage = `El idioma del bot se cambió con éxito al español. :flag_es:`;
                        break;
                    default:
                        return;
                }

                try {
                    await idioma.findOneAndUpdate(
                        { guildId: guild.id },
                        { $set: { language } },
                        { upsert: true }
                    );

                    await interaction.editReply({
                        embeds: [embed],
                        components: [buttonsDesabi, buttons2Desabi],
                    });

                    interaction.followUp({
                        content: successMessage,
                        ephemeral: true,
                    });

                    await button.deferUpdate();
                    await col.stop();
                } catch (error) {
                    console.error(error);
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

                    await interaction.editReply({
                        embeds: [embed],
                        components: [buttons]
                    }).catch(e => { })
                }
            })
        }).catch(e => { })

    }
}