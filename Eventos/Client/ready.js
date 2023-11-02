const client = require('../../index');
const discord = require("discord.js")
const chalk = require("chalk");

client.on(`ready`, async() => {

    let status = [
        `use /config help`
      ],
    
        i = 0
    
      setInterval(() => {
        client.user.setPresence({
          activities: [{ name: `${status[i++ % status.length]}`, type: 3 }],
          status: 'online',
        })
      }, 1000 * 15)
      client.user.setStatus('online')

    console.log(chalk.hex(`4169E1`).bold(`[Bot-Status] > Estou online como: ${client.user.username}`))
});