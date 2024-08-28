const client = require("../../../index")
require('colors')

client.riffy.on("nodeError", async (node, error) => {
    console.log("[LavaLink]".bgRed, `${node.name} encontrou um erro ${error.message}`.red)
})