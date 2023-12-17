const client = require("../../../index")

client.riffy.on('trackError', async (player, track, payload) => {
    return console.log(payload)
})