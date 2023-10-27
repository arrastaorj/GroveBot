const fs = require("fs");
const bot = require('../bot.json');
const chalk = require('chalk');

module.exports = async (client) => {

  //Puxando os comandos em slash!
  const ArgsScommands = [];

  fs.readdir(`././commands/`, (err, fol) => {

    fol.forEach(subfol => {

      fs.readdir(`././commands/${subfol}/`, (er, files) => {

        files.forEach(command => {

          if (!command?.endsWith('.js')) return;

          command = require(`../commands/${subfol}/${command}`);

          if (!command?.name) return;

          client.slashCommands.set(command?.name, command);

          ArgsScommands.push(command)

        })

      })

    })

  });


  const GITHUB_REPO = 'arrastaorj/LexaV142023'; // Substitua com o nome do proprietário e repositório GitHub.
  const CHANNEL_ID = '1054128840642920468'; // Substitua pelo ID do canal onde você deseja que os logs de commit sejam enviados.

  //Carregando os slash.
  client.on("ready", async () => {

    //Carregando em 1 servidor.
    if (bot.slash.guild_id) {

      var server = client.guilds.cache.get(bot.slash.guild_id);

      if (!server) {
        console.log(chalk.hex(`FF0000`).bold(`[commands] > Servidor de carregamento inválido.`));
        process.exit();
      }

      try {

        server.commands.set(ArgsScommands);

        console.log(chalk.hex(`4169E1`).bold(`[commands] > Os comandos foram carregados em ${server.name}.`))
      } catch (e) {
        console.log(chalk.hex(`FF0000`).bold(`[commands] > Não foi possível carregar os comandos em ${server.name}.`));
        process.exit();
      }

    } else {
      //Carregando no global.

      try {

        client.application.commands.set(ArgsScommands);

        console.log(chalk.hex(`4169E1`).bold(`[commands] > Os comandos foram carregados globalmente.`))
      } catch (e) {
        console.log(chalk.hex(`FF0000`).bold(`[commands] > Não foi possível carregar os comandos globalmente.`));
        process.exit();
      }

    }


    const channel = client.channels.cache.get(CHANNEL_ID);

    if (channel) {
      // Use um intervalo para verificar regularmente os commits e enviar atualizações para o canal.
      setInterval(async () => {
        const latestCommit = await getLatestCommit(GITHUB_REPO);

        if (latestCommit) {
          // Verifique se o commit é diferente do último enviado (para evitar spam).
          if (latestCommit !== lastCommitSent) {
            lastCommitSent = latestCommit;
            channel.send(`Novo commit no repositório ${GITHUB_REPO}:\n${latestCommit}`);
          }
        }
      }, 60000); // Verifica a cada minuto. Você pode ajustar o intervalo conforme necessário.
    } else {
      console.error(`Canal com ID ${CHANNEL_ID} não encontrado.`);
    }



  })

  let lastCommitSent = ''; // Armazena o hash do último commit enviado.

  async function getLatestCommit(repo) {
    try {
      const response = await axios.get(`https://api.github.com/repos/${repo}/commits`);
      const latestCommit = response.data[0];

      const commitHash = latestCommit.sha;
      const commitMessage = latestCommit.commit.message;
      const commitAuthor = latestCommit.commit.author.name;
      const commitDate = latestCommit.commit.author.date;

      return `Hash do Commit: ${commitHash}\nAutor: ${commitAuthor}\nData do Commit: ${commitDate}\nMensagem do Commit: ${commitMessage}`;
    } catch (error) {
      console.error('Erro ao buscar o último commit:', error);
      return null;
    }
  }




  //Carregando os eventos.
  fs.readdir(`././Eventos/`, (err, fol) => {

    fol.forEach(subfol => {

      fs.readdir(`././Eventos/${subfol}/`, (er, files) => {

        files.forEach(evnt => {

          if (!evnt.endsWith('.js')) return;

          const e = require(`../Eventos/${subfol}/${evnt}`);

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

  });

}
