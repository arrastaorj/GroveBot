const fs = require("fs")
require('colors')

module.exports = async (client) => {

  const ArgsScommands = []

  fs.readdir(`././commands/`, (err, fol) => {

    fol.forEach(subfol => {

      fs.readdir(`././commands/${subfol}/`, (er, files) => {

        files.forEach(command => {

          if (!command?.endsWith('.js')) return

          command = require(`../commands/${subfol}/${command}`)

          if (!command?.name) return

          client.slashCommands.set(command?.name, command)

          ArgsScommands.push(command)

        })

      })

    })

  })


  client.on("ready", async () => {

    try {

      client.application.commands.set(ArgsScommands)

      console.log("[commands]".bgMagenta, "> Os comandos foram carregados globalmente.".magenta)

    } catch (e) {
      console.log("[commands]".bgMagenta, "> Não foi possível carregar os comandos globalmente.".magenta)
      process.exit()
    }



  })

  fs.readdir('././events/', (err, fol) => {
    fol.forEach(subfol => {
      fs.readdir(`././events/${subfol}/`, (er, files) => {
        files.forEach(evnt => {
          if (!evnt.endsWith('.js')) return

          const e = require(`../events/${subfol}/${evnt}`)

          client.removeAllListeners(e.name)

          if (e.once) {
            client.once(e.name, (...args) =>
              e.execute(client, ...args))
          } else {
            client.on(e.name, (...args) =>
              e.execute(client, ...args))
          }
        })
      })
    })

    console.log("[Eventos]".bgYellow, "> Eventos carregados com sucesso.".yellow)
  })

}
