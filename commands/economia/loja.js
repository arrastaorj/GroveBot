const discord = require("discord.js")
const schema = require("../../database/models/economia")
const skin = require("../../database/models/skin")

module.exports = {
    name: "loja",
    description: "Veja os itens disponíveis para comprar na loja.",
    type: discord.ApplicationCommandType.ChatInput,

    run: async (client, interaction, args) => {

        const user = interaction.user

        // const images = [
        //     "././img/shop/soulfighter.png",
        //     "././img/shop/RazerEKillJoyu.png",
        //     "././img/shop/jett.png",
        // ]


        const images = [
            "././img/shop/minecraft.png",
            "././img/shop/sett.png",
            "././img/shop/vaynearcoceleste.png",
        ]

        let currentIndex = 0

        let maxIndex = images.length - 1

        let maxIndex2 = images.length - 2


        const row = new discord.ActionRowBuilder().addComponents(
            new discord.ButtonBuilder()
                .setCustomId('volta')
                .setLabel('⬅️')
                .setDisabled(true)
                .setStyle('Primary'),
            new discord.ButtonBuilder()
                .setCustomId('home')
                .setLabel(`Página 1/3`)
                .setDisabled(true)
                .setStyle('Secondary'),
            new discord.ButtonBuilder()
                .setCustomId('avancar')
                .setLabel('➡️')
                .setStyle('Primary')
        )

        const rowd = new discord.ActionRowBuilder().addComponents(
            new discord.ButtonBuilder()
                .setCustomId('volta')
                .setLabel('⬅️')
                .setStyle('Primary'),
            new discord.ButtonBuilder()
                .setCustomId('home')
                .setLabel(`Página 3/3`)
                .setDisabled(true)
                .setStyle('Secondary'),
            new discord.ButtonBuilder()
                .setCustomId('avancar')
                .setLabel('➡️')
                .setStyle('Primary')
                .setDisabled(true)
        )
        const rows = new discord.ActionRowBuilder().addComponents(
            new discord.ButtonBuilder()
                .setCustomId('volta')
                .setLabel('⬅️')
                .setStyle('Primary'),
            new discord.ButtonBuilder()
                .setCustomId('home')
                .setLabel(`Página 2/3`)
                .setDisabled(true)
                .setStyle('Secondary'),
            new discord.ButtonBuilder()
                .setCustomId('avancar')
                .setLabel('➡️')
                .setStyle('Primary')
        )


        const comprar1 = new discord.ActionRowBuilder().addComponents(
            new discord.ButtonBuilder()
                .setCustomId('comprar1')
                .setLabel('110.000')
                .setEmoji("<:Lecoin:1059125860524900402>")
                .setStyle('Success'),
        )
        const comprar2 = new discord.ActionRowBuilder().addComponents(
            new discord.ButtonBuilder()
                .setCustomId('comprar2')
                .setLabel('210.000')
                .setEmoji("<:Lecoin:1059125860524900402>")
                .setStyle('Success'),
        )
        const comprar3 = new discord.ActionRowBuilder().addComponents(
            new discord.ButtonBuilder()
                .setCustomId('comprar3')
                .setLabel('310.000')
                .setEmoji("<:Lecoin:1059125860524900402>")
                .setStyle('Success'),
        )


        const m = await interaction.reply({
            content: 'Loja Diária',
            files: [images[currentIndex]], // Use o índice atual para as imagens
            components: [comprar1, row], // Componentes padrão
        });

        const filtro = (i) => i.user.id === interaction.user.id;
        const collector = m.createMessageComponentCollector({ filtro, time: 9000000 });

        collector.on('collect', async (i) => {

            if (i.user != user) return i.reply({ content: `> \`-\` <a:alerta:1163274838111162499> Essa interação e somente do: ${user}\n> \`-\` Utilize \`\`/perfil\`\` para vizualizar seu perfil.`, ephemeral: true })

            await i.deferUpdate();

            // Atualiza o índice com base no botão pressionado
            if (i.isButton()) {
                if (i.customId === 'volta') {
                    currentIndex = (currentIndex - 1 + images.length) % images.length;
                } else if (i.customId === 'avancar') {
                    currentIndex = (currentIndex + 1) % images.length;
                }
            }

            // Define os componentes com base no índice atual
            const components =
                currentIndex === maxIndex
                    ? [comprar3, rowd]
                    : currentIndex === maxIndex2
                        ? [comprar2, rows]
                        : [comprar1, row];

            // Edita a resposta original
            await i.editReply({
                content: 'Loja Diária',
                files: [images[currentIndex]],
                components: components,
            })


            if (i.customId === 'comprar1') {

                let data

                data = await schema.findOne({
                    guildId: interaction.guild.id,
                    userId: user.id,
                })

                if (!data) {
                    data = await schema.create({
                        guildId: interaction.guild.id,
                        userId: user.id,
                    })
                }


                const verif = await skin.findOne({
                    guildId: interaction.guild.id,
                    userId: user.id,

                });

                if (verif && verif.Img1) {
                    return await i.followUp({ content: `${interaction.user} Você já possui esse item! Visualize e equipe no seu /perfil. `, ephemeral: true });
                }

                if (data.saldo.toLocaleString() < 110.000) {
                    await i.followUp({ content: `${interaction.user} Você não tem LexaCoins suficientes para essa compra.`, ephemeral: true })
                } else {

                    data.saldo -= 110000;
                    await data.save()

                    await i.followUp({ content: `${interaction.user} Você comprou Minecraft! Visualize e use no seu /perfil.`, ephemeral: true })


                    const imagemComprada = ("././img/shop/minecraft.png")


                    const skins = await skin.findOne({
                        guildId: interaction.guild.id,
                        userId: user.id
                    })


                    if (!skins) {
                        const newCmd = {
                            guildId: interaction.guild.id,
                            userId: user.id
                        }
                        if (imagemComprada) {
                            newCmd.Img1 = imagemComprada
                        }


                        await skin.create(newCmd)

                    } else {

                        if (!imagemComprada) {
                            await skin.findOneAndUpdate({
                                guildId: interaction.guild.id,
                                userId: user.id,

                            }, { $unset: { "Img1": "" } })
                        } else {
                            await skin.findOneAndUpdate({
                                guildId: interaction.guild.id,
                                userId: user.id,
                            }, { $set: { "Img1": imagemComprada } })
                        }

                    }

                }

            }

            if (i.customId === 'comprar2') {

                let data

                data = await schema.findOne({
                    guildId: interaction.guild.id,
                    userId: user.id,
                })

                if (!data) {
                    data = await schema.create({
                        guildId: interaction.guild.id,
                        userId: user.id,
                    })
                }


                const verif = await skin.findOne({
                    guildId: interaction.guild.id,
                    userId: user.id,
                });

                if (verif && verif.Img2) {
                    return await i.followUp({ content: `${interaction.user} Você já possui esse item! Visualize e equipe no seu /perfil. `, ephemeral: true });
                }

                if (data.saldo.toLocaleString() < 210.000) {
                    await i.followUp({ content: `${interaction.user} Você não tem LexaCoins suficientes para essa compra.`, ephemeral: true })
                } else {

                    await i.followUp({ content: `${interaction.user} Você comprou Sett Defaut! Visualize e use no seu /perfil.`, ephemeral: true })

                    data.saldo -= 210000
                    await data.save()


                    const imagemComprada = ("././img/shop/sett.png")


                    const skins = await skin.findOne({
                        guildId: interaction.guild.id,
                        userId: user.id
                    })


                    if (!skins) {
                        const newCmd = {
                            guildId: interaction.guild.id,
                            userId: user.id
                        }
                        if (imagemComprada) {
                            newCmd.Img2 = imagemComprada
                        }

                        await skin.create(newCmd)

                    } else {

                        if (!imagemComprada) {
                            await skin.findOneAndUpdate({
                                guildId: interaction.guild.id,
                                userId: user.id

                            }, { $unset: { "Img2": "" } })
                        } else {
                            await skin.findOneAndUpdate({
                                guildId: interaction.guild.id,
                                userId: user.id
                            }, { $set: { "Img2": imagemComprada } })
                        }


                    }

                }
            }

            if (i.customId === 'comprar3') {

                let data

                data = await schema.findOne({
                    guildId: interaction.guild.id,
                    userId: user.id,
                })

                if (!data) {
                    data = await schema.create({
                        guildId: interaction.guild.id,
                        userId: user.id
                    })
                }

                const verif = await skin.findOne({
                    guildId: interaction.guild.id,
                    userId: user.id
                });

                if (verif && verif.Img3) {
                    return await i.followUp({ content: `${interaction.user} Você já possui esse item! Visualize e equipe no seu /perfil. `, ephemeral: true });
                }

                if (data.saldo.toLocaleString() < 310.000) {

                    await i.followUp({ content: `${interaction.user} Você não tem LexaCoins suficientes para essa compra.`, ephemeral: true })

                } else {

                    await i.followUp({ content: `${interaction.user} Você comprou Vayne Arco Celeste! Visualize e use no seu /perfil.`, ephemeral: true })


                    data.saldo -= 310000
                    await data.save()


                    const imagemComprada = ("././img/shop/vaynearcoceleste.png")


                    const skins = await skin.findOne({
                        guildId: interaction.guild.id,
                        userId: user.id
                    })


                    if (!skins) {
                        const newCmd = {
                            guildId: interaction.guild.id,
                            userId: user.id
                        }
                        if (imagemComprada) {
                            newCmd.Img3 = imagemComprada
                        }

                        await skin.create(newCmd)

                    } else {

                        if (!imagemComprada) {
                            await skin.findOneAndUpdate({
                                guildId: interaction.guild.id,
                                userId: user.id,

                            }, { $unset: { "Img3": "" } })
                        } else {
                            await skin.findOneAndUpdate({
                                guildId: interaction.guild.id,
                                userId: user.id,
                            }, { $set: { "Img3": imagemComprada } })
                        }

                    }
                }
            }
        })
    }
}