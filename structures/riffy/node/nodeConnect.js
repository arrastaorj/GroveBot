const client = require("../../../index")

client.riffy.on("nodeConnect", async (node) => {
    console.log(`\n🟩 Node ${node.name} conectou.`)
})