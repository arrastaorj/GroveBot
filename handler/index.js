const fs = require("fs")
const bot = require('../bot.json')
const chalk = require('chalk')


module.exports = async (client) => {

  //Puxando os comandos em slash!
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


  //Carregando os slash.
  client.on("ready", async () => {

    //Carregando em 1 servidor.
    if (bot.slash.guild_id) {

      var server = client.guilds.cache.get(bot.slash.guild_id)

      if (!server) {
        console.log(chalk.hex(`FF0000`).bold(`[commands] > Servidor de carregamento inválido.`))
        process.exit()
      }

      try {

        server.commands.set(ArgsScommands)

        console.log(chalk.hex(`4169E1`).bold(`[commands] > Os comandos foram carregados em ${server.name}.`))
      } catch (e) {
        console.log(chalk.hex(`FF0000`).bold(`[commands] > Não foi possível carregar os comandos em ${server.name}.`))
        process.exit()
      }

    } else {
      //Carregando no global.
      try {

        client.application.commands.set(ArgsScommands)

        console.log(chalk.hex(`4169E1`).bold(`[commands] > Os comandos foram carregados globalmente.`))
      } catch (e) {
        console.log(chalk.hex(`FF0000`).bold(`[commands] > Não foi possível carregar os comandos globalmente.`))
        process.exit()
      }

    }
  })


  const express = require('express');
  const app = express();
  const bodyParser = require('body-parser');
  const { Client, GatewayIntentBits } = require('discord.js');
  
  // Configuração do servidor Express
  app.use(bodyParser.json());
  
  // Rota para receber mensagens do webhook do GitHub
  app.post('https://discord.com/api/webhooks/1167504574572146778/08Sa4u1rKYX2bszELras2NHVht9irHg9415uyIPjytBptN9gJ-KFvMU-X3ri-Gk_vbeJ/github', (req, res) => {
    // Processar e alterar a mensagem aqui
    const githubMessage = req.body;
  
    // Enviar a mensagem ao webhook do Discord
    const discordWebhookURL = 'https://discord.com/api/webhooks/1167504574572146778/08Sa4u1rKYX2bszELras2NHVht9irHg9415uyIPjytBptN9gJ-KFvMU-X3ri-Gk_vbeJ';
    const webhookClient = new webhookClient({ url: discordWebhookURL });
    webhookClient.send({
      content: `Mensagem do GitHub: ${githubMessage}`,
    });
  
    res.status(200).send('Mensagem recebida e enviada ao Discord');
  });
  
  
  // Iniciar o servidor Express
  const port = 3000;
  app.listen(port, () => {
    console.log(`Servidor Express ouvindo na porta ${port}`);
  });
  

  //Carregando os eventos.
  fs.readdir(`././Eventos/`, (err, fol) => {

    fol.forEach(subfol => {

      fs.readdir(`././Eventos/${subfol}/`, (er, files) => {

        files.forEach(evnt => {

          if (!evnt.endsWith('.js')) return

          const e = require(`../Eventos/${subfol}/${evnt}`)

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

    console.log(chalk.hex(`32CD32`).bold(`[Eventos] > Eventos carregados com sucesso.`))

  })

}
