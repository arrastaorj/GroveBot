const discord = require("discord.js")
const { ContextMenuCommandInteraction, ButtonStyle, ActionRowBuilder, ButtonBuilder, ApplicationCommandType, EmbedBuilder } = require("discord.js")
const a = require('../../plugins/getUser')
const comandos = require("../../database/models/comandos")



module.exports = {
    name: "View User Info",
    category: "Context",
    type: discord.ApplicationCommandType.User,
    /**
     *
     * @param {ContextMenuCommandInteraction} interaction
     */

    async run(client, interaction, args) {

        const cmd = await comandos.findOne({
            guildId: interaction.guild.id
        })

        if (!cmd) return interaction.reply({ content: `> \`-\` Um Adminitrador ainda não configurou o canal para uso de comandos!`, ephemeral: true })


        let cmd1 = cmd.canal1

        if (cmd1 === null || cmd1 === false || !client.channels.cache.get(cmd1) || cmd1 === interaction.channel.id) {

            let membro = interaction.guild.members.cache.get(interaction.targetId) || client.users.cache.get(interaction.targetId);

            let user = interaction.guild.members.cache.get(membro.id)

            let user2 = await a.getUser(membro.id, client.token)

            const member = interaction.guild.members.cache.get(user.id)

            let AvatarUser = user.displayAvatarURL({ size: 4096, dynamic: true, format: "png" })

            let list = []

            const userData = await fetch(`https://discord-arts.asure.dev/user/${user.id}`)
            const { data } = await userData.json()
            const { public_flags_array } = data


            if (public_flags_array.includes('NITRO')) list.push("NITRO")
            if (public_flags_array.includes('BOOSTER_1')) list.push("BOOSTER_1")
            if (public_flags_array.includes('BOOSTER_2')) list.push("BOOSTER_2")
            if (public_flags_array.includes('BOOSTER_3')) list.push("BOOSTER_3")
            if (public_flags_array.includes('BOOSTER_6')) list.push("BOOSTER_6")
            if (public_flags_array.includes('BOOSTER_9')) list.push("BOOSTER_9")
            if (public_flags_array.includes('BOOSTER_12')) list.push("BOOSTER_12")
            if (public_flags_array.includes('BOOSTER_15')) list.push("BOOSTER_15")
            if (public_flags_array.includes('BOOSTER_18')) list.push("BOOSTER_18")
            if (public_flags_array.includes('BOOSTER_24')) list.push("BOOSTER_24")


            if (public_flags_array.includes('HOUSE_BALANCE')) list.push("HOUSE_BALANCE")
            if (public_flags_array.includes('HOUSE_BRAVERY')) list.push("HOUSE_BRAVERY")
            if (public_flags_array.includes('HOUSE_BRILLIANCE')) list.push("HOUSE_BRILLIANCE")


            if (!user.discriminator || user.discriminator === 0 || user.tag === `${user.username}#0`) {

                list.push("TAG")
            }

            if (public_flags_array.includes('ACTIVE_DEVELOPER')) list.push("ACTIVE_DEVELOPER")//desenvolvedor ativo
            if (public_flags_array.includes('EARLY_SUPPORTER')) list.push("EARLY_SUPPORTER")//apoiador inicial
            if (public_flags_array.includes('EARLY_VERIFIED_BOT_DEVELOPER')) list.push("EARLY_VERIFIED_BOT_DEVELOPER")//desenvolvedor verificado de bots pioneiro
            if (public_flags_array.includes('VERIFIED_BOT')) list.push("VERIFIED_BOT")//bot verificado
            if (public_flags_array.includes('DISCORD_CERTIFIED_MODERATOR')) list.push("DISCORD_CERTIFIED_MODERATOR")//ex moderador do discord


            list = list
                .join(",")
                .replace("BOOSTER_1", "<:image:1061728732903133359>")
                .replace("BOOSTER_2", "<:image4:1061732682599514313>")
                .replace("BOOSTER_3", "<:image6:1061732685246107749>")
                .replace("BOOSTER_6", "<:image7:1061732687255179365>")
                .replace("BOOSTER_9", "<:image8:1061732688869998612>")
                .replace("BOOSTER_12", "<:image1:1061732675938955384>")
                .replace("BOOSTER_15", "<:image2:1061732678522638438>")
                .replace("BOOSTER_18", "<:image3:1061732680154235000>")
                .replace("BOOSTER_24", "<:image5:1061732683903938640>")
                .replace("NITRO", "<:4306subscribernitro:1061715332378673203>")


                .replace("HOUSE_BALANCE", `<:5242hypesquadbalance:1061274091623034881>`)
                .replace("HOUSE_BRAVERY", `<:6601hypesquadbravery:1061274089609760908>`)
                .replace("HOUSE_BRILLIANCE", `<:6936hypesquadbrilliance:1061274087193854042>`)

                .replace("TAG", `<:username:1161109720870948884>`)
                .replace("ACTIVE_DEVELOPER", `<:7011activedeveloperbadge:1061277829255413781>`)
                .replace("EARLY_SUPPORTER", `<:Early_Supporter:1063599098135060590>`)
                .replace("EARLY_VERIFIED_BOT_DEVELOPER", `<:Early_Verified_Bot_Developer:1063599974098665592>`)
                .replace("VERIFIED_BOT", `<:verifiedbotbadge:1063600609699311676>`)
                .replace("DISCORD_CERTIFIED_MODERATOR", `<:9765badgemoderators:1063603971471720458>`)



            const permsObj = {
                CreateInstantInvite: '\`Criar convite instantâneo\`',
                KickMembers: '\`Expulsar membros\`',
                BanMembers: '\`Banir membros\`',
                Administrator: '\`Administrador\`',
                ManageChannels: '\`Gerenciar canais\`',
                ManageGuild: '\`Gerenciar servidor\`',
                AddReactions: '\`Adicionar reações\`',
                ViewAuditLog: '\`Ver registro de auditoria\`',
                PrioritySpeaker: '\`Voz Prioritária\`',
                Stream: '\`Ao vivo\`',
                ViewChannel: '\`Ver canais\`',
                SendMessages: '\`Enviar mensagens\`',
                SendTTSMessages: '\`Enviar mensagens em tts\`',
                ManageMessages: '\`Gerenciar mensagens\`',
                EmbedLinks: '\`Enviar links\`',
                AttachFiles: '\`Enviar anexos\`',
                ReadMessageHistory: '\`Ver histórico de mensagens\`',
                MentionEveryone: '\`Mencionar everyone e cargos\`',
                UseExternalEmojis: '\`Usar emojis externos\`',
                UseExternalStickers: '\`Usar figurinhas externas\`',
                ViewGuildInsights: '\`Ver análises do servidor\`',
                Connect: "\`Conectar em call's\`",
                Speak: `\`Falar em call's\``,
                MuteMembers: `\`Mutar membros\``,
                DeafenMembers: `\`Ensurdecer membros\``,
                MoveMembers: `\`Mover membros\``,
                UseVAD: `\`Utilizar detecção de voz\``,
                ChangeNickname: `\`Alterar apelido\``,
                ManageNicknames: `\`Gerenciar apelidos\``,
                ManageRoles: `\`Gerenciar cargos\``,
                ManageWebhooks: `\`Gerenciar webhooks\``,
                ManageEmojisAndStickers: `\`Gerenciar emojis e figurinhas\``,
                UseApplicationCommands: `\`Utilizar comandos slashs (/)\``,
                RequestToSpeak: `\`Pedir para falar\``,
                ManageEvents: `\`Gerenciar eventos\``,
                ManageThreads: `\`Gerenciar threads\``,
                CreatePublicThreads: `\`Criar threads públicas\``,
                CreatePrivateThreads: `\`Criar threads privadas\``,
                SendMessagesInThreads: `\`Falar em threads\``,
                UseEmbeddedActivities: `\`Iniciar atividades\``,
                ModerateMembers: `\`Gerenciar moderação do servidor\``
            }


            let btn1 = new discord.ActionRowBuilder().addComponents([

                new discord.ButtonBuilder()
                    .setStyle("Primary")
                    .setLabel("Avatar")
                    .setCustomId("avatar"),

                new discord.ButtonBuilder()
                    .setStyle("Secondary")
                    .setLabel("Banner")
                    .setCustomId("banner"),

                new discord.ButtonBuilder()
                    .setLabel('Permissões do Membro')
                    .setStyle("Success")
                    .setCustomId('verPerms')

            ]);

            let btn2 = new discord.ActionRowBuilder().addComponents([

                new discord.ButtonBuilder()
                    .setStyle("Secondary")
                    .setLabel("Pagina inicial")
                    .setCustomId("inicial"),

            ])

            let btn3 = new discord.ActionRowBuilder().addComponents([

                new discord.ButtonBuilder()
                    .setStyle("Primary")
                    .setLabel("Avatar")
                    .setCustomId("avatar"),

                new discord.ButtonBuilder()
                    .setLabel('Permissões do Membro')
                    .setStyle("Success")
                    .setCustomId('verPerms')
            ])


            const embed = new discord.EmbedBuilder()
                .setColor("#41b2b0")
                .setTitle(list.split(",").join(" "))
                .setAuthor({ name: `${data.global_name}` })
                .setThumbnail(AvatarUser)
                .setFields(
                    {
                        name: '<:channel:1026580767796625490> Tag',
                        value: `\`\`\`${member.user.tag}\`\`\``,
                        inline: true
                    },
                    {
                        name: '<:idd:1026580771181428806> ID',
                        value: `\`\`\`${member.user.id}\`\`\``,
                        inline: true
                    },
                    {
                        name: '<:data:1026580769503723550> Data de criação da conta',
                        value: `<t:${~~Math.ceil(member.user.createdTimestamp / 1000)}> (<t:${~~(member.user.createdTimestamp / 1000)}:R>)`,
                        inline: false
                    },
                    {
                        name: '<:data:1026580769503723550> Entrou em',
                        value: `<t:${~~(user.joinedTimestamp / 1000)}:f> (<t:${~~(user.joinedTimestamp / 1000)}:R>)`,
                        inline: false
                    }
                )



            if (user2.banner) {



                let bannerURL = `https://cdn.discordapp.com/banners/${user2.id}/${user2.banner ? user2.banner : 'undefined'}.${user2?.banner?.substring(0, 2) === "a_" ? "gif" : "png"}?size=512`


                let avatar = new discord.EmbedBuilder()

                    .setImage(AvatarUser)
                    .setColor("#41b2b0")
                let banner = new discord.EmbedBuilder()

                    .setImage(bannerURL)
                    .setColor("#41b2b0")

                const permsArray = member.permissions.toArray().map(p => permsObj[p])

                const embedPerms = new discord.EmbedBuilder()
                    .setColor('#41b2b0')
                    .addFields(
                        {
                            name: 'Maior Cargo:',
                            value: `${member.roles.cache.sort((a, b) => b.position - a.position).first()}`,
                            inline: false
                        },
                        {
                            name: `Permissões de ${membro.username}`,
                            value: `${permsArray.join(', ')}`
                        }
                    )


                const m = await interaction.reply({ embeds: [embed], components: [btn1], fetchReply: true })



                const collector = m.createMessageComponentCollector({ time: 10 * 60000 });


                collector.on('collect', async (i) => {

                    if (i.user.id != interaction.user.id) return i.reply({ content: `Somente a pessoa que executou o comando (\`${interaction.user.tag}\`) pode interagir com ele.`, ephemeral: true });

                    i.deferUpdate()
                    switch (i.customId) {


                        case `avatar`:
                            m.edit({ embeds: [avatar], components: [btn2] })
                            break;

                        case `inicial`:
                            m.edit({ embeds: [embed], components: [btn1] })
                            break;


                        case `banner`:
                            m.edit({ embeds: [banner], components: [btn2] })
                            break;

                        case `verPerms`:
                            m.edit({ embeds: [embedPerms], components: [btn2] })
                            break;


                        case `fechar`:
                    }
                })

            } else {

                const permsArray = member.permissions.toArray().map(p => permsObj[p])

                const embedPerms = new discord.EmbedBuilder()
                    .setColor('#41b2b0')
                    .addFields(
                        {
                            name: 'Maior Cargo:',
                            value: `${member.roles.cache.sort((a, b) => b.position - a.position).first()}`,
                            inline: false
                        },
                        {
                            name: `Permissões de ${membro.username}`,
                            value: `${permsArray.join(', ')}`
                        }
                    )


                let avatar = new discord.EmbedBuilder()
                    .setImage(AvatarUser)
                    .setColor("#41b2b0")
                const m = await interaction.reply({ embeds: [embed], components: [btn3], fetchReply: true })



                const collector = m.createMessageComponentCollector({ time: 10 * 60000 });


                collector.on('collect', async (i) => {

                    if (i.user.id != interaction.user.id) return i.reply({ content: `Somente a pessoa que executou o comando (\`${interaction.user.tag}\`) pode interagir com ele.`, ephemeral: true });

                    i.deferUpdate()
                    switch (i.customId) {


                        case `avatar`:
                            m.edit({ embeds: [avatar], components: [btn2] })
                            break;


                        case `inicial`:
                            m.edit({ embeds: [embed], components: [btn3] })
                            break;


                        case `verPerms`:
                            m.edit({ embeds: [embedPerms], components: [btn2] })
                            break;

                        case `fechar`:
                    }
                })
            }

        }
        else

            if (interaction.channel.id !== cmd1) { interaction.reply({ content: `Você estar tentando usar um comando no canal de texto errado, tente utiliza-lo no canal de <#${cmd1}>.`, ephemeral: true }) }
    }
}


