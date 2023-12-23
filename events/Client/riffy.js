const client = require("../../index")
const Riffy = require("riffy")
const { nodes } = require("../../riffyMusic/configuration/index")
const loadRiffy = require("../../handler/riffy")


client.riffy = new Riffy.Riffy(client, nodes, {
  send: (payload) => {
    const guild = client.guilds.cache.get(payload.d.guild_id)
    if (guild) guild.shard.send(payload)
  },
  defaultSearchPlatform: "ytsearch",
  restVersion: "v4"
});

//"ytsearch" | "ytmsearch" | "scsearch" | "spsearch" | "amsearch" | "dzsearch" | "ymsearch"
(async () => {
  await loadRiffy()
})()

