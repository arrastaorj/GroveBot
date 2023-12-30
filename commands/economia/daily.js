const {
    ApplicationCommandType, EmbedBuilder,
} = require('discord.js')


const User = require("../../database/models/banco")



const ms = require("../../plugins/parseMs")
const comandos = require("../../database/models/comandos")
const idioma = require("../../database/models/language")


module.exports = {
    name: 'daily',
    description: 'Colete seus GroveCoins diários',
    type: ApplicationCommandType.ChatInput,


    run: async (client, interaction) => {

        let lang = await idioma.findOne({
            guildId: interaction.guild.id
        })
        lang = lang ? require(`../../languages/${lang.language}.js`) : require('../../languages/pt.js')




        const amount = Math.floor(Math.random() * 10000) + 1000;

        try {
            const query = {
                guildId: interaction.guild.id,
                userId: interaction.user.id,
            };

            let user = await User.findOne(query)

            if (user) {
                let timeout = 86400000;

                if (timeout - (Date.now() - user.lastDaily) > 0) {
                    const timeLeft = ms(timeout - (Date.now() - user.lastDaily));
                    interaction.reply({
                        content: `${interaction.user}\n${lang.msg15} **${timeLeft.hours}h e ${timeLeft.minutes}m** ${lang.msg16}`,
                        ephemeral: true,
                    });
                    return;
                }

                user.lastDaily = new Date()

            } else {
                return interaction.reply({
                    content: `> \`-\` <a:alerta:1163274838111162499> Você ainda não criou sua conta no banco. Utilize </conta bancaria:1190720716195254442> para cadastrar sua chave PIX e gerar sua conta.`,
                    ephemeral: false
                })

            }


            user.saldo += amount * 1;
            await user.save()



            const embed = new EmbedBuilder()
                .setColor('#41b2b0')
                .setTitle(`Recompensa Diário`)
                .setDescription(`Parabéns! Você acabou de resgatar seu prêmio diário.`)
                
                .setFields(
                    {
                        name: `${lang.msg17}`,
                        value: `<:dollar_9729309:1178199735799119892> **${amount.toLocaleString()} ${lang.msg18}`,
                        inline: true
                    },
                    {
                        name: `**Último daily**`,
                        value: `<:dollar_9729309:1178199735799119892> **${user.valorDaily.toLocaleString()} GroveCoins**`,
                        inline: true
                    },

                )
                .setFooter({
                    iconURL: interaction.user.displayAvatarURL({ extension: 'png' }),
                    text: `Solicitado por ${interaction.user.displayName}`,
                })
                .setTimestamp()


            interaction.reply({
                embeds: [embed],
            })

            user.valorDaily = amount
            await user.save()

        } catch (error) {
            console.log(`Error with /daily: ${error}`);
        }

    }
}