const discord = require("discord.js")
const client = require('../../index')
const comandos = require("../../database/models/comandos")
const Level = require("../../database/models/level")
const calculateLevelXp = require('../../plugins/calculateLevelXp');
const cooldowns = new Set()

client.on("messageCreate", async (message, member) => {


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


        const xpToGive = getRandomXp(5, 15)

        const query = {
            userId: message.author.id,
            guildId: message.guild.id,
        }

        try {
            const level = await Level.findOne(query)

            if (level) {
                level.xp += xpToGive

                if (level.xp > calculateLevelXp(level.level)) {
                    level.xp = 0
                    level.level += 1



                    client.channels.cache.get(cmd1).send(`**🎆 ${message.author}, Parabêns, você subiu para o nível: \`${level.level}\` **`)

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




})