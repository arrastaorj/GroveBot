const client = require("../../index")
const Riffy = require("riffy")
const { nodes } = require("../../riffyMusic/configuration/index")
const loadRiffy = require("../../handler/riffy")
const { Spotify } = require("riffy-spotify")


const spotify = new Spotify({
  clientId: process.env.spotifyID,
  clientSecret: process.env.SpotifySecret,
});


client.riffy = new Riffy.Riffy(client, nodes, {
  send: (payload) => {
    const guild = client.guilds.cache.get(payload.d.guild_id)
    if (guild) guild.shard.send(payload)
  },
  defaultSearchPlatform: "ytmsearch",
  restVersion: "v4",
  plugins: [spotify]
});

//"ytsearch" | "ytmsearch" | "scsearch" | "spsearch" | "amsearch" | "dzsearch" | "ymsearch"
(async () => {
  await loadRiffy()
})()
