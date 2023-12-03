const discord = require("discord.js");
const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');

const { DisTube } = require('distube')

const distube = require("../../Eventos/distube/distube");


module.exports = {
    name: 'play',
    description: "Toque uma musica no canal de voz.",
    voiceChannel: true,
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'song',
            description: 'Insira o nome da musica ou link',
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],

    run: async (client, interaction, args) => {


        let music = interaction.options.getString('song')
        let channel = interaction.member.voice.channel;

        if (!channel) return interaction.reply({ content: `Você não esta em um canal de voz!`, ephemeral: true })


        distube.play(interaction.member.voice?.channel, music, {
            member: interaction.member,
            textChannel: interaction.channel,
            interaction
        })

        interaction.reply(`teste`).then((msg) => {
            setTimeout(() => {
                msg.delete().catch((e) => null);
            }, 100);
        });

    }
}