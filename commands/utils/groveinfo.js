const discord = require('discord.js')
const comandos = require("../../database/models/comandos")
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, } = require("discord.js");
const { readdirSync } = require("fs");
require("moment-duration-format");
const os = require("os");
const idioma = require("../../database/models/language")

module.exports = {
    name: "grove",
    description: 'Veja info sobre mim.',
    options: [
        {
            name: 'info',
            description: 'Veja info sobre mim.',
            type: discord.ApplicationCommandOptionType.Subcommand,

        }

    ],

    run: async (client, interaction, args) => {


        let lang = await idioma.findOne({
            guildId: interaction.guild.id
        })
        lang = lang ? require(`../../languages/${lang.language}.js`) : require('../../languages/pt.js')


        const cmd = await comandos.findOne({
            guildId: interaction.guild.id
        })

        if (!cmd) return interaction.reply({
            content: `${lang.alertCommandos}`,
            ephemeral: true
        })


        let cmd1 = cmd.canal1

        if (cmd1 === null || cmd1 === true || !client.channels.cache.get(cmd1) || cmd1 === interaction.channel.id) {


            function formatTime(milliseconds) {
                const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
                const hours = Math.floor(milliseconds / (1000 * 60 * 60) % 24);
                const minutes = Math.floor(milliseconds / (1000 * 60) % 60);
                const seconds = Math.floor(milliseconds / 1000 % 60);

                return `${days}d, ${hours}h, ${minutes}m, ${seconds}s`;
            }


            var commands = [];
            readdirSync("././commands/").forEach((dir) => {
                var dircmds = readdirSync(`././commands/${dir}/`).filter((file) =>
                    file.endsWith(".js")
                );

                commands = commands.concat(dircmds);
            });


            // data da criação do grove <t:${Math.round(client.user.createdTimestamp / 1000)}>
            // usuarios gerenciando ${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)}
            // total de servidores em que o bot esta ${client.guilds.cache.size}
            // total de comandos ${commands.length}



            const embed = new EmbedBuilder()
                .setAuthor({ name: `Olá, eu sou a Grove. Prazer em conhecê-lo! ✨`, iconURL: client.user.displayAvatarURL() })
                .setColor("#ba68c8")
                .setTitle("Informações sobre mim")
                .setThumbnail(client.user.displayAvatarURL())
                .setDescription(`Atualmente, faço parte de **${client.guilds.cache.size}** servidores e ofereço **${commands.length}** comandos para facilitar sua experiência.

                    Fui criada em <t:${Math.round(client.user.createdTimestamp / 1000)}> com a missão de unificar gerenciamento, administração e utilidades em um só lugar.
                    
                    Atualmente, estou gerenciando **${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)}** membros.`)

                .addFields(
                    {
                        name: `Tempo Online`,
                        value: `${formatTime(client.uptime)}`,
                        inline: true,
                    },
                    {
                        name: `Ping`,
                        value: `${Math.round(client.ws.ping)}ms`,
                        inline: true,
                    },
                )


            interaction.reply({
                embeds: [embed],
                components: [
                    new ActionRowBuilder().addComponents(

                        new ButtonBuilder()
                            .setLabel("Convite")
                            .setURL("https://dsc.gg/grovebot")
                            .setStyle(ButtonStyle.Link),

                        // new ButtonBuilder()
                        //     .setLabel("Website")
                        //     .setURL("https://akaneweb.netlify.app/")
                        //     .setStyle(ButtonStyle.Link),

                        new ButtonBuilder()
                            .setLabel("Top.gg")
                            .setURL("https://top.gg/bot/1053482665942196224/vote")
                            .setStyle(ButtonStyle.Link),

                        new ButtonBuilder()
                            .setLabel("Suporte")
                            .setURL("https://discord.gg/4CB7AjQDAS")
                            .setStyle(ButtonStyle.Link),

                    )
                ]
            })

        }
        else if (interaction.channel.id !== cmd1) {
            interaction.reply({
                content: `${lang.alertCanalErrado} <#${cmd1}>.`,
                ephemeral: true
            })
        }
    }
}

