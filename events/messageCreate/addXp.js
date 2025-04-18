const discord = require("discord.js")
const client = require('../../index')
const comandos = require("../../database/models/comandos")
const Level = require("../../database/models/level")
const calculateLevelXp = require('../../plugins/calculateLevelXp');
const cooldowns = new Set()
const idioma = require("../../database/models/language")
const canvafy = require("canvafy");

client.on("messageCreate", async (message, member) => {

    try {


        let lang = await idioma.findOne({
            guildId: message.guild.id
        })
        lang = lang ? require(`../../languages/${lang.language}.js`) : require('../../languages/pt.js')


        if (message.guild && message.guild.id) {

            const cmd = await comandos.findOne({
                guildId: message.guild.id
            })


            if (!cmd) return

            let cmd1 = cmd.canal1

            if (!cmd1) return

            function getRandomXp(min, max) {
                min = Math.ceil(min)
                max = Math.floor(max)
                return Math.floor(Math.random() * (max - min + 1)) + min
            }


            if (message.author.bot) return
            if (message.channel.type === 'dm') return


            const xpToGive = getRandomXp(1, 20)

            const query = {
                userId: message.author.id,
                guildId: message.guild.id,
            }

            try {
                const level = await Level.findOne(query)

                if (level) {

                    level.xp += xpToGive
                    const xpNeededForNextLevel = calculateLevelXp(level.level + 1);

                    if (level.xp > xpNeededForNextLevel) {
                        level.xp = 0;
                        level.level += 1;


                        // Criando a imagem de Level Up com Canvafy
                        const levelUpImage = await new canvafy.LevelUp()
                            .setAvatar(message.author.displayAvatarURL({ format: 'png', size: 1024 }))
                            .setBackground("image", "https://github.com/arrastaorj/flags/blob/main/rankAtendimento.jpg?raw=true")
                            .setUsername(message.author.username)
                            .setBorder("#000000")
                            .setAvatarBorder("#ff0000")
                            .setOverlayOpacity(0.7)
                            .setLevels(level.level - 1, level.level)  // Exibe o nível anterior e o atual
                            .build();

                        const attachment = new discord.AttachmentBuilder(levelUpImage, { name: "level_up.png" });

                        client.channels.cache.get(cmd1).send({

                            content: `**${message.author}, ${lang.msg347} \`${level.level}\`!**`,
                            files: [attachment]
                        })


                    }

                    await level.save().catch((e) => {
                        console.log(`Erro ao salvar o nível atualizado ${e}`)
                        return
                    })
                    cooldowns.add(message.author.id)
                    setTimeout(() => {
                        cooldowns.delete(message.author.id)
                    }, 60000)
                }

                // if (!level)
                else {
                    // create new level
                    const newLevel = new Level({
                        userId: message.author.id,
                        guildId: message.guild.id,
                        xp: xpToGive,
                    })

                    await newLevel.save()
                    cooldowns.add(message.author.id)
                    setTimeout(() => {
                        cooldowns.delete(message.author.id)
                    }, 60000)
                }
            } catch (error) {
                console.log(`Erro ao fornecer XP: ${error}`)
            }
        } else {
            return
        }

    } catch (e) {
        return
    }


})