const discord = require("discord.js")
const schema = require("../../database/models/economia")
const skin = require("../../database/models/skin")

module.exports = {
    name: "teste",
    description: "tesss",
    type: discord.ApplicationCommandType.ChatInput,

    run: async (client, interaction, args) => {




        let painel = new discord.ActionRowBuilder().addComponents(new discord.StringSelectMenuBuilder()
            .setCustomId('menu')
            .setPlaceholder('Selecione uma imagem a baixo.')
            .addOptions([
                {
                    label: 'Minecraft',
                    description: 'Minecraft Defaut',
                    value: 'mc',
                },
                {
                    label: 'League of Legends',
                    description: 'Sett Defaut',
                    value: 'sett',
                },
                {
                    label: 'League of Legends',
                    description: 'Vayne Arco Celeste',
                    value: 'vayne',
                },
            ])
        )


        const m = await interaction.reply({ components: [painel], fetchReply: true })

        const filtro = (i) => i.user.id === interaction.user.id

        const collector = m.createMessageComponentCollector({ filtro, time: 9000000 })

        collector.on('collect', async (i) => {
            try {
                if (!i.isStringSelectMenu()) return;
                let valor = i.values[0];
                
                if (i.customId === "menu") {
                    const attachments = {
                        mc: {
                            path: "https://cdn.discordapp.com/attachments/1063231058407079946/1065445574100398202/minecrafttt.png",
                            component: [painel, btnn]
                        },
                        sett: {
                            path: "https://cdn.discordapp.com/attachments/1063231058407079946/1065442957827784814/settt.png",
                            component: [painel, btnn2]
                        },

                        vayne: {
                            path: "https://cdn.discordapp.com/attachments/1063231058407079946/1065441816985481246/vaynearcoceleste.png",
                            component: [painel, btnn3]
                        },

                        soulfighter: {
                            path: "https://raw.githubusercontent.com/arrastaorj/flags/main/file222.png",
                            component: [painel, btnn5]
                        }
                    }

                    const attachment = attachments[valor];
                    if (!attachment) {
                        console.error(`Valor inválido: ${valor}`);
                        return;
                    }

                    // Adicione uma verificação para ver se o usuário comprou a imagem antes de atualizar
                    const usuarioID = i.user.id; // Obtenha o ID do usuário
                    const guildID = i.guild.id; // Obtenha o ID do servidor
                    const imagemComprada = attachment.path; // Obtenha o caminho da imagem

                    // Faça a consulta no banco de dados para verificar se o usuário comprou a imagem
                    const skins = await skin.findOne({
                        guildId: guildID,
                        userId: usuarioID
                    });

                    if (skins && (skins.Img1 === imagemComprada || skins.Img2 === imagemComprada || skins.Img3 === imagemComprada)) {
                        // O usuário comprou a imagem, então atualize a mensagem
                        const file = new discord.AttachmentBuilder(attachment.path, `${i.user.tag}.png`);
                        await i.update({ files: [file], components: attachment.component });
                    } else {
                        i.reply({ content: `Usuário não possui a imagem comprada: ${valor}`, ephemeral: true });
                        // Você pode enviar uma mensagem para o usuário informando que ele não possui a imagem.
                    }


                }
            } catch (e) {
                console.error(e)
            }
        })

    }
}