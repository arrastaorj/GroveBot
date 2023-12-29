const discord = require("discord.js")
const bot = require("../../bot.json")
const comandos = require("../../database/models/comandos")
const idioma = require("../../database/models/language")

module.exports = {
    name: "server",
    description: "Veja as informações do servidor.",
    type: discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'info',
            description: 'Veja as informações do servidor.',
            type: discord.ApplicationCommandOptionType.Subcommand,
        }

    ],
    run: async (client, interaction) => {


        let lang = await idioma.findOne({
            guildId: interaction.guild.id
        })
        lang = lang ? require(`../../languages/${lang.language}.js`) : require('../../languages/pt.js')


        const cmd = await comandos.findOne({
            guildId: interaction.guild.id
        })

        if (!cmd)
            return interaction.reply({
                content: `${lang.alertCommandos}`,
                ephemeral: true
            })

        let cmd1 = cmd.canal1

        if (cmd1 === null || cmd1 === false || !client.channels.cache.get(cmd1) || cmd1 === interaction.channel.id) {


            const { guild } = interaction

            const {
                createdTimestamp,
                ownerId,
                description,
                members,
                memberCount,
                channels,
            } = guild

            const botcount = members.cache.filter((member) => member.user.bot).size
            const getChannelTypeSize = (type) => channels.cache.filter((channel) => type.includes(channel.type)).size

            const totalchannels = getChannelTypeSize([
                discord.ChannelType.GuildText,
                discord.ChannelType.GuildVoice,
                discord.ChannelType.GuildStageVoice,
                discord.ChannelType.GuildPublicThread,
                discord.ChannelType.GuildPrivateThread,
                discord.ChannelType.GuildForum,
                discord.ChannelType.GuildNews,
                discord.ChannelType.GuildCategory,
                discord.ChannelType.GuildNewsThread,
            ])


            const embed = new discord.EmbedBuilder()
                .setColor("#ba68c8")
                .setImage(guild.bannerURL({ size: 1024 }))
                .setAuthor({ name: guild.name, iconURL: guild.iconURL({ dynamic: true }) })
                .setThumbnail(guild.iconURL({ dynamic: true }))
                .addFields(
                    {
                        name: `Descrição`,
                        value: [`${guild.description || `Não possui`}`].join("\n")
                    },
                    {
                        name: `Informações Gerais`,
                        value: [
                            `Nome: ${guild.name}`,
                            `ID: \`\`${guild.id}\`\``,
                            `Criado em: <t:${~~(createdTimestamp / 1000)}> (<t:${~~(createdTimestamp / 1000)}:R>)`,
                            `Dono: <@${ownerId}>`,
                            `URL: \`\`${guild.vanityURLCode || `Não possui`}\`\``,
                        ].join("\n")

                    },
                    {
                        name: `Canais (${totalchannels})`,
                        value: [
                            `Texto: ${getChannelTypeSize([
                                discord.ChannelType.GuildText,
                                discord.ChannelType.GuildForum,
                                discord.ChannelType.GuildNews,
                            ])}`
                            ,
                            `Voz: ${getChannelTypeSize([
                                discord.ChannelType.GuildStageVoice,
                                discord.ChannelType.GuildVoice,
                            ])}`
                            ,
                            `Tópicos: ${getChannelTypeSize([
                                discord.ChannelType.GuildPublicThread,
                                discord.ChannelType.GuildPrivateThread,
                                discord.ChannelType.GuildNewsThread,
                            ])}`
                            ,
                            `Categorias: ${getChannelTypeSize([
                                discord.ChannelType.GuildCategory,
                            ])}`
                        ].join("\n"),
                        inline: true,
                    },
                    {
                        name: `Objetivos do servidor`,
                        value: [
                            `Nivel de impulso: ${guild.premiumTier}`,
                            `Total de impulsos: ${guild.premiumSubscriptionCount}`,

                        ].join("\n"),
                        inline: true,

                    },

                    {
                        name: `Membros`,
                        value: [
                            `Usuários: ${guild.memberCount - botcount}`,
                            `Bots: ${botcount}`,

                        ].join("\n"),
                        inline: true,

                    },
                    
                    { name: `Banner do servidor`, value: guild.bannerURL() ? "** **" : `Esse servidor não possui um banner` }
                )
            await interaction.reply({ embeds: [embed] })

        }

        else if (interaction.channel.id !== cmd1) {
            interaction.reply({
                content: `${lang.alertCanalErrado} <#${cmd1}>.`,
                ephemeral: true
            })
        }
    }

}
