const discord = require("discord.js")

const { GatewayIntentBits, Partials } = require('discord.js')
require('dotenv').config()

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

client.login(process.env.token)


// process.on('unhandRejection', (reason, promise) => {
//   console.log(`❗ | [Erro]\n\n` + reason, promise)
// })
// process.on('uncaughtException', (error, origin) => {
//   console.log(`❗ | [Erro]\n\n` + error, origin)
// })
// process.on('uncaughtExceptionMonitor', (error, origin) => {
//   console.log(`❗ | [Erro]\n\n` + error, origin)
// })