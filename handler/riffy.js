const { readdirSync } = require("fs")


async function loadRiffy() {

    readdirSync('./structures/riffy/').forEach(async dir => {
        const lavalink = readdirSync(`./structures/riffy/${dir}`).filter(file => file.endsWith('.js'))


        for (let file of lavalink) {
            try {
                let pull = require(`../structures/riffy/${dir}/${file}`)

                if (pull.name && typeof pull.name !== 'string') {
                    console.log(`🟥 Não foi possível carregar o evento riffy ${file}, error: O evento de propriedade deve ser uma string.`)
                    continue
                }

                pull.name = pull.name || file.replace('.js', '')

            } catch (err) {
                console.log(`🟥 Não foi possível carregar o evento riffy ${file}, error: ${err}`)
                console.log(err)
                continue
            }
        }
    })
}

module.exports = loadRiffy