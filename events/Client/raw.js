const client = require('../../index')

client.on("raw", (raw) => {
    client.riffy.updateVoiceState(raw)
});