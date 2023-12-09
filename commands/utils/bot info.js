const discord = require('discord.js')
const comandos = require("../../database/models/comandos")
const { EmbedBuilder, Client, version } = require("discord.js");
const { readdirSync } = require("fs");
require("moment-duration-format");
const os = require("os");

module.exports = {
    name: "lexa",
    description: 'Veja info sobre mim.',
    options: [
        {
            name: 'info',
            description: 'Veja info sobre mim.',
            type: discord.ApplicationCommandOptionType.Subcommand,

        }

    ],

    run: async (client, interaction, args) => {

        const cmd = await comandos.findOne({
            guildId: interaction.guild.id
        })

        if (!cmd) return interaction.reply({ content: `> \`-\` <a:alerta:1163274838111162499> Um Adminitrador ainda não configurou o canal para uso de comandos!`, ephemeral: true })


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
                .setAuthor({ name: `${interaction.user.username} Status/Informações!`, iconURL: client.user.displayAvatarURL() })
                .addFields(
                    {
                        name: "Nome",
                        value: `┕ \`${client.user.username}\``,
                        inline: true,
                    },
                    {
                        name: "Developers",
                        value: `┕ <@424244967893106699>`,
                        inline: true,
                    },
                    {
                        name: "Criação",
                        value: `<t:${Math.round(client.user.createdTimestamp / 1000)}>`,
                        inline: true,
                    },
                    {
                        name: "**Gerenciando**",
                        value: `​ ┕ \`${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)}\`Usuários`,
                        inline: true,
                    },
                    {
                        name: "**Servidores**",
                        value: `​ ┕ \`${client.guilds.cache.size}\``,
                        inline: true,
                    },
                    {
                        name: "**Canais**",
                        value: `​ ┕ \`${client.channels.cache.size}\``,
                        inline: true,
                    },
                    {
                        name: "**Memory usanda**",
                        value: `​ ┕ \`${Math.round(
                            process.memoryUsage().heapUsed / 1024 / 1024
                        )}mb\``,
                        inline: true,
                    },
                    {
                        name: `Node.js Versão`,
                        value: `┕ \`${process.version}\``,
                        inline: true,
                    },
                    {
                        name: `Discord.js Versão`,
                        value: `┕ \`${version}\``,
                        inline: true,
                    },
                    {
                        name: `Comandos`,
                        value: `┕ \`${commands.length}\``,
                        inline: true,
                    },
                    {
                        name: `Plataforma`,
                        value: `┕ ${os.type}`,
                        inline: true,
                    },
                    {
                        name: `Cores`,
                        value: `┕ ${os.cpus().length}`,
                        inline: true,
                    },
                    {
                        name: `Model`,
                        value: `┕ ${os.cpus()[0].model}`,
                        inline: true,
                    },
                    {
                        name: `Valocidade`,
                        value: `┕ ${os.cpus()[0].speed} MHz`,
                        inline: true,
                    },
                    {
                        name: "Shards",
                        value: `\`${client.options.shardCount}\``,
                        inline: true,
                    },
                    
                )


            interaction.reply({ embeds: [embed] })

        }
        else


            if (interaction.channel.id !== cmd1) { interaction.reply({ content: `> \`-\` <a:alerta:1163274838111162499> Você estar tentando usar um comando no canal de texto errado, tente utiliza-lo no canal de <#${cmd1}>.`, ephemeral: true }) }
    }
}

