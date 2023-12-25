const {
    ActionRowBuilder,
    ButtonStyle,
    ButtonBuilder,
    PermissionFlagsBits,
    ApplicationCommandType,
    EmbedBuilder,
    ApplicationCommandOptionType,
    ChannelType,
} = require('discord.js')

const idioma = require("../../database/models/language")

const menssagemID = []

module.exports = {
    name: 'slowmode',
    description: 'Painel para gerência o SlowMode do chat.',
    type: ApplicationCommandType.ChatInput,

    menssagemID,


    async run(client, interaction, args) {


        let lang = await idioma.findOne({
            guildId: interaction.guild.id
        })
        lang = lang ? require(`../../languages/${lang.language}.js`) : require('../../languages/pt.js')


        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels))
            return interaction.reply({
                content: `${lang.alertNaoTemPermissão}`,
                ephemeral: true
            })




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



        const embed = new EmbedBuilder()
            .setTitle(`Painel SlowMode`)
            .setColor('#41b2b0')
            .setDescription(`Configura abaixo o modo de texto no chat`)


        const channel = interaction.channel

        if (channel.rateLimitPerUser === 0) {

            await channel.send({
                embeds: [embed],
                components: [buttons2]
            }).then(async sentMessage => {

                const messageId = sentMessage.id;
                menssagemID.push(messageId)
            })

            return await interaction.reply({
                content: `> \`+\` Acabei de envei o painel no ${channel} `,
                ephemeral: true
            })
        }

        if (channel.rateLimitPerUser > 0) {

            await channel.send({
                embeds: [embed],
                components: [buttons]
            }).then(async sentMessage => {

                const messageId = sentMessage.id;
                menssagemID.push(messageId)
            })

            return await interaction.reply({
                content: `> \`+\` Acabei de envei o painel no ${channel} `,
                ephemeral: true
            })

        }
    }
}