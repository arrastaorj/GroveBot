const client = require('../../index')
const discord = require("discord.js")
const { EmbedBuilder, roleMention, PermissionsBitField, codeBlock, ActionRowBuilder, ChannelSelectMenuBuilder, ButtonStyle, ButtonBuilder, TextInputBuilder, ModalBuilder, TextInputStyle, ChannelType } = require("discord.js");
const idioma = require("../../database/models/language")

client.on("interactionCreate", async (interaction) => {



    switch (interaction.customId) {
        case 'CREATOR_MENTION_ROLE': {


            if (interaction.values && Array.isArray(interaction.values)) {
                const role = interaction.values[0];
                return await creatorMentionRole(interaction, role);
            }
        }

        // case 'CREATOR_SELECT_CHANNEL': {

        //     if (interaction.values && Array.isArray(interaction.values)) {
        //         const channelId = interaction.values[0];
        //         return await creatorSend(interaction, channelId);
        //     }
        // }
    }
})


const creatorMentionRole = async (interaction, role) => {

    let lang = await idioma.findOne({
        guildId: interaction.guild.id
    })
    lang = lang ? require(`../../languages/${lang.language}.js`) : require('../../languages/pt.js')

    const message = interaction.message;

    if (!message.embeds) {
        return await interaction.reply({ content: `${lang.msg375}`, ephemeral: true })
    }

    await interaction.update({ content: `${roleMention(role)}` });
}

// const creatorSend = async (interaction, channelId) => {

//     let lang = await idioma.findOne({
//         guildId: interaction.guild.id
//     })
//     lang = lang ? require(`../../languages/${lang.language}.js`) : require('../../languages/pt.js')


//     const channel = interaction.guild.channels.cache.get(channelId);
//     const message = interaction.message;

//     if (!channel) {
//         return await interaction.reply({ content: `${lang.msg397}`, ephemeral: true });
//     }
//     else if (!message.embeds) {
//         return await interaction.reply({ content: `${lang.msg375}`, ephemeral: true })
//     }

//     const content = message.content;
//     const embed = EmbedBuilder.from(message.embeds[0]);

//     switch (channel.type) {
//         case ChannelType.GuildText: {
//             await channel.send({ content: content, embeds: [embed] });
//             return await interaction.update({ content: `${lang.msg398} ${channel}.'`, embeds: [], components: [], ephemeral: true });
//         }
//         case ChannelType.GuildForum: {
//             await channel.threads.create({ name: embed.data.title, autoArchiveDuration: 60, message: { content: content, embeds: [embed] } });
//             return await interaction.update({ content: `${lang.msg398} ${channel}.'`, embeds: [], components: [], ephemeral: true });
//         }
//         case ChannelType.PublicThread: {
//             await channel.send({ content: content, embeds: [embed] });
//             return await interaction.update({ content: `${lang.msg398} ${channel}.'`, embeds: [], components: [], ephemeral: true });
//         }
//         case ChannelType.PrivateThread: {
//             await channel.send({ content: content, embeds: [embed] });
//             return await interaction.update({ content: `${lang.msg398} ${channel}.'`, embeds: [], components: [], ephemeral: true });
//         }
//         default: {
//             return await interaction.reply({ content: `${lang.msg399}`, ephemeral: true });
//         }
//     }

// }