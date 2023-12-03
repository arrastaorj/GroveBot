const client = require("../../../index")

client.riffy.on("nodeError", async (node, error) => {
    console.log(`🟥 Node ${node.name} encontrou um erro: ${error.message}`)
})