const {
    ApplicationCommandType,
    PermissionFlagsBits,
    ApplicationCommandOptionType,
} = require('discord.js')


const GuildConfig = require('../../database/models/antilink.js');
const idioma = require("../../database/models/language")

module.exports = {
    name: 'antilink',
    description: 'Ajuste as configurações do Antilink para maior eficácia em seu servidor.',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'status',
            description: 'Ativar ou desativar o Antilink em seu servidor.',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'action',
                    description: 'Ativar ou desativar o Antilink.',
                    type: ApplicationCommandOptionType.Boolean,
                    required: true,
                },
            ],
        },
        {
            name: 'addrole',
            description: 'Adicionar um cargo que pode enviar links.',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'role',
                    description: 'O cargo a ser adicionado.',
                    type: ApplicationCommandOptionType.Role,
                    required: true,
                },
            ],
        },
        {
            name: 'remrole',
            description: 'Remover um cargo com permissão para enviar links.',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'role',
                    description: 'O cargo a ser removido.',
                    type: ApplicationCommandOptionType.Role,
                    required: true,
                },
            ],
        },
    ],


    async run(client, interaction, args) {


        let lang = await idioma.findOne({
            guildId: interaction.guild.id,
        })
        lang = lang ? require(`../../languages/${lang.language}.js`) : require('../../languages/pt.js')


        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return interaction.reply({

                content: lang.alertNaoTemPermissão,
                ephemeral: true
            })
        }

        const botMember = interaction.guild.members.cache.get(client.user.id)
        if (!botMember.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return interaction.reply({

                content: lang.alertPermissãoBot,
                ephemeral: true
            })
        }



        const guildId = interaction.guild.id;

        let guildConfig = await GuildConfig.findOne({
            guildId,
        })

        if (!guildConfig) {

            guildConfig = await GuildConfig.create({
                guildId,
            })
        }

        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'status') {
            const action = interaction.options.getBoolean('action');
            if (action) {
                if (guildConfig.antilinkEnabled) {

                    await interaction.reply({

                        content: `${lang.AlertaATLAtivo}`,
                        ephemeral: true
                    })

                } else {
                    guildConfig.antilinkEnabled = true
                    await guildConfig.save()

                    await interaction.reply({

                        content: `${lang.msg420}`,
                        ephemeral: true
                    })

                }
            } else {
                if (!guildConfig.antilinkEnabled) {

                    await interaction.reply({

                        content: `${lang.AlertaATLDesativado}`,
                        ephemeral: true
                    })

                } else {
                    guildConfig.antilinkEnabled = false;
                    await guildConfig.save();

                    if (!guildConfig.antilinkEnabled) {
                        await GuildConfig.findOneAndDelete({
                            guildId,
                        })
                    }

                    await interaction.reply({

                        content: `${lang.msg421}`,
                        ephemeral: true
                    })

                }
            }
        } else if (subcommand === 'addrole') {

            const role = interaction.options.getRole('role');
            const roleId = role.id;

            if (!guildConfig.allowedRoles.includes(roleId)) {
                guildConfig.allowedRoles.push(roleId);
                await guildConfig.save();

                await interaction.reply({
                    content: `${lang.msg422} ${role.name} ${lang.msg423}`,
                    ephemeral: true
                })

            } else {

                await interaction.reply({

                    content: `${lang.AlertCargoIncludio} ${role.name} ${lang.AlertCargoIncludio2}`,
                    ephemeral: true
                })

            }
        } else if (subcommand === 'remrole') {
            const role = interaction.options.getRole('role');
            const roleId = role.id;
            const roleIndex = guildConfig.allowedRoles.indexOf(roleId);
            if (roleIndex !== -1) {
                guildConfig.allowedRoles.splice(roleIndex, 1);
                await guildConfig.save();

                await interaction.reply({

                    content: `${lang.msg422} ${role.name} ${lang.msg424}`,
                    ephemeral: true
                })

            } else {

                await interaction.reply({
                    content: `${lang.AlertCargoNPermitido} ${role.name} ${lang.AlertCargoNPermitido2}`,
                    ephemeral: true

                })

            }
        }


    }
}