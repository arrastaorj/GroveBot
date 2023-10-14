// const discord = require("discord.js")
// const db = require("quick.db")
// const schema = require("../../database/models/currencySchema")
// const skin = require("../../database/models/skin")

// module.exports = {
//     name: "loja",
//     description: "Veja os itens disponíveis para comprar na loja.",
//     type: discord.ApplicationCommandType.ChatInput,

//     run: async (client, interaction, args) => {

//         let user = interaction.user


//         let painel = new discord.ActionRowBuilder().addComponents(new discord.StringSelectMenuBuilder()
//             .setCustomId('menu')
//             .setPlaceholder('Selecione uma imagem a baixo.')
//             .addOptions([
//                 {
//                     label: 'Minecraft',
//                     description: 'Skin do minecraft.',
//                     //emoji: '<:image:1065753799727271977>',
//                     value: 'mc',
//                 },
//                 {
//                     label: 'League of Legends',
//                     description: 'Skin do Sett.',
//                     //emoji: '<:image:1065753799727271977>',
//                     value: 'sett',
//                 },
//                 {
//                     label: 'League of Legends',
//                     description: 'Skin da vayne.',
//                     //emoji: '<:image:1065753799727271977>',
//                     value: 'vayne',
//                 },
//             ])
//         )

//         interaction.reply({ components: [painel] }).then(() => {

//             let filtro = msg => msg.user.id === interaction.user.id
//             let coletor = interaction.channel.createMessageComponentCollector({ filter: filtro, time: 180000 })

//             coletor.on('collect', async (i) => {

//                 try {

//                     if (!i.isStringSelectMenu()) return

//                     let valor = i.values[0]

//                     if (i.customId === "menu") {

//                         const attachments = {
//                             mc: {
//                                 path: "https://cdn.discordapp.com/attachments/1063231058407079946/1065445574100398202/minecrafttt.png",
//                                 component: [painel]
//                             },
//                             sett: {
//                                 path: "https://cdn.discordapp.com/attachments/1063231058407079946/1065442957827784814/settt.png",
//                                 component: [painel]
//                             },
//                             vayne: {
//                                 path: "https://cdn.discordapp.com/attachments/1063231058407079946/1065441816985481246/vaynearcoceleste.png",
//                                 component: [painel]
//                             }
//                         }

//                         const attachment = attachments[valor]
//                         if (!attachment) {
//                             console.error(`Valor inválido: ${valor}`)
//                             return
//                         }

//                         const file = new discord.AttachmentBuilder(attachment.path, `${interaction.user.tag}.png`)

//                         await i.update({ files: [file], components: attachment.component })

//                     }

//                 } catch (e) {

//                 }
//             })
//             //     coletor.on("collect", async (c) => {


//             //         let data
//             //         try {
//             //             data = await schema.findOne({
//             //                 userId: interaction.user.id,
//             //             })

//             //             if (!data) {
//             //                 data = await schema.create({
//             //                     userId: schema.user.id,
//             //                     guildId: interaction.guild.id,
//             //                 })
//             //             }
//             //         } catch (err) {
//             //             await interaction.reply({
//             //                 content: "> \`-\` Ocorreu um erro ao executar este comando...",
//             //                 ephemeral: true,
//             //             })
//             //         }



//             //         let valor = c.values[0]


//             //         if (valor === "minecraft") {
//             //             if (data.wallet.toLocaleString() < 1.000) {
//             //                 c.reply(`${interaction.user} Você não possui \`1000 moedas\` para comprar a skin.`);
//             //             } else {

//             //                 data.wallet -= 1000;
//             //                 await data.save()



//             //                 c.reply({ content: `${interaction.user} Você comprou a skin.` })


//             //                 const imagemComprada = ("https://cdn.discordapp.com/attachments/1063231058407079946/1065445574100398202/minecrafttt.png")


//             //                 const skins = await skin.findOne({
//             //                     userId: user.id,
//             //                     guildId: interaction.guild.id
//             //                 })


//             //                 if (!skins) {
//             //                     const newCmd = {
//             //                         userId: user.id,
//             //                         guildId: interaction.guild.id
//             //                     }
//             //                     if (imagemComprada) {
//             //                         newCmd.Img1 = imagemComprada
//             //                     }

//             //                     await skin.create(newCmd)

//             //                 } else {

//             //                     if (!imagemComprada) {
//             //                         await skin.findOneAndUpdate({
//             //                             userId: user.id,

//             //                         }, { $unset: { "Img1": "" } })
//             //                     } else {
//             //                         await skin.findOneAndUpdate({
//             //                             userId: user.id,
//             //                         }, { $set: { "Img1": imagemComprada } })
//             //                     }


//             //                 }

//             //             }

//             //         } else if (valor === "sett") {

//             //             if (data.wallet.toLocaleString() < 5.000) {
//             //                 c.reply(`${interaction.user} Você não possui \`5000 moedas\` para comprar roupa.`)
//             //             } else {

//             //                 c.reply(`${interaction.user} Você comprou 1 roupa por 5000 moedas!\nVeja seu inventário com \`/inventário\`.`)

//             //                 data.wallet -= 5000
//             //                 await data.save()

//             //             }

//             //         } else if (valor === "vayne") {

//             //             if (data.wallet.toLocaleString() < 6.500) {
//             //                 c.reply(`${interaction.user} Você não possui \`6500 moedas\` para comprar um aparelho digital.`)
//             //             } else {

//             //                 c.reply(`${interaction.user} Você comprou 1 aparelho digital por 6500 moedas!\nVeja seu inventário com \`/inventário\`.`)


//             //                 data.wallet -= 6500
//             //                 await data.save()

//             //             }

//             //         }
//             //     })

//         })


//     }
// }