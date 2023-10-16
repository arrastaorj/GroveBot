const discord = require('discord.js')
const comandos = require("../../database/models/comandos")

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


            const botcor = interaction.guild.members.cache.get(client.user.id)

            //  const up = Math.floor(client.uptime / 60000) % 60;


            const ping = Math.round(client.ws.ping)

            let membros = client.users.cache.size;
            const server = interaction.guild.members.cache.get(client.user.id)

            const b1 = new discord.ButtonBuilder()
                .setLabel(`Me Adicione`)
                .setStyle(5)
                .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot`) //Link do invite

            const botbutton = new discord.ActionRowBuilder().addComponents(b1)

            const botembed = new discord.EmbedBuilder()
                .setTitle(client.user.username)
                .setColor("#41b2b0")
                .setDescription(`*Veja as minhas informações abaixo!*`)
                .addFields(
                    {

                        name: 'Desenvolvedor:',
                        value: `\`\`Arrastão RJ#6839\`\``,
                        inline: true,


                    },
                    {
                        name: 'ID:',
                        value: `\`\`${client.user.id}\`\``,
                        inline: true,

                    },
                    {
                        name: 'Ping:',
                        value: `\`\`Ping: ${ping}\`\``,
                        inline: true

                    },
                    {
                        name: 'Entrou no Servidor:',
                        value: `<t:${Math.ceil(server.joinedTimestamp / 1000)}:F> (<t:${~~(server.joinedTimestamp / 1000)}:R>)`,
                        inline: true,
                    },
                    {
                        name: `Criado:`,
                        value: `<t:${parseInt(client.user.createdTimestamp / 1000)}> (<t:${~~(client.user.createdTimestamp / 1000)}:R>)`,
                        inline: true,
                    },
                  
                    {
                        name: 'Linguagem:',
                        value: `\`\`JavaScript\`\``,
                        inline: true,

                    },
                    {
                        name: 'Livraria:',
                        value: `\`\`discord.js: 14.7.1\`\``,
                        inline: true,
                    },
                    {
                        name: 'Meus comandos:',
                        value: `\`\`Digite /help\`\``,
                        inline: true,
                    },
                    {
                        name: 'Gerenciando:',
                        value: `\`\`Membros: ${membros}\`\``,
                        inline: true,
                    },

                    {
                        name: 'Host',
                        value: '\`\`Discloud\`\`',
                        inline: true,
                    },
                    {
                        name: 'Container',
                        value: '\`\`Online\`\`',
                        inline: true,
                    },
                    {
                        name: `Ram:`,
                        value: `\`\`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) + 'MB'}\`\``,
                        inline: true,
                    },

                )


            interaction.reply({ embeds: [botembed], components: [botbutton] })

        }
        else


            if (interaction.channel.id !== cmd1) { interaction.reply({ content: `> \`-\` <a:alerta:1163274838111162499> Você estar tentando usar um comando no canal de texto errado, tente utiliza-lo no canal de <#${cmd1}>.`, ephemeral: true }) }
    }
}