const client = require('../../index')
const {
    ApplicationCommandOptionType,
    ActionRowBuilder,
    ButtonStyle,
    ButtonBuilder,
    TextInputStyle,
    ModalBuilder,
    TextInputBuilder,
    ApplicationCommandType,
    EmbedBuilder,
    PermissionFlagsBits,
} = require('discord.js')

const idioma = require("../../database/models/language")


const { menssagemID } = require("../../commands/private/slowmode")

client.on("interactionCreate", async (interaction) => {

    let lang = await idioma.findOne({
        guildId: interaction.guild.id
    })
    lang = lang ? require(`../../languages/${lang.language}.js`) : require('../../languages/pt.js')



    const buttons = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`ativar`)
                .setLabel(`Ativar`)
                .setStyle(ButtonStyle.Success)
                .setDisabled(true),
            new ButtonBuilder()
                .setCustomId(`desativar`)
                .setLabel(`Desativar`)
                .setStyle(ButtonStyle.Danger)

        )

    const buttons2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`ativar`)
                .setLabel(`Ativar`)
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId(`desativar`)
                .setLabel(`Desativar`)
                .setStyle(ButtonStyle.Danger)
                .setDisabled(true)
        )

    const modal = new ModalBuilder()
        .setCustomId('model')
        .setTitle(`Painel SlowMode`)
        .setComponents(
            new ActionRowBuilder().setComponents(
                new TextInputBuilder()
                    .setCustomId('ativarSlow')
                    .setLabel(`Tempo de Slow`)
                    .setPlaceholder(`exemplo: (10 = 10 segundos)`)
                    .setMinLength(1)
                    .setMaxLength(5)
                    .setValue("10")
                    .setRequired(true)
                    .setStyle(TextInputStyle.Short)
            )
        );


    let valor;

    switch (interaction.customId) {


        case "ativar": {

            if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels))
                return interaction.reply({
                    content: `${lang.alertNaoTemPermissão}`,
                    ephemeral: true
                })

            await interaction.showModal(modal);

            break;
        }

        case "desativar": {

            if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels))
                return interaction.reply({
                    content: `${lang.alertNaoTemPermissão}`,
                    ephemeral: true
                })

            const channel = interaction.channel;
            const valor = 0;
            channel.setRateLimitPerUser(valor).catch(err => {
                return;
            })

            const resultadoArray = menssagemID
            const numeroSemColchetes = resultadoArray[0];
            const message = await channel.messages.fetch(`${numeroSemColchetes}`);

            await message.edit({ components: [buttons2] })
            return await interaction.reply({ content: `> \`+\` Modo lento está **desativado** com sucesso!`, ephemeral: true })

        }

    }

    if (!interaction.isModalSubmit()) return;

    if (interaction.customId === 'model') {
        await interaction.deferUpdate();
        valor = interaction.fields.getTextInputValue('ativarSlow');


        if (!/^\d+$/.test(valor)) {
            return await interaction.followUp({ content: '> \`-\` <a:alerta:1163274838111162499> Por favor, forneça um número válido.', ephemeral: true });
        }

        const channel = interaction.channel;
        channel.setRateLimitPerUser(parseInt(valor)).catch(err => {
            return;
        });

        const resultadoArray = menssagemID
        const numeroSemColchetes = resultadoArray[0];
        const message = await channel.messages.fetch(`${numeroSemColchetes}`);
        await message.edit({ components: [buttons] })

        return await interaction.followUp({ content: `> \`+\` Modo lento está **Ativado** com sucesso!\n> \`+\` SlowMode de: **${valor}s**`, ephemeral: true })

    }
})
