const client = require('../../index')
const discord = require("discord.js")
const idioma = require("../../database/models/language")


client.on("interactionCreate", async (interaction) => {

    let lang = await idioma.findOne({
        guildId: interaction.guild.id
    })

    if (!lang || !lang.language) {
        lang = { language: client.language };
    }
    lang = require(`../../languages/${lang.language}.js`)


    if (interaction.isButton()) {
        if (interaction.customId.startsWith("botao_modal")) {
            const modal = new discord.ModalBuilder()
                .setCustomId('modal_sugestao')
                .setTitle(`${lang.msg301}`)
            const sugestao3 = new discord.TextInputBuilder()
                .setCustomId('sugestão')
                .setLabel(`${lang.msg302}`)
                .setStyle(discord.TextInputStyle.Paragraph)

            const firstActionRow = new discord.ActionRowBuilder().addComponents(sugestao3);
            modal.addComponents(firstActionRow)
            await interaction.showModal(modal);

            interaction.followUp({
                content: `${interaction.user}, ${lang.msg303}`,
                ephemeral: true
            })
        }
    }


    if (!interaction.isModalSubmit()) return;
    if (interaction.customId === 'modal_sugestao') {
        const moment = require("moment")
        let channel = client.channels.cache.get('1054331649220943903') //canal para o envio da sugestão.
        const sugestao2 = interaction.fields.getTextInputValue('sugestão');

        interaction.reply({
            content: `${interaction.user}, ${lang.msg304}`, ephemeral: true
        })

        channel.send({
            embeds: [new discord.EmbedBuilder()
                .setAuthor({ name: `${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dinamyc: true }) })
                .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dinamyc: true }) })
                .setThumbnail(interaction.user.displayAvatarURL({ format: "png", dinamyc: true, size: 4096 }))
                .setDescription(`**Horário da sugestão:**
    <t:${moment(interaction.createdTimestamp).unix()}>(<t:${parseInt(interaction.createdTimestamp / 1000)}:R>)
    
    **Sobre o usuário:**
    
    **ID:** (\`${interaction.user.id}\`)
    **Usuario:** ${interaction.user}
    **Nome no discord:** \`${interaction.user.tag}\`
    
    **Sugestão:**
    \`\`\`${sugestao2}\`\`\``)
            ]
        })
    }
})