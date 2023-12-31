const {
    ApplicationCommandType,
    ApplicationCommandOptionType,
    EmbedBuilder,

} = require("discord.js")

const canalComandos = require("../../database/models/comandos")
const idioma = require("../../database/models/language")
const banco = require("../../database/models/banco")


module.exports = {
    name: 'conta',
    description: 'Crie uma conta no banco Grove',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "bancaria",
            type: ApplicationCommandOptionType.Subcommand,
            description: "Crie uma conta no banco Grove",
            options: [
                {
                    name: "pix",
                    type: ApplicationCommandOptionType.String,
                    description: "Cadastre sua chave Pix",
                    required: true
                },
            ],
        },
    ],

    run: async (client, interaction) => {


        let lang = await idioma.findOne({
            guildId: interaction.guild.id
        })
        lang = lang ? require(`../../languages/${lang.language}.js`) : require('../../languages/pt.js')


        const canalID = await canalComandos.findOne({
            guildId: interaction.guild.id
        })
        if (!canalID) return interaction.reply({
            content: `${lang.alertCommandos}`,
            ephemeral: true
        })

        let canalPermitido = canalID.canal1
        if (interaction.channel.id !== canalPermitido) {
            return interaction.reply({
                content: `${lang.alertCanalErrado} <#${canalPermitido}>.`,
                ephemeral: true
            })
        }

        const chavePix = interaction.options.getString("pix")


        const queryExistente = await banco.findOne({
            guildId: interaction.guild.id,
            pix: chavePix,
        });

        if (queryExistente) {
            return interaction.reply(`${lang.AlertaChavePix}`)
        }


        const query = await banco.findOne({
            guildId: interaction.guild.id,
            userId: interaction.user.id,
        })

        if (!query) {

            const novoUsuario = {
                guildId: interaction.guild.id,
                userId: interaction.user.id,
                saldo: 0,
                bank: 0,
                pix: chavePix,
                valorDaily: 0,
                lastDaily: 0,
                begTimeout: 0,

            }

            await banco.create(novoUsuario)

            const embed = new EmbedBuilder()
                .setColor('#41b2b0')
                .setTitle(`${lang.msg402}`)
                .setDescription(`${lang.msg403}`)
                .setThumbnail(interaction.user.displayAvatarURL({ extension: 'png' }))
                .setFields(
                    { name: `${lang.msg404}`, value: `${interaction.guild}`, inline: true },
                    { name: `${lang.msg405}`, value: `<@${interaction.user.id}>`, inline: true },
                    { name: `${lang.msg406}`, value: `${chavePix}`, inline: true },
                    { name: `${lang.msg407}`, value: `${lang.msg408}` },
                )
                .setFooter({
                    iconURL: interaction.user.displayAvatarURL({ extension: 'png' }),
                    text: `${lang.msg410} ${interaction.user.displayName}`,
                })
                .setTimestamp()

            interaction.reply({
                embeds: [embed],
            })

        } else {

            const guild = interaction.client.guilds.cache.get(query.guildId);

            const embed = new EmbedBuilder()
                .setColor('#41b2b0')
                .setTitle(`${lang.msg402}`)
                .setDescription(`${lang.msg409}`)
                .setThumbnail(interaction.user.displayAvatarURL({ extension: 'png' }))
                .setFields(
                    { name: `${lang.msg404}`, value: `${interaction.guild}`, inline: true },
                    { name: `${lang.msg405}`, value: `<@${interaction.user.id}>`, inline: true },
                    { name: `${lang.msg406}`, value: `${chavePix}`, inline: true },
                    { name: `${lang.msg407}`, value: `${lang.msg408}` },
                )
                .setFooter({
                    iconURL: interaction.guild.iconURL({ extension: 'png' }),
                    text: `${lang.msg411}`,
                })
                .setTimestamp()

            interaction.reply({
                embeds: [embed],
            })
        }
    }
}