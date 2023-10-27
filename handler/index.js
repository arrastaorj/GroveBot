const fs = require("fs")
const bot = require('../bot.json')
const chalk = require('chalk')
const axios = require('axios')
const discord = require("discord.js")

const express = require("express");
const app = express();
const port = 3000; // Defina a porta que desejar

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

    // const channel = client.channels.cache.get(process.env.CHANNEL_ID)

    // if (channel) {
    //   setInterval(async () => {
    //     const latestCommit = await getLatestCommit(process.env.GITHUB_REPO)

    //     if (latestCommit) {
    //       if (latestCommit !== lastCommitSent) {
    //         lastCommitSent = latestCommit

    //         // Função para formatar a data em pt-BR
    //         function formatDateToPtBR(date) {
    //           const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    //           return date.toLocaleString('pt-BR', options);
    //         }

    //         const embed = new discord.EmbedBuilder()
    //           .setColor('#26ff00')
    //           .setTitle('**Novo Commit no Repositório**')
    //           .addFields(
    //             { name: 'Repositório', value: process.env.GITHUB_REPO },
    //             { name: 'Hash do Commit', value: latestCommit.hash },
    //             { name: 'Autor', value: latestCommit.author },
    //             { name: 'Data/Hora do Commit', value: formatDateToPtBR(new Date(latestCommit.date)) },
    //             { name: 'Mensagem do Commit', value: latestCommit.message }
    //           )
    //           .setURL(latestCommit.url)

    //         channel.send({ embeds: [embed] })
    //       }
    //     }
    //   }, 60000)
    // } else {
    //   console.error(`Canal com ID ${process.env.CHANNEL_ID} não encontrado.`)
    // }
  })

  // let lastCommitSent = ''

  // async function getLatestCommit(repo) {
  //   try {
  //     const response = await axios.get(`https://api.github.com/repos/${repo}/commits`, {
  //       headers: {
  //         Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  //       },
  //     })
  //     const latestCommit = response.data[0]

  //     const commitHash = latestCommit.sha
  //     const commitMessage = latestCommit.commit.message
  //     const commitAuthor = latestCommit.commit.author.name
  //     const commitDate = latestCommit.commit.author.date

  //     return {
  //       hash: commitHash,
  //       author: commitAuthor,
  //       date: commitDate,
  //       message: commitMessage,
  //       url: latestCommit.html_url,
  //     }
  //   } catch (error) {
  //     console.error('Erro ao buscar o último commit:', error)
  //     return null
  //   }
  // }



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
