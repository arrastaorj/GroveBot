const { readdirSync } = require("fs")
require('colors')

async function loadRiffy() {

    readdirSync('./structures/riffy/').forEach(async dir => {
        const lavalink = readdirSync(`./structures/riffy/${dir}`).filter(file => file.endsWith('.js'))


        for (let file of lavalink) {
            try {
                let pull = require(`../structures/riffy/${dir}/${file}`)

                if (pull.name && typeof pull.name !== 'string') {
                    console.log("[LavaLink]".bgRed, `Não foi possível carregar o evento riffy ${file}, error: O evento de propriedade deve ser uma string.`.red)
                    continue
                }

                pull.name = pull.name || file.replace('.js', '')

            } catch (err) {
                console.log("[LavaLink]".bgRed, `Não foi possível carregar o evento riffy ${file}, error: ${err}`.red)
                console.log(err)
                continue
            }
        }
    })
}

module.exports = loadRiffy