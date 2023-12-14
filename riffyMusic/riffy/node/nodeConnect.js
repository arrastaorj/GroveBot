const client = require("../../../index")
require('colors')

client.riffy.on("nodeConnect", async (node) => {
    console.log("[LavaLink]".bgWhite, `> Conectado ao servidor ${node.name} com sucesso.`.white)
})