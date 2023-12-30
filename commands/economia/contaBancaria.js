const {
    ApplicationCommandType,
    ApplicationCommandOptionType,
    EmbedBuilder,

} = require("discord.js")

const comandos = require("../../database/models/comandos")
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

        const chavePix = interaction.options.getString("pix")

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
                .setTitle(`Conta bancária`)
                .setDescription(`Parabéns! Sua conta bancária foi criada com sucesso. Abaixo, você encontrará os detalhes da sua nova conta.`)
                .setThumbnail(interaction.user.displayAvatarURL({ extension: 'png' }))
                .setFields(
                    { name: `Servidor`, value: `${interaction.guild}`, inline: true },
                    { name: `Usuário`, value: `<@${interaction.user.id}>`, inline: true },
                    { name: `Chave Pix`, value: `${chavePix}`, inline: true },
                    { name: `Dica`, value: `Utilize sua chave PIX para efetuar transações de forma simples e rápida entre usuários.` },
                )
                .setFooter({
                    iconURL: interaction.user.displayAvatarURL({ extension: 'png' }),
                    text: `Solicitado por ${interaction.user.displayName}`,
                })
                .setTimestamp()

            interaction.reply({
                embeds: [embed],
            })

        } else {
        
            const guild = interaction.client.guilds.cache.get(query.guildId);

            const embed = new EmbedBuilder()
                .setColor('#41b2b0')
                .setTitle(`Conta bancária`)
                .setDescription(`Você já possui uma conta registrada. A seguir, apresentamos suas informações de conta.`)
                .setThumbnail(interaction.user.displayAvatarURL({ extension: 'png' }))

                .setFields(
                    { name: `Servidor`, value: `${guild}`, inline: true },
                    { name: `Usuário`, value: `<@${query.userId}>`, inline: true },
                    { name: `Chave Pix`, value: `${query.pix}`, inline: true },
                    { name: `Dica`, value: `Utilize sua chave PIX para efetuar transações de forma simples e rápida entre usuários.` },
                )
                .setFooter({
                    iconURL: interaction.guild.iconURL({ extension: 'png' }),
                    text: `Grove Banks`,
                })
                .setTimestamp()

            interaction.reply({
                embeds: [embed],
            })
        }
    }
}