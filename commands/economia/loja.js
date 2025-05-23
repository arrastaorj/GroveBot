
const {
    ApplicationCommandType,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require("discord.js")


const banco = require("../../database/models/banco")
const skin = require("../../database/models/skin")
const canalComandos = require("../../database/models/comandos")
const idioma = require("../../database/models/language")

module.exports = {
    name: "loja",
    description: "Veja os itens disponíveis para comprar na loja.",
    type: ApplicationCommandType.ChatInput,

    run: async (client, interaction, args) => {

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


        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('volta')
                .setEmoji('<:1095137898262695937:1166902501572870195>')
                .setDisabled(true)
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('home')
                .setLabel(`${lang.msg415} 1/3`)
                .setDisabled(true)
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('avancar')
                .setEmoji('<:1095137870882279564:1166902503703580704>')
                .setStyle(ButtonStyle.Primary),
        )

        const rowd = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('volta')
                .setEmoji('<:1095137898262695937:1166902501572870195>')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('home')
                .setLabel(`${lang.msg415} 3/3`)
                .setDisabled(true)
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('avancar')
                .setEmoji('<:1095137870882279564:1166902503703580704>')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(true)
        )
        const rows = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('volta')
                .setEmoji('<:1095137898262695937:1166902501572870195>')
                .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
                .setCustomId('home')
                .setLabel(`${lang.msg415} 2/3`)
                .setDisabled(true)
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('avancar')
                .setEmoji('<:1095137870882279564:1166902503703580704>')
                .setStyle(ButtonStyle.Primary),
        )


        const comprar1 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('comprar1')
                .setLabel('110.000')
                .setEmoji("<:Lecoin:1059125860524900402>")
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId('info1')
                .setEmoji("<:info:1167105337648742553>")
                .setStyle(ButtonStyle.Secondary),
        )
        const comprar11 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('comprar11')
                .setLabel(`${lang.msg416}`)
                .setEmoji("<:padlock_5754374:1166904628672213044>")
                .setDisabled(true)
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('info11')
                .setEmoji("<:info:1167105337648742553>")
                .setStyle(ButtonStyle.Secondary),
        )
        const comprar2 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('comprar2')
                .setLabel('210.000')
                .setEmoji("<:Lecoin:1059125860524900402>")
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId('info2')
                .setEmoji("<:info:1167105337648742553>")
                .setStyle(ButtonStyle.Secondary),
        )
        const comprar22 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('comprar22')
                .setLabel(`${lang.msg416}`)
                .setEmoji("<:padlock_5754374:1166904628672213044>")
                .setDisabled(true)
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('info22')
                .setEmoji("<:info:1167105337648742553>")
                .setStyle(ButtonStyle.Secondary),
        )
        const comprar3 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('comprar3')
                .setLabel('310.000')
                .setEmoji("<:Lecoin:1059125860524900402>")
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId('info3')
                .setEmoji("<:info:1167105337648742553>")
                .setStyle(ButtonStyle.Secondary),
        )
        const comprar33 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('comprar33')
                .setLabel(`${lang.msg416}`)
                .setEmoji("<:padlock_5754374:1166904628672213044>")
                .setDisabled(true)
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('info33')
                .setEmoji("<:info:1167105337648742553>")
                .setStyle(ButtonStyle.Secondary),

        )


        const verif = await skin.findOne({
            guildId: interaction.guild.id,
            userId: user.id,

        });

        if (verif && verif.Img1) {

            const m = await interaction.reply({
                content: '',
                files: [images[currentIndex]],
                components: [comprar11, row],
            })

            async function hasImage(user, imageNumber) {
                const verif = await skin.findOne({
                    guildId: interaction.guild.id,
                    userId: user.id,
                });

                return verif && verif[`Img${imageNumber}`];
            }



            const filtro = (i) => i.user.id === interaction.user.id;
            const collector = m.createMessageComponentCollector({ filtro, time: 9000000 });

            collector.on('collect', async (i) => {

                if (i.user != user) return i.reply({ content: `${lang.msg42} ${user}\n> \`-\` ${lang.msg43} \`\`/perfil\`\` ${lang.msg44}`, ephemeral: true })

                await i.deferUpdate();


                if (i.isButton()) {
                    if (i.customId === 'volta') {
                        currentIndex = (currentIndex - 1 + images.length) % images.length;
                    } else if (i.customId === 'avancar') {
                        currentIndex = (currentIndex + 1) % images.length;
                    }
                }

                const currentImageNumber = currentIndex + 1;
                const userHasImage = await hasImage(user, currentImageNumber);

                let components;

                if (userHasImage) {
                    if (currentIndex === maxIndex) {
                        components = [comprar33, rowd];
                    } else if (currentIndex === maxIndex2) {
                        components = [comprar22, rows];
                    } else {
                        components = [comprar11, row];
                    }
                } else {
                    components = currentIndex === maxIndex ? [comprar3, rowd] : currentIndex === maxIndex2 ? [comprar2, rows] : [comprar1, row];
                }

                await i.editReply({
                    content: '',
                    files: [images[currentIndex]],
                    components: components,
                });



                async function buySkin(interaction, user, cost, image, imgField) {
                    let data = await banco.findOne({
                        guildId: interaction.guild.id,
                        userId: user.id,
                    });

                    if (!data) {
                        data = await banco.create({
                            guildId: interaction.guild.id,
                            userId: user.id,
                        });
                    }

                    const verif = await skin.findOne({
                        guildId: interaction.guild.id,
                        userId: user.id,
                    });

                    if (verif && verif[imgField]) {
                        return await i.followUp({ content: `> \`-\` ${interaction.user} ${lang.msg46} \`/perfil\`. `, ephemeral: true });
                    }

                    if (data.saldo < cost) {
                        await i.followUp({ content: `> \`-\` ${interaction.user} ${lang.msg47}`, ephemeral: true });
                    } else {
                        await i.followUp({ content: `> \`+\` ${interaction.user} ${lang.msg48} \`/perfil\`.`, ephemeral: true });

                        data.saldo -= cost;
                        await data.save();

                        const imagemComprada = image;

                        const skins = await skin.findOne({
                            guildId: interaction.guild.id,
                            userId: user.id,
                        });

                        const newCmd = {
                            guildId: interaction.guild.id,
                            userId: user.id,
                        };

                        if (imagemComprada) {
                            newCmd[imgField] = imagemComprada;
                        }

                        if (!skins) {
                            await skin.create(newCmd);
                        } else {
                            if (!imagemComprada) {
                                await skin.findOneAndUpdate({
                                    guildId: interaction.guild.id,
                                    userId: user.id,
                                }, { $unset: { [imgField]: "" } });
                            } else {
                                await skin.findOneAndUpdate({
                                    guildId: interaction.guild.id,
                                    userId: user.id,
                                }, { $set: { [imgField]: imagemComprada } });
                            }
                        }
                    }
                }

                if (i.customId === 'comprar1') {
                    await buySkin(i, user, 110000, "././img/perfil/minecraft.png", "Img1");
                }

                if (i.customId === 'comprar2') {
                    await buySkin(i, user, 210000, "././img/perfil/sett.png", "Img2");
                }

                if (i.customId === 'comprar3') {
                    await buySkin(i, user, 310000, "././img/perfil/vaynearcoceleste.png", "Img3");
                }



                const customIds = ['info1', 'info11', 'info2', 'info22', 'info3', 'info33']

                for (const customId of customIds) {
                    if (i.customId === customId) {
                        await i.followUp({ content: `${lang.msg49}`, ephemeral: true })
                        break;
                    }
                }

            })

        } else {

            const m = await interaction.reply({
                content: "",
                files: [images[currentIndex]],
                components: [comprar1, row],
            })

            async function hasImage(user, imageNumber) {
                const verif = await skin.findOne({
                    guildId: interaction.guild.id,
                    userId: user.id,
                });

                return verif && verif[`Img${imageNumber}`];
            }



            const filtro = (i) => i.user.id === interaction.user.id;
            const collector = m.createMessageComponentCollector({ filtro, time: 9000000 });

            collector.on('collect', async (i) => {

                if (i.user != user) return i.reply({ content: `${lang.msg42} ${user}\n> \`-\` ${lang.msg43} \`\`/perfil\`\` ${lang.msg44}`, ephemeral: true })

                await i.deferUpdate();

                // Atualiza o índice com base no botão pressionado
                if (i.isButton()) {
                    if (i.customId === 'volta') {
                        currentIndex = (currentIndex - 1 + images.length) % images.length;
                    } else if (i.customId === 'avancar') {
                        currentIndex = (currentIndex + 1) % images.length;
                    }
                }

                const currentImageNumber = currentIndex + 1;
                const userHasImage = await hasImage(user, currentImageNumber);

                let components;

                if (userHasImage) {
                    if (currentIndex === maxIndex) {
                        components = [comprar33, rowd];
                    } else if (currentIndex === maxIndex2) {
                        components = [comprar22, rows];
                    } else {
                        components = [comprar11, row];
                    }
                } else {
                    components = currentIndex === maxIndex ? [comprar3, rowd] : currentIndex === maxIndex2 ? [comprar2, rows] : [comprar1, row];
                }

                await i.editReply({
                    content: '',
                    files: [images[currentIndex]],
                    components: components,
                });



                async function buySkin(interaction, user, cost, image, imgField) {
                    let data = await banco.findOne({
                        guildId: interaction.guild.id,
                        userId: user.id,
                    });

                    if (!data) {
                        data = await banco.create({
                            guildId: interaction.guild.id,
                            userId: user.id,
                        });
                    }

                    const verif = await skin.findOne({
                        guildId: interaction.guild.id,
                        userId: user.id,
                    });

                    if (verif && verif[imgField]) {
                        return await i.followUp({ content: `> \`-\` ${interaction.user} ${lang.msg46} \`/perfil\`. `, ephemeral: true });
                    }

                    if (data.saldo < cost) {
                        await i.followUp({ content: `> \`-\` ${interaction.user} ${lang.msg47}`, ephemeral: true });
                    } else {
                        await i.followUp({ content: `> \`+\` ${interaction.user} ${lang.msg48} \`/perfil\`.`, ephemeral: true });

                        data.saldo -= cost;
                        await data.save();

                        const imagemComprada = image;

                        const skins = await skin.findOne({
                            guildId: interaction.guild.id,
                            userId: user.id,
                        });

                        const newCmd = {
                            guildId: interaction.guild.id,
                            userId: user.id,
                        };

                        if (imagemComprada) {
                            newCmd[imgField] = imagemComprada;
                        }

                        if (!skins) {
                            await skin.create(newCmd);
                        } else {
                            if (!imagemComprada) {
                                await skin.findOneAndUpdate({
                                    guildId: interaction.guild.id,
                                    userId: user.id,
                                }, { $unset: { [imgField]: "" } });
                            } else {
                                await skin.findOneAndUpdate({
                                    guildId: interaction.guild.id,
                                    userId: user.id,
                                }, { $set: { [imgField]: imagemComprada } });
                            }
                        }
                    }
                }

                if (i.customId === 'comprar1') {
                    await buySkin(i, user, 110000, "././img/perfil/minecraft.png", "Img1");
                }

                if (i.customId === 'comprar2') {
                    await buySkin(i, user, 210000, "././img/perfil/sett.png", "Img2");
                }

                if (i.customId === 'comprar3') {
                    await buySkin(i, user, 310000, "././img/perfil/vaynearcoceleste.png", "Img3");
                }


                const customIds = ['info1', 'info11', 'info2', 'info22', 'info3', 'info33']

                for (const customId of customIds) {
                    if (i.customId === customId) {
                        await i.followUp({ content: `${lang.msg49}`, ephemeral: true })
                        break;
                    }
                }


            })

        }
    }
}