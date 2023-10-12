const discord = require("discord.js")
const bot = require("../../bot.json")

module.exports = {
  name: "",
  description: "",
  type: discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: "",
      type: discord.ApplicationCommandOptionType.User,
      description: "",
      required: false
    },
  ],

  run: async (client, interaction) => {


  }
}