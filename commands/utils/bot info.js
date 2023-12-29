const discord = require('discord.js')
const comandos = require("../../database/models/comandos")
const { EmbedBuilder, Client, version } = require("discord.js");
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



            var commands = [];
            readdirSync("././commands/").forEach((dir) => {
                var dircmds = readdirSync(`././commands/${dir}/`).filter((file) =>
                    file.endsWith(".js")
                );

                commands = commands.concat(dircmds);
            });

            const embed = new discord.EmbedBuilder()
                .setAuthor({ name: `${interaction.user.username} ${lang.msg157}`, iconURL: client.user.displayAvatarURL() })
                .setColor("#ba68c8")
                .addFields(
                    {
                        name: `${lang.msg158}`,
                        value: `┕ \`${client.user.username}\``,
                        inline: true,
                    },
                    {
                        name: `${lang.msg159}`,
                        value: `┕ <@424244967893106699>`,
                        inline: true,
                    },
                    {
                        name: `${lang.msg160}`,
                        value: `<t:${Math.round(client.user.createdTimestamp / 1000)}>`,
                        inline: true,
                    },
                    {
                        name: `**${lang.msg161}**`,
                        value: `​ ┕ \`${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)}\`${lang.msg161}`,
                        inline: true,
                    },
                    {
                        name: `**${lang.msg163}**`,
                        value: `​ ┕ \`${client.guilds.cache.size}\``,
                        inline: true,
                    },
                    {
                        name: `**${lang.msg164}**`,
                        value: `​ ┕ \`${client.channels.cache.size}\``,
                        inline: true,
                    },
                    {
                        name: `**${lang.msg165}**`,
                        value: `​ ┕ \`${Math.round(
                            process.memoryUsage().heapUsed / 1024 / 1024
                        )}mb\``,
                        inline: true,
                    },
                    {
                        name: `${lang.msg166}`,
                        value: `┕ \`${process.version}\``,
                        inline: true,
                    },
                    {
                        name: `${lang.msg167}`,
                        value: `┕ \`${version}\``,
                        inline: true,
                    },
                    {
                        name: `${lang.msg168}`,
                        value: `┕ \`${commands.length}\``,
                        inline: true,
                    },
                    {
                        name: `${lang.msg169}`,
                        value: `┕ ${os.type}`,
                        inline: true,
                    },
                    {
                        name: `${lang.msg170}`,
                        value: `┕ ${os.cpus().length}`,
                        inline: true,
                    },
                    {
                        name: `${lang.msg171}`,
                        value: `┕ ${os.cpus()[0].model}`,
                        inline: true,
                    },
                    {
                        name: `${lang.msg172}`,
                        value: `┕ ${os.cpus()[0].speed} MHz`,
                        inline: true,
                    },
                    {
                        name: `${lang.msg173}`,
                        value: `\`${client.options.shardCount}\``,
                        inline: true,
                    },

                )


            interaction.reply({ embeds: [embed] })

        }
        else if (interaction.channel.id !== cmd1) {
            interaction.reply({
                content: `${lang.alertCanalErrado} <#${cmd1}>.`,
                ephemeral: true
            })
        }
    }
}

