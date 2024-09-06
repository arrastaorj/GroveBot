const discord = require("discord.js")
const idioma = require("../../database/models/language")
const autorole = require("../../database/models/autorole");
module.exports = {
    name: 'autorole',
    description: 'Veja a lista de cargos configurados.',
    type: discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "list",
            type: discord.ApplicationCommandOptionType.Subcommand,
            description: "Veja a lista de cargos configurados.",
        }
    ],


    run: async (client, interaction) => {

        let lang = await idioma.findOne({
            guildId: interaction.guild.id
        })
        lang = lang ? require(`../../languages/${lang.language}.js`) : require('../../languages/pt.js')



        if (!interaction.member.permissions.has(discord.PermissionFlagsBits.ManageChannels))
            return interaction.reply({
                content: `${lang.alertNaoTemPermissão}`,
                ephemeral: true
            })

        if (!interaction.member.permissions.has(discord.PermissionFlagsBits.ManageChannels))
            return interaction.reply({
                content: `${lang.alertNaoTemPermissão}`,
                ephemeral: true
            })


        // Buscar os cargos configurados no banco de dados
        const configurados = await autorole.find({
            guildId: interaction.guild.id
        });


        if (!configurados || configurados.length === 0) {
            return interaction.reply({
                content: `> \`-\` <a:alerta:1163274838111162499> Este servidor não possui cargos configurados.`,
                ephemeral: true
            });
        }

        // Criar a lista de cargos configurados
        const cargoList = configurados.map(cargo => {
            return [
                cargo.cargo1Id ? `- <@&${cargo.cargo1Id}>` : null,
                cargo.cargo2Id ? `- <@&${cargo.cargo2Id}>` : null,
                cargo.cargo3Id ? `- <@&${cargo.cargo3Id}>` : null,
                cargo.cargo4Id ? `- <@&${cargo.cargo4Id}>` : null,
                cargo.cargo5Id ? `- <@&${cargo.cargo5Id}>` : null,

            ].filter(item => item); // Remove itens null ou undefined
        }).join('\n');

        // Criar embed com a lista de cargos
        const embed = new discord.EmbedBuilder()
            .setTitle(`Lista dos Cargos no Sistema de AutoRole`)
            .setDescription(cargoList)
            .setFooter({ text: `Solicitado por ${interaction.member.user.username}`, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
            .setColor('#41b2b0')
            .setTimestamp();

        // Enviar embed
        return interaction.reply({
            embeds: [embed],

        });

    }
}