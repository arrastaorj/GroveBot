const discord = require("discord.js")
const { GatewayIntentBits, Partials } = require('discord.js')
require('dotenv').config()


const config = require("./plugins/config")


const { readdirSync } = require("fs")
const Riffy = require("riffy")
const { nodes } = require("./structures/configuration/index")



const client = new discord.Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
  ],
  partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember, Partials.Reaction]
})

console.clear()

module.exports = client

client.slashCommands = new discord.Collection()
client.aliases = new discord.Collection()

require('./handler')(client)

const connectiondb = require("./database/connect")
connectiondb.start()


client.language = config.language || "pt";


client.riffy = new Riffy.Riffy(client, nodes, {
  send: (payload) => {
    const guild = client.guilds.cache.get(payload.d.guild_id);
    if (guild) guild.shard.send(payload);
  },
  defaultSearchPlatform: "ytmsearch",
  restVersion: "v3"
});


(async () => {
  await loadRiffy();
})()


async function loadRiffy() {


  readdirSync('./structures/riffy/').forEach(async dir => {
    const lavalink = readdirSync(`./structures/riffy/${dir}`).filter(file => file.endsWith('.js'));


    for (let file of lavalink) {
      try {
        let pull = require(`./structures/riffy/${dir}/${file}`);

        if (pull.name && typeof pull.name !== 'string') {
          console.log(`🟥 Não foi possível carregar o evento riffy ${file}, error: O evento de propriedade deve ser uma string.`)
          continue;
        }

        pull.name = pull.name || file.replace('.js', '');

      } catch (err) {
        console.log(`🟥 Não foi possível carregar o evento riffy ${file}, error: ${err}`)
        console.log(err)
        continue;
      }
    }
  })
}










//tokenGrove
//tokenTest
client.login(process.env.tokenGrove)


process.on('unhandRejection', (reason, promise) => {
  console.log(`❗ | [Erro]\n\n` + reason, promise)
})
process.on('uncaughtException', (error, origin) => {
  console.log(`❗ | [Erro]\n\n` + error, origin)
})
process.on('uncaughtExceptionMonitor', (error, origin) => {
  console.log(`❗ | [Erro]\n\n` + error, origin)
})