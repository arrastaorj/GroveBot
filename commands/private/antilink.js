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

                        content: `> \`-\` <a:alerta:1163274838111162499> O antilink já está ativado em seu servidor.`,
                        ephemeral: true
                    })

                } else {
                    guildConfig.antilinkEnabled = true
                    await guildConfig.save()

                    await interaction.reply({

                        content: `> \`+\` O Antilink foi ativado em seu servidor. Agora, estou fortalecendo a proteção contra links indesejados para garantir a segurança do seu servidor.`,
                        ephemeral: true
                    })

                }
            } else {
                if (!guildConfig.antilinkEnabled) {

                    await interaction.reply({

                        content: `> \`-\` <a:alerta:1163274838111162499> O antilink já está desativado em seu servidor.`,
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

                        content: `> \`+\` O antilink foi desativado em seu servidor.`,
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
                    content: `> \`+\` O cargo ${role.name} foi adicionado à lista de cargos permitidos para enviar links.`,
                    ephemeral: true
                })

            } else {

                await interaction.reply({

                    content: `> \`-\` <a:alerta:1163274838111162499> O cargo ${role.name} já foi incluído na lista de cargos autorizados para enviar links.`,
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

                    content: `> \`+\` O cargo ${role.name} foi removido da lista de cargos permitidos para enviar links.`,
                    ephemeral: true
                })

            } else {

                await interaction.reply({

                    content: `> \`-\` <a:alerta:1163274838111162499> O cargo ${role.name} não estava na lista de cargos permitidos para enviar links.`,
                    ephemeral: true

                })

            }
        }


    }
}